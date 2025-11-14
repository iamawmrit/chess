import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LoadedGame } from "@/types/game";
import { getChessComUserRecentGames } from "@/lib/chessCom";
import { getLichessUserRecentGames } from "@/lib/lichess";
import { useRouter } from "next/router";
import { getGameFromPgn } from "@/lib/chess";

interface Props {
  onGamesLoaded: (
    games: LoadedGame[],
    username: string,
    platform: "chess.com" | "lichess"
  ) => void;
}

export default function UsernameInput({ onGamesLoaded }: Props) {
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chess-username") || "";
    }
    return "";
  });
  const [platform, setPlatform] = useState<"chess.com" | "lichess">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("chess-platform") as "chess.com" | "lichess") || "chess.com";
    }
    return "chess.com";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pgn, setPgn] = useState("");
  const [pgnError, setPgnError] = useState("");
  const [inputMode, setInputMode] = useState<"profile" | "pgn">("profile");
  const router = useRouter();

  const handleLoadGames = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const games =
        platform === "chess.com"
          ? await getChessComUserRecentGames(username.trim())
          : await getLichessUserRecentGames(username.trim());

      if (games.length === 0) {
        setError("No games found for this user");
      } else {
        localStorage.setItem("chess-username", username.trim());
        localStorage.setItem("chess-platform", platform);
        localStorage.setItem("cached-games", JSON.stringify(games));
        onGamesLoaded(games, username.trim(), platform);
      }
    } catch (err) {
      setError(
        `Failed to load games from ${platform}. Please check the username.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePgn = () => {
    if (!pgn.trim()) {
      setPgnError("Please enter a PGN");
      return;
    }

    try {
      const game = getGameFromPgn(pgn);
      const encodedPgn = encodeURIComponent(pgn);
      router.push(`/analysis?pgn=${encodedPgn}`);
    } catch (err) {
      setPgnError(err instanceof Error ? err.message : "Invalid PGN format");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      alignItems="center"
      sx={{
        p: 4,
        borderRadius: 2,
        border: 1,
        borderColor: "primary.main",
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h4" component="h1">
        {inputMode === "profile" ? "Load Your Chess Profile" : "Analyze a Game from PGN"}
      </Typography>

      <ToggleButtonGroup
        value={inputMode}
        exclusive
        onChange={(_, val) => val && setInputMode(val)}
        color="primary"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="profile">Load Profile</ToggleButton>
        <ToggleButton value="pgn">Analyze PGN</ToggleButton>
      </ToggleButtonGroup>

      {inputMode === "profile" ? (
        <>
          <ToggleButtonGroup
            value={platform}
            exclusive
            onChange={(_, val) => val && setPlatform(val)}
            color="primary"
          >
            <ToggleButton value="chess.com">Chess.com</ToggleButton>
            <ToggleButton value="lichess">Lichess</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLoadGames()}
            disabled={loading}
            sx={{ width: "100%", maxWidth: 400 }}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleLoadGames}
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            {loading ? <CircularProgress size={24} /> : "Load Games"}
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="Paste PGN here"
            value={pgn}
            onChange={(e) => {
              setPgn(e.target.value);
              setPgnError("");
            }}
            multiline
            rows={6}
            disabled={loading}
            sx={{ width: "100%", maxWidth: 600 }}
            placeholder="[Event ...]&#10;[Site ...]&#10;&#10;1. e4 e5 2. Nf3..."
          />

          {pgnError && (
            <Typography color="error" variant="body2">
              {pgnError}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleAnalyzePgn}
            sx={{ minWidth: 200 }}
          >
            Analyze Game
          </Button>
        </>
      )}
    </Box>
  );
}
