import { ChessComGame } from "@/types/chessCom";
import { getPaddedNumber } from "./helpers";
import { LoadedGame } from "@/types/game";

export const getChessComUserRecentGames = async (
  username: string,
  signal?: AbortSignal,
  limit = 20
): Promise<LoadedGame[]> => {
  const games: ChessComGame[] = [];
  const date = new Date();
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  let monthsChecked = 0;

  while (games.length < limit && monthsChecked < 12) {
    const paddedMonth = getPaddedNumber(month);

    const res = await fetch(
      `https://api.chess.com/pub/player/${username}/games/${year}/${paddedMonth}`,
      { method: "GET", signal }
    );

    const data = await res.json();

    if (res.status >= 400) {
      // If the date is in the future, just skip this month
      if (data.message === "Date cannot be set in the future") {
        // Continue to the next month
      }
      // If user not found, throw immediately
      else if (data.message && data.message.includes("not found")) {
        throw new Error(data.message);
      }
      // Other errors
      else {
        throw new Error("Error fetching games from Chess.com");
      }
    } else {
      games.push(...(data?.games ?? []));
    }

    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
    monthsChecked++;
  }

  const gamesToReturn = games
    .filter((game) => game.pgn && game.end_time)
    .sort((a, b) => b.end_time - a.end_time)
    .slice(0, limit)
    .map(formatChessComGame);

  return gamesToReturn;
};

export const fetchChessComGame = async (
  gameUrl: string
): Promise<string | null> => {
  try {
    const res = await fetch(gameUrl);
    if (!res.ok) return null;
    const html = await res.text();
    const pgnMatch = html.match(/\[Event.*?(?=\n\n|$)/s);
    if (!pgnMatch) return null;
    return pgnMatch[0];
  } catch {
    return null;
  }
};

export const getChessComUserAvatar = async (
  username: string
): Promise<string | null> => {
  const usernameParam = encodeURIComponent(username.trim().toLowerCase());

  const res = await fetch(`https://api.chess.com/pub/player/${usernameParam}`);
  const data = await res.json();
  const avatarUrl = data?.avatar;

  return typeof avatarUrl === "string" ? avatarUrl : null;
};

const formatChessComGame = (data: ChessComGame): LoadedGame => {
  const result = data.pgn.match(/\[Result "(.*?)"]/)?.[1];
  const movesNb = data.pgn.match(/\d+?\. /g)?.length;

  return {
    id: data.uuid || data.url?.split("/").pop() || data.id,
    pgn: data.pgn || "",
    white: {
      name: data.white?.username || "White",
      rating: data.white?.rating || 0,
      title: data.white?.title,
    },
    black: {
      name: data.black?.username || "Black",
      rating: data.black?.rating || 0,
      title: data.black?.title,
    },
    result,
    timeControl: getGameTimeControl(data),
    date: data.end_time
      ? new Date(data.end_time * 1000).toLocaleDateString()
      : new Date().toLocaleDateString(),
    movesNb: movesNb ? movesNb * 2 : undefined,
    url: data.url,
    timestamp: data.end_time,
  };
};

const getGameTimeControl = (game: ChessComGame): string | undefined => {
  const rawTimeControl = game.time_control;
  if (!rawTimeControl) return undefined;

  const [firstPart, secondPart] = rawTimeControl.split("+");
  if (!firstPart) return undefined;

  const timeControl = Number(firstPart);
  const increment = secondPart ? `+${secondPart}` : "";
  if (timeControl < 60) return `${timeControl}s${increment}`;

  if (timeControl < 3600) {
    const minutes = Math.floor(timeControl / 60);
    const seconds = timeControl % 60;

    return seconds
      ? `${minutes}m${getPaddedNumber(seconds)}s${increment}`
      : `${minutes}m${increment}`;
  }

  const hours = Math.floor(timeControl / 3600);
  const minutes = Math.floor((timeControl % 3600) / 60);
  return minutes
    ? `${hours}h${getPaddedNumber(minutes)}m${increment}`
    : `${hours}h${increment}`;
};
