import { useState, useEffect } from "react";
import { Box, Container, Avatar, Typography, Paper } from "@mui/material";
import UsernameInput from "./usernameInput";
import GamesList from "./gamesList";
import { LoadedGame } from "@/types/game";
import {
  getChessComUserRecentGames,
  getChessComUserAvatar,
} from "@/lib/chessCom";
import {
  getLichessUserRecentGames,
  getLichessUserProfile,
} from "@/lib/lichess";

export default function ProfileSection() {
  const [games, setGames] = useState<LoadedGame[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("cached-games");
      return cached ? JSON.parse(cached) : [];
    }
    return [];
  });
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<"chess.com" | "lichess">(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("chess-platform") as "chess.com" | "lichess") ||
        "chess.com"
      );
    }
    return "chess.com";
  });
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user-avatar") || "";
    }
    return "";
  });
  const [displayName, setDisplayName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user-display-name") || "";
    }
    return "";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUsername = localStorage.getItem("chess-username");
      if (savedUsername) setUsername(savedUsername);
    }
  }, []);

  const loadMoreGames = async () => {
    if (!username || loading || !hasMore) return;

    setLoading(true);
    try {
      const allGames =
        platform === "chess.com"
          ? await getChessComUserRecentGames(
              username,
              undefined,
              games.length + 20
            )
          : await getLichessUserRecentGames(
              username,
              undefined,
              games.length + 20
            );

      if (allGames.length === games.length) {
        setHasMore(false);
      } else {
        setGames(allGames);
        localStorage.setItem("cached-games", JSON.stringify(allGames));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshGames = async () => {
    if (!username || loading) return;

    setLoading(true);
    try {
      const newGames =
        platform === "chess.com"
          ? await getChessComUserRecentGames(username, undefined, 20)
          : await getLichessUserRecentGames(username, undefined, 20);

      setGames(newGames);
      localStorage.setItem("cached-games", JSON.stringify(newGames));
      setHasMore(true);

      if (platform === "chess.com") {
        const avatar = await getChessComUserAvatar(username);
        if (avatar) {
          setUserAvatar(avatar);
          localStorage.setItem("user-avatar", avatar);
        }
      } else {
        const profile = await getLichessUserProfile(username);
        if (profile) {
          setDisplayName(profile.name);
          localStorage.setItem("user-display-name", profile.name);
          if (profile.avatar) {
            setUserAvatar(profile.avatar);
            localStorage.setItem("user-avatar", profile.avatar);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" gap={4}>
        <UsernameInput
          onGamesLoaded={async (loadedGames, user, plat) => {
            setGames(loadedGames);
            setUsername(user);
            setPlatform(plat);
            setHasMore(true);
            localStorage.setItem("cached-games", JSON.stringify(loadedGames));

            if (plat === "chess.com") {
              const avatar = await getChessComUserAvatar(user);
              if (avatar) {
                setUserAvatar(avatar);
                localStorage.setItem("user-avatar", avatar);
              }
              setDisplayName(user);
              localStorage.setItem("user-display-name", user);
            } else {
              const profile = await getLichessUserProfile(user);
              if (profile) {
                setDisplayName(profile.name);
                localStorage.setItem("user-display-name", profile.name);
                if (profile.avatar) {
                  setUserAvatar(profile.avatar);
                  localStorage.setItem("user-avatar", profile.avatar);
                }
              } else {
                setDisplayName(user);
                localStorage.setItem("user-display-name", user);
              }
            }
          }}
        />
        {games.length > 0 && (
          <>
            <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                src={userAvatar}
                alt={displayName || username}
                sx={{ width: 80, height: 80 }}
              />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {displayName || username}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {platform === "chess.com" ? "Chess.com" : "Lichess"} •{" "}
                  {games.length} games loaded
                </Typography>
              </Box>
            </Paper>
            <GamesList
              games={games}
              username={username}
              onLoadMore={loadMoreGames}
              onRefresh={refreshGames}
              hasMore={hasMore}
              loading={loading}
            />
          </>
        )}
      </Box>
    </Container>
  );
}
