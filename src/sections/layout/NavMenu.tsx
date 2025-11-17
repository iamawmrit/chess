import NavLink from "@/components/NavLink";
import { Icon } from "@iconify/react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { SIDEBAR_WIDTH } from "./constants";

const MenuOptions = [
  { text: "Home", icon: "mdi:home", href: "/" },
  { text: "Play", icon: "streamline:chess-pawn", href: "/play" },
];

interface Props {
  open: boolean;
  variant: "temporary" | "permanent";
  onClose?: () => void;
  darkMode: boolean;
  switchDarkMode: () => void;
}

export default function NavMenu({
  open,
  variant,
  onClose,
  darkMode,
  switchDarkMode,
}: Props) {
  const sidebarBg = darkMode
    ? "linear-gradient(180deg, rgba(6,22,44,0.92) 0%, rgba(8,35,68,0.92) 55%, rgba(21,71,118,0.9) 100%)"
    : "linear-gradient(180deg, rgba(232,242,255,0.9) 0%, rgba(189,217,255,0.85) 100%)";
  const showThemeToggle = false;

  const handleClose = () => {
    if (variant === "temporary" && onClose) {
      onClose();
    }
  };

  return (
    <Drawer
      anchor="left"
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          background: sidebarBg,
          backdropFilter: "blur(20px)",
          borderRight: darkMode
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.06)",
          color: darkMode ? "#f3f6ff" : "#1b2735",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: variant === "permanent" ? "1.5rem 1rem 1rem" : "1rem",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1,
        }}
      >
        <Image src="/favicon-32x32.png" alt="Chessrith" width={32} height={32} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: 0.5 }}
          >
            Chessrith
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Game Intelligence
          </Typography>
        </Box>
        {showThemeToggle && (
          <IconButton onClick={switchDarkMode} color="inherit" size="small">
            {darkMode ? (
              <Icon icon="mdi:brightness-7" />
            ) : (
              <Icon icon="mdi:brightness-4" />
            )}
          </IconButton>
        )}
      </Box>
      <Divider sx={{ opacity: 0.3 }} />
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 0.5 }}>
        <List>
          {MenuOptions.map(({ text, icon, href }) => (
            <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
              <NavLink href={href}>
                <ListItemButton
                  onClick={handleClose}
                  sx={{
                    borderRadius: 1.5,
                    px: 1.5,
                    "&:hover": {
                      backgroundColor: darkMode
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(25,118,210,0.16)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    <Icon icon={icon} height="1.35em" />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
