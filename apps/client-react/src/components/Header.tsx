import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuIcon from "@mui/icons-material/Menu";
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
import { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../context";
import {
  GET_BOOK_BY_USER_ROUTE,
  GET_BOOKINGS_USER_ROUTE,
} from "../request/route-http/route-http";
import { AuthContextValue } from "../types/user/auth.context.value";

type LinkMap = {
  [key: string]: string;
};

const formatLink = (page: string) => {
  const linkMap: LinkMap = {
    "Ajouter un livre": "/Add-book",
    Catégories: "/category",
  };
  return linkMap[page];
};

const pages = ["Ajouter un livre"];
const settings = ["Profile", "Dashboard", "Logout"];

function Header() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isSigUpPage = location.pathname === "/register";
  const { user, signout } = useContext(AuthContext) as AuthContextValue;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavLink to="/">
            <LibraryBooksIcon
              sx={{ display: { xs: "none", md: "flex", color: "#fff" }, mr: 1 }}
            />
          </NavLink>
          <Typography
            variant="h6"
            noWrap
            component={NavLink}
            to="/"
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
            OnlineBook
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
          <NavLink to="/">
            <LibraryBooksIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
          </NavLink>
          <Typography
            variant="h5"
            noWrap
            component={NavLink}
            to="/"
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
            OnlineBook
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <NavLink
                key={page}
                to={formatLink(page)}
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
              </NavLink>
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
                      <NavLink
                        to={
                          setting === "Dashboard"
                            ? `${GET_BOOKINGS_USER_ROUTE}/${user.id}`
                            : `${GET_BOOK_BY_USER_ROUTE}/${user.id}`
                        }
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </NavLink>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            !isLoginPage &&
            !isSigUpPage && (
              <Box>
                <NavLink to="/register">
                  <Button sx={{ color: "#fff" }}>Inscription</Button>
                </NavLink>
                <NavLink to="/login">
                  <Button sx={{ color: "#fff" }}>Connexion</Button>
                </NavLink>
              </Box>
            )
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
