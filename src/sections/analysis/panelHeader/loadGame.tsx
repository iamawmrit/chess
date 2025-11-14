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
  const boardOrientation = useAtomValue(boardOrientationAtom);
  const evaluationProgress = useAtomValue(evaluationProgressAtom);

  const joinedGameHistory = useMemo(() => game.history().join(), [game]);

  const resetAndSetGamePgn = useCallback(
    (pgn: string, orientation?: boolean, gameEval?: GameEval) => {
      const gameFromPgn = new Chess();
      gameFromPgn.loadPgn(pgn);
      const newOrientation = orientation ?? true;

      // If same game but different orientation, update orientation only
      if (joinedGameHistory === gameFromPgn.history().join()) {
        if (boardOrientation !== newOrientation) {
          setBoardOrientation(newOrientation);
        }
        return;
      }

      resetBoard(pgn);
      setEval(gameEval);
      setGamePgn(pgn);
      setBoardOrientation(newOrientation);
    },
    [
      joinedGameHistory,
      resetBoard,
      setGamePgn,
      setEval,
      setBoardOrientation,
      boardOrientation,
    ]
  );

  const {
    lichessGameId,
    pgn: pgnParam,
    orientation: orientationParam,
    gameId,
    platform,
    id,
    g,
  } = router.query;

  useEffect(() => {
    // Wait for router to be ready before attempting to load game
    if (!router.isReady) return;

    // Fallback: Parse URL directly for production builds
    const getQueryParam = (param: string): string | undefined => {
      if (router.query[param]) {
        return router.query[param] as string;
      }
      // Fallback for production
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || undefined;
      }
      return undefined;
    };

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
      // Check both router.query and direct URL parsing
      const gParam = getQueryParam('g');
      const idParam = getQueryParam('id');
      const pgnParamValue = getQueryParam('pgn');
      const lichessGameIdValue = getQueryParam('lichessGameId');
      const gameIdValue = getQueryParam('gameId');
      const platformValue = getQueryParam('platform');

      if (typeof gParam === "string" && !!gParam) {
        try {
          const { pgn, orientation } = JSON.parse(atob(gParam));
          if (pgn) {
            resetAndSetGamePgn(pgn, orientation === "white");
          }
        } catch (e) {
          console.error("Failed to decode game data", e);
        }
      } else if (typeof idParam === "string" && !!idParam) {
        const stored = localStorage.getItem(`game_${idParam}`);
        if (stored) {
          const {
            id: actualId,
            platform: actualPlatform,
            orientation: actualOrientation,
            pgn,
          } = JSON.parse(stored);
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
      } else if (typeof pgnParamValue === "string" && !!pgnParamValue) {
        const orientation = orientationParam === "white" || !orientationParam;
        resetAndSetGamePgn(decodeURIComponent(pgnParamValue), orientation);
      } else if (typeof lichessGameIdValue === "string" && !!lichessGameIdValue) {
        handleLichess(lichessGameIdValue);
      } else if (typeof gameIdValue === "string" && typeof platformValue === "string") {
        if (platformValue === "lichess") {
          handleLichess(gameIdValue);
        } else if (platformValue === "chess.com") {
          handleChessCom(gameIdValue);
        }
      }
    };

    loadGame();
  }, [
    pgnParam,
    lichessGameId,
    orientationParam,
    gameId,
    platform,
    id,
    g,
    resetAndSetGamePgn,
  ]);

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
