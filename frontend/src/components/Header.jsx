// components/Header.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

export default function Header({ user, onLogout }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton component={Link} to="/" color="inherit">
          <HomeIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ flexGrow: 1, ml: 1 }}
          component={Link}
          to="/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          RentHomeSale.Com
        </Typography>

        <Button color="inherit" component={Link} to="/post-property">
          Post Property
        </Button>

        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}

        {user && (
          <>
            {/* ✅ Normal user ke liye dashboard */}
            <Button color="inherit" component={Link} to="/user-dashboard">
              Dashboard
            </Button>

            {/* ✅ Agar user admin hai to admin panel bhi dikhe */}
            {user.isAdmin && (
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
            )}

            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
