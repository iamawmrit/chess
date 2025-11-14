import { LoadedGame } from "@/types/game";
import { Box, Typography, Grid2 as Grid, Button, CircularProgress, IconButton } from "@mui/material";
import GameCard from "./gameCard";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

interface Props {
  games: LoadedGame[];
  username: string;
  platform: "chess.com" | "lichess";
  onLoadMore: () => void;
  onRefresh: () => void;
  hasMore: boolean;
  loading: boolean;
}

export default function GamesList({ games, username, platform, onLoadMore, onRefresh, hasMore, loading }: Props) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Recent Games
        </Typography>
        <IconButton onClick={onRefresh} disabled={loading}>
          <Icon icon="mdi:refresh" />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        {games.map((game) => (
          <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GameCard game={game} username={username} platform={platform} />
          </Grid>
        ))}
      </Grid>
      {hasMore && (
        <Box ref={observerRef} display="flex" justifyContent="center" mt={4}>
          {loading ? <CircularProgress /> : <Button onClick={onLoadMore}>Load More</Button>}
        </Box>
      )}
    </Box>
  );
}
