import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { PropsWithChildren, useMemo } from "react";
import NavBar from "./NavBar";
import { red } from "@mui/material/colors";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MAIN_THEME_COLOR } from "@/constants";

export default function Layout({ children }: PropsWithChildren) {
  const [isDarkMode, setDarkMode] = useLocalStorage("useDarkMode", false);

  const lightPaper = "rgba(248, 251, 255, 0.82)";
  const darkPaper = "rgba(32, 32, 32, 0.92)";
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
            main: isDarkMode ? "#424242" : "#ffffff",
          },
          background: {
            default: isDarkMode
              ? "rgba(17, 17, 17, 0.7)"
              : "rgba(227, 242, 253, 0.4)",
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
                backdropFilter: "blur(12px)",
                boxShadow: isDarkMode
                  ? "0 12px 40px rgba(0, 0, 0, 0.4)"
                  : "0 12px 40px rgba(25, 118, 210, 0.12)",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? darkPaper : lightPaper,
                backdropFilter: "blur(12px)",
              },
            },
          },
        },
      }),
    [darkPaper, isDarkMode, lightPaper]
  );

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
          opacity: isDarkMode ? 0.4 : 0.28,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <NavBar
          darkMode={isDarkMode}
          switchDarkMode={() => setDarkMode((val) => !val)}
        />
        <main style={{ margin: "2vh 1vw" }}>{children}</main>
      </div>
    </ThemeProvider>
  );
}
