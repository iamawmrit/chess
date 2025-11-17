import { useAtomValue } from "jotai";
import {
  boardAtom,
  boardOrientationAtom,
  currentPositionAtom,
  gameAtom,
  showBestMoveArrowAtom,
  showPlayerMoveIconAtom,
} from "../states";
import { useMemo } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Color } from "@/types/enums";
import Board from "@/components/board";
import { usePlayersData } from "@/hooks/usePlayersData";

export default function BoardContainer() {
  const screenSize = useScreenSize();
  const boardOrientation = useAtomValue(boardOrientationAtom);
  const showBestMoveArrow = useAtomValue(showBestMoveArrowAtom);
  const { white, black } = usePlayersData(gameAtom);

  const boardSize = useMemo(() => {
    const width = screenSize.width;
    const height = screenSize.height;

    // 1200 is the lg layout breakpoint
    if (window?.innerWidth < 1200) {
      return Math.min(width - 30, height - 180, 650);
    }

    // Maximize board for all screen sizes (13" to 32"+ displays)
    const sidebarOffset = 220; // Actual sidebar width
    const sidePanelsWidth = 640; // Two slim side panels (280-340px each) + gaps
    const horizontalMargins = 80; // Total margins/gaps

    const availableWidth = width - sidebarOffset - sidePanelsWidth - horizontalMargins;
    const availableHeight = height * 0.97; // Use 97% of viewport height

    // Progressive max sizes based on screen width
    let maxSize = 900; // Default max for large screens
    if (width >= 2560) maxSize = 1100; // 2K/4K displays
    else if (width >= 1920) maxSize = 950;  // Full HD+
    else if (width >= 1728) maxSize = 850;  // 14"/16" MacBook Pro
    else if (width >= 1440) maxSize = 750;  // 13" MacBook Pro

    return Math.min(availableWidth, availableHeight, maxSize);
  }, [screenSize]);

  return (
    <Board
      id="AnalysisBoard"
      boardSize={boardSize}
      canPlay={true}
      gameAtom={boardAtom}
      whitePlayer={white}
      blackPlayer={black}
      boardOrientation={boardOrientation ? Color.White : Color.Black}
      currentPositionAtom={currentPositionAtom}
      showBestMoveArrow={showBestMoveArrow}
      showPlayerMoveIconAtom={showPlayerMoveIconAtom}
      showEvaluationBar={true}
    />
  );
}
