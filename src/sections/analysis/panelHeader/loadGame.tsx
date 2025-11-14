import LoadGameButton from "../../loadGame/loadGameButton";
import { useCallback, useEffect, useMemo } from "react";
import { useChessActions } from "@/hooks/useChessActions";
import {
  boardAtom,
  boardOrientationAtom,
  evaluationProgressAtom,
  gameAtom,
  gameEvalAtom,
} from "../states";
import { useAtomValue, useSetAtom } from "jotai";
import { Chess } from "chess.js";
import { useRouter } from "next/router";
import { GameEval } from "@/types/eval";
import { fetchLichessGame } from "@/lib/lichess";
import { fetchChessComGame } from "@/lib/chessCom";

export default function LoadGame() {
  const router = useRouter();
  const game = useAtomValue(gameAtom);
  const { setPgn: setGamePgn } = useChessActions(gameAtom);
  const { resetToStartingPosition: resetBoard } = useChessActions(boardAtom);
  const setEval = useSetAtom(gameEvalAtom);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);
  const evaluationProgress = useAtomValue(evaluationProgressAtom);

  const joinedGameHistory = useMemo(() => game.history().join(), [game]);

  const resetAndSetGamePgn = useCallback(
    (pgn: string, orientation?: boolean, gameEval?: GameEval) => {
      const gameFromPgn = new Chess();
      gameFromPgn.loadPgn(pgn);
      if (joinedGameHistory === gameFromPgn.history().join()) return;

      resetBoard(pgn);
      setEval(gameEval);
      setGamePgn(pgn);
      setBoardOrientation(orientation ?? true);
    },
    [joinedGameHistory, resetBoard, setGamePgn, setEval, setBoardOrientation]
  );

  const { lichessGameId, pgn: pgnParam, orientation: orientationParam, gameId, platform, id, g } = router.query;

  useEffect(() => {
    const handleLichess = async (id: string) => {
      const res = await fetchLichessGame(id);
      if (typeof res === "string") {
        const orientation = orientationParam === "white" || !orientationParam;
        resetAndSetGamePgn(res, orientation);
      }
    };

    const handleChessCom = async (url: string) => {
      const res = await fetchChessComGame(url);
      if (typeof res === "string") {
        const orientation = orientationParam === "white" || !orientationParam;
        resetAndSetGamePgn(res, orientation);
      }
    };

    const loadGame = async () => {
      if (typeof g === "string" && !!g) {
        try {
          const { pgn, orientation } = JSON.parse(atob(g));
          if (pgn) {
            resetAndSetGamePgn(pgn, orientation === "white");
          }
        } catch (e) {
          console.error("Failed to decode game data", e);
        }
      } else if (typeof id === "string" && !!id) {
        const stored = localStorage.getItem(`game_${id}`);
        if (stored) {
          const { id: actualId, platform: actualPlatform, orientation: actualOrientation, pgn } = JSON.parse(stored);
          if (pgn) {
            resetAndSetGamePgn(pgn, actualOrientation === "white");
          } else if (actualPlatform === "lichess") {
            const res = await fetchLichessGame(actualId);
            if (typeof res === "string") {
              resetAndSetGamePgn(res, actualOrientation === "white");
            }
          } else if (actualPlatform === "chess.com") {
            const res = await fetchChessComGame(actualId);
            if (typeof res === "string") {
              resetAndSetGamePgn(res, actualOrientation === "white");
            }
          }
        }
      } else if (typeof pgnParam === "string" && !!pgnParam) {
        const orientation = orientationParam === "white" || !orientationParam;
        resetAndSetGamePgn(decodeURIComponent(pgnParam), orientation);
      } else if (typeof lichessGameId === "string" && !!lichessGameId) {
        handleLichess(lichessGameId);
      } else if (typeof gameId === "string" && typeof platform === "string") {
        if (platform === "lichess") {
          handleLichess(gameId);
        } else if (platform === "chess.com") {
          handleChessCom(gameId);
        }
      }
    };

    loadGame();
  }, [pgnParam, lichessGameId, orientationParam, gameId, platform, id, g, resetAndSetGamePgn]);

  useEffect(() => {
    const eventHandler = (event: MessageEvent) => {
      try {
        if (!event?.data?.pgn) return;
        const { pgn, orientation } = event.data as {
          pgn: string;
          orientation?: "white" | "black";
        };
        resetAndSetGamePgn(pgn, orientation !== "black");
      } catch (error) {
        console.error("Error processing message event:", error);
      }
    };
    window.addEventListener("message", eventHandler);

    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, [resetAndSetGamePgn]);

  const isGameLoaded =
    (!!game.getHeaders().White && game.getHeaders().White !== "?") ||
    game.history().length > 0;

  if (evaluationProgress) return null;

  return (
    <LoadGameButton
      label={isGameLoaded ? "Load another game" : "Load game"}
      size="small"
      onClick={isGameLoaded ? () => router.push("/") : undefined}
      setGame={async (game) => {
        await router.replace(
          {
            query: {},
            pathname: router.pathname,
          },
          undefined,
          { shallow: true, scroll: false }
        );
        resetAndSetGamePgn(game.pgn());
      }}
    />
  );
}
