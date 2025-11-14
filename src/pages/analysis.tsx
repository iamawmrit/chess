import Board from "@/sections/analysis/board";
import PanelHeader from "@/sections/analysis/panelHeader";
import PanelToolBar from "@/sections/analysis/panelToolbar";
import AnalysisTab from "@/sections/analysis/panelBody/analysisTab";
import ClassificationTab from "@/sections/analysis/panelBody/classificationTab";
import MovesPanel from "@/sections/analysis/panelBody/classificationTab/movesPanel";
import { boardAtom, gameAtom, gameEvalAtom } from "@/sections/analysis/states";
import {
  Box,
  Divider,
  Grid2 as Grid,
  Tab,
  Tabs,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import EngineSettingsButton from "@/sections/engineSettings/engineSettingsButton";
import GraphTab from "@/sections/analysis/panelBody/graphTab";
import { PageTitle } from "@/components/pageTitle";

export default function GameAnalysis() {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  const gameEval = useAtomValue(gameEvalAtom);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);

  const showMovesTab = game.history().length > 0 || board.history().length > 0;

  useEffect(() => {
    const { pgn, lichessGameId, gameId, platform, id, g } = router.query;
    const hasUrlParams = pgn || lichessGameId || gameId || platform || id || g;

    if (!hasUrlParams && !showMovesTab) {
      const timer = setTimeout(() => {
        if (!showMovesTab) {
          router.replace("/");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [router, showMovesTab]);

  useEffect(() => {
    if (tab === 1 && !showMovesTab) setTab(0);
    if (tab === 2 && !gameEval) setTab(0);
  }, [showMovesTab, gameEval, tab]);

  return (
    <Grid container gap={2} justifyContent="center" alignItems="start" flexWrap={{ xs: "wrap", lg: "nowrap" }}>
      <PageTitle title="Chessrith Game Analysis" />

      {/* Left Panel - Analysis & Engine Lines with Moves List Below */}
      <Grid
        container
        justifyContent="start"
        alignItems="center"
        borderRadius={2}
        border={1}
        borderColor={"secondary.main"}
        sx={{
          backgroundColor: "secondary.main",
          borderColor: "primary.main",
          borderWidth: 2,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        padding={2}
        style={{
          maxWidth: "450px",
          minWidth: "350px",
        }}
        rowGap={2}
        height="calc(95vh - 60px)"
        display={{ xs: "none", lg: "flex" }}
        flexDirection="column"
        flexWrap="nowrap"
        size="auto"
      >
        <Box width="100%">
          <PanelHeader key="analysis-panel-header-left" />
          <Divider sx={{ marginX: "5%", marginTop: 2.5 }} />
        </Box>

        <AnalysisTab
          role="tabpanel"
          hidden={false}
          id="tabContent0-left"
        />

        {showMovesTab && (
          <>
            <Divider sx={{ marginX: "5%", marginY: 2 }} />
            <MovesPanel />
          </>
        )}

        <Box width="100%">
          <Divider sx={{ marginX: "5%", marginBottom: 1.5 }} />
          <PanelToolBar key="review-panel-toolbar-left" />
        </Box>
      </Grid>

      {/* Center - Board */}
      <Board />

      {/* Right Panel - Graph & Move Classification */}
      <Grid
        container
        justifyContent="start"
        alignItems="center"
        borderRadius={2}
        border={1}
        borderColor={"secondary.main"}
        sx={{
          backgroundColor: "secondary.main",
          borderColor: "primary.main",
          borderWidth: 2,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        padding={2}
        style={{
          maxWidth: "450px",
          minWidth: "350px",
        }}
        rowGap={2}
        height="calc(95vh - 60px)"
        display={{ xs: "none", lg: "flex" }}
        flexDirection="column"
        flexWrap="nowrap"
        size="auto"
      >
        {gameEval && (
          <>
            <GraphTab
              role="tabpanel"
              hidden={false}
              id="tabContent2-right"
            />
            <Divider sx={{ marginX: "5%", marginY: 2 }} />
          </>
        )}

        <ClassificationTab
          role="tabpanel"
          hidden={!showMovesTab}
          id="tabContent1-right"
        />
      </Grid>

      {/* Mobile View - Single Panel Below Board */}
      <Grid
        container
        justifyContent="start"
        alignItems="center"
        borderRadius={2}
        border={1}
        borderColor={"secondary.main"}
        sx={{
          backgroundColor: "secondary.main",
          borderColor: "primary.main",
          borderWidth: 2,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        padding={2}
        style={{
          maxWidth: "100%",
        }}
        rowGap={2}
        height={{ xs: "auto", sm: tab === 1 ? "40rem" : "auto" }}
        maxHeight={{ xs: "70vh" }}
        display={{ xs: "flex", lg: "none" }}
        flexDirection="column"
        flexWrap="nowrap"
        size={{
          xs: 12,
        }}
      >
        <PanelToolBar key="review-panel-toolbar-mobile" />

        {!gameEval && <Divider sx={{ marginX: "5%" }} />}
        {!gameEval && (
          <PanelHeader key="analysis-panel-header-mobile" />
        )}

        <Box
          width="95%"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            marginX: { sm: "5%", xs: undefined },
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            aria-label="basic tabs example"
            variant="fullWidth"
            sx={{ minHeight: 0 }}
          >
            <Tab
              label="Analysis"
              id="tab0"
              icon={<Icon icon="mdi:magnify" height={15} />}
              iconPosition="start"
              sx={{
                textTransform: "none",
                minHeight: 15,
                padding: "5px 0em 12px",
              }}
              disableFocusRipple
            />

            <Tab
              label="Moves"
              id="tab1"
              icon={<Icon icon="mdi:format-list-bulleted" height={15} />}
              iconPosition="start"
              sx={{
                textTransform: "none",
                minHeight: 15,
                display: showMovesTab ? undefined : "none",
                padding: "5px 0em 12px",
              }}
              disableFocusRipple
            />

            <Tab
              label="Graph"
              id="tab2"
              icon={<Icon icon="mdi:chart-line" height={15} />}
              iconPosition="start"
              sx={{
                textTransform: "none",
                minHeight: 15,
                display: gameEval ? undefined : "none",
                padding: "5px 0em 12px",
              }}
              disableFocusRipple
            />
          </Tabs>
        </Box>

        <GraphTab
          role="tabpanel"
          hidden={tab !== 2}
          id="tabContent2-mobile"
        />

        <AnalysisTab
          role="tabpanel"
          hidden={tab !== 0}
          id="tabContent0-mobile"
        />

        <ClassificationTab
          role="tabpanel"
          hidden={tab !== 1}
          id="tabContent1-mobile"
        />

        {gameEval && (
          <Box width="100%">
            <Divider sx={{ marginX: "5%", marginBottom: 2.5 }} />
            <PanelHeader key="analysis-panel-header-mobile-bottom" />
          </Box>
        )}
      </Grid>

      <EngineSettingsButton />
    </Grid>
  );
}
