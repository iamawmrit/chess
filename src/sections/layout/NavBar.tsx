import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import NavMenu from "./NavMenu";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
interface Props {
  darkMode: boolean;
  switchDarkMode: () => void;
}

export default function NavBar({ darkMode, switchDarkMode }: Props) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (!isDesktop) {
      setMobileDrawerOpen(false);
    }
  }, [router.pathname, isDesktop]);

  const drawerOpen = isDesktop ? true : mobileDrawerOpen;

  return (
    <Box sx={{ flexGrow: 1, display: "flex" }}>
      <AppBar
        position="static"
        sx={{
          display: { xs: "flex", md: "none" },
          backgroundColor: "background.paper",
          color: darkMode ? "white" : "black",
        }}
        enableColorOnDark
      >
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: "min(0.5vw, 0.6rem)", padding: 1, my: 1 }}
            onClick={() => setMobileDrawerOpen(true)}
          >
            <Icon icon="mdi:menu" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <NavMenu
        open={drawerOpen}
        variant={isDesktop ? "permanent" : "temporary"}
        onClose={() => setMobileDrawerOpen(false)}
        darkMode={darkMode}
        switchDarkMode={switchDarkMode}
      />
    </Box>
  );
}
