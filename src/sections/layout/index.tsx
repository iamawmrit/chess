import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PropsWithChildren, useMemo } from "react";
import NavBar from "./NavBar";
import { red } from "@mui/material/colors";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MAIN_THEME_COLOR } from "@/constants";
import { SIDEBAR_WIDTH } from "./constants";

export default function Layout({ children }: PropsWithChildren) {
  const [isDarkMode, setDarkMode] = useLocalStorage("useDarkMode", true);

  const lightPaper = "rgba(248, 251, 255, 0.31)";
  const darkPaper = "rgba(18, 18, 18, 0.37)";
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          error: {
            main: red[400],
          },
          primary: {
            main: MAIN_THEME_COLOR,
          },
          secondary: {
            main: isDarkMode ? "#4242426d" : "#ffffff39",
          },
          background: {
            default: isDarkMode
              ? "rgba(10, 18, 32, 0.55)"
              : "rgba(40, 96, 155, 0.32)",
            paper: isDarkMode ? darkPaper : lightPaper,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              html: {
                minHeight: "100%",
              },
              body: {
                minHeight: "100%",
                backgroundColor: "transparent",
              },
              "#__next": {
                minHeight: "100%",
                position: "relative",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? darkPaper : lightPaper,
                backdropFilter: "blur(16px)",
                boxShadow: isDarkMode
                  ? "0 20px 48px rgba(0, 0, 0, 0.5)"
                  : "0 20px 48px rgba(25, 118, 210, 0.2)",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? darkPaper : lightPaper,
                backdropFilter: "blur(16px)",
              },
            },
          },
        },
      }),
    [darkPaper, isDarkMode, lightPaper]
  );

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  if (isDarkMode === null) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(/wallpaper.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          zIndex: 0,
          opacity: isDarkMode ? 0.68 : 0.48,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(165deg, rgba(17,40,73,0.75) 0%, rgba(22,58,104,0.45) 50%, rgba(73,128,181,0.35) 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <NavBar
          darkMode={isDarkMode}
          switchDarkMode={() => setDarkMode((val) => !val)}
        />
        <main
          style={{
            marginTop: "1vh",
            marginRight: "0.75vw",
            marginBottom: "1vh",
            marginLeft: isDesktop ? `calc(${SIDEBAR_WIDTH}px + 1.5vw)` : "1vw",
            transition: "margin-left 0.25s ease",
          }}
        >
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
