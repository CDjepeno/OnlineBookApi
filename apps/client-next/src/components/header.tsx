"use client";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Paper } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext, AuthContextValue } from "@/context/AuthContext";
import { RouterEnum } from "@/types/enum/enum";
import { GET_BOOKINGS_USER_ROUTE } from "@/request/route-http/route-http";

type LinkMap = {
  [key: string]: string;
};

const formatLink = (page: string) => {
  const linkMap: LinkMap = {
    "Ajouter un livre": "/add-book",
  };
  return linkMap[page];
};

const pages = ["Ajouter un livre"];
const settings = ["Profile", "Dashboard", "Logout"];

function Header() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const { user, signout } = useContext(AuthContext) as AuthContextValue;
  const [notificationCount, setNotificationCount] = useState<null | number>(
    null
  );
  const [openNotifications, setOpenNotifications] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentPath(pathname)
  }, [pathname]);
  const isLoginPage = currentPath === "/login";
  const isSigUpPage = currentPath === "/register";

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenNotifications((prev) => !prev); 
    if (openNotifications) {
      setNotificationCount(0); 
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const socket = io("http://localhost:3000");
    if (user) {
      const eventKey = `notification:${user.id}`;

      socket.on("connect", () => {
        console.log("Connecté au WebSocket");
      });

      socket.on("connect_error", (error: unknown) => {
        console.error("Erreur de connexion au WebSocket :", error);
      });

      socket.on(eventKey, (data: string) => {
        console.log("Nouvelle notification reçue :", data);
        setNotifications((prev) => [...prev, data]);

        setNotificationCount((prev) => prev! + 1); 
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);
  if (!isMounted || currentPath === null) {
    return null; 
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            <LibraryBooksIcon
              sx={{ display: { xs: "none", md: "flex", color: "#fff" }, mr: 1 }}
            />
          </Link>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              OnlineBook
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Link href="/">
            <LibraryBooksIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
          </Link>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link href="/">OnlineBook</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {user && (
              <IconButton color="inherit" onClick={toggleNotifications}>
                <Badge
                  badgeContent={notificationCount} 
                  color="error" 
                  overlap="circular"
                >
                  <NotificationsIcon style={{ color: "white" }} />
                </Badge>

                {openNotifications && anchorEl && (
                  <Paper
                    sx={{
                      position: "absolute",
                      top: `${anchorEl.getBoundingClientRect().bottom}px`,
                      left: `0px`,
                      width: "400px",
                      maxHeight: "300px",
                      overflowY: "auto",
                      bgcolor: "background.paper",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", 
                      borderRadius: 2, 
                      zIndex: 1000,
                      padding: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        bgcolor: "green",
                        color: "white",
                        padding: 1,
                        borderRadius: 1,
                        textAlign: "center",
                      }}
                    >
                      Notifications
                    </Typography>

                    {notifications.length > 0 ? (
                      notifications.map((msg, index) => (
                        <Paper
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: 1,
                            marginBottom: 1,
                            border: "1px solid #e0e0e0", // Bordure discrète
                            borderRadius: 1,
                            transition: "background-color 0.2s",
                            "&:hover": {
                              bgcolor: "#f5f5f5", // Couleur survol
                            },
                          }}
                        >
                          <NotificationsIcon
                            sx={{ color: "green", marginRight: 1 }}
                            fontSize="small"
                          />
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {msg}
                          </Typography>
                        </Paper>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "center",
                          padding: 2,
                          color: "gray",
                        }}
                      >
                        Aucune notification pour le moment.
                      </Typography>
                    )}
                  </Paper>
                )}
              </IconButton>
            )}
            {pages.map((page) => (
              <Link
                key={page}
                href={formatLink(page)}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {user ? (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ) : (
                  page !== "Ajouter un livre" && (
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  )
                )}
              </Link>
            ))}
          </Box>

          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    {setting === "Logout" ? (
                      <Typography onClick={signout}>Logout</Typography>
                    ) : (
                      <Link
                        href={
                          setting === "Dashboard"
                            ? `${GET_BOOKINGS_USER_ROUTE}/${user.id}`
                            : `${RouterEnum.PROFILE}/${user.id}`
                        }
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </Link>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            !isLoginPage &&
            !isSigUpPage && (
              <Box>
                <Link href="/register">
                  <Button sx={{ color: "#fff" }}>Inscription</Button>
                </Link>
                <Link href="/login">
                  <Button sx={{ color: "#fff" }}>Connexion</Button>
                </Link>
              </Box>
            )
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
