import { LoadedGame } from "@/types/game";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";
import { gameAtom } from "@/sections/analysis/states";
import { getGameFromPgn } from "@/lib/chess";

interface Props {
  game: LoadedGame;
  username: string;
}

export default function GameCard({ game, username }: Props) {
  const router = useRouter();
  const setGame = useSetAtom(gameAtom);

  const whiteWon = game.result === "1-0";
  const blackWon = game.result === "0-1";
  const isDraw = game.result === "1/2-1/2";
  const isUserWhite = game.white.name.toLowerCase() === username.toLowerCase();
  const userWon = (isUserWhite && whiteWon) || (!isUserWhite && blackWon);
  const userLost = (isUserWhite && blackWon) || (!isUserWhite && whiteWon);

  const handleAnalyze = () => {
    const chessGame = getGameFromPgn(game.pgn);
    setGame(chessGame);
    const orientation = isUserWhite ? "white" : "black";
    const data = btoa(
      JSON.stringify({ id: game.id, pgn: game.pgn, orientation })
    );
    router.push(`/analysis?g=${data}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {game.result && (
          <Box mb={2}>
            <Chip
              label={
                isDraw
                  ? "Draw"
                  : userWon
                    ? "Won"
                    : userLost
                      ? "Lost"
                      : game.result
              }
              size="small"
              sx={{
                backgroundColor: userWon
                  ? "success.main"
                  : userLost
                    ? "error.main"
                    : "default",
                color: userWon || userLost ? "white" : "inherit",
                fontWeight: "bold",
              }}
            />
          </Box>
        )}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: "1px solid #000",
              }}
            />
            <Typography variant="h6" component="div" fontWeight="bold">
              {game.white.name}
            </Typography>
          </Box>
          <Chip
            label={game.white.rating}
            size="small"
            color={whiteWon ? "success" : "default"}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          vs
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#000",
              }}
            />
            <Typography variant="h6" component="div" fontWeight="bold">
              {game.black.name}
            </Typography>
          </Box>
          <Chip
            label={game.black.rating}
            size="small"
            color={blackWon ? "success" : "default"}
          />
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          {game.timeControl && (
            <Chip label={game.timeControl} size="small" variant="outlined" />
          )}
          {game.date && (
            <Chip label={game.date} size="small" variant="outlined" />
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleAnalyze}
          sx={{ mt: "auto" }}
        >
          Analyze
        </Button>
      </CardContent>
    </Card>
  );
}
