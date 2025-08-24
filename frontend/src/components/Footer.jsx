import React from "react";
import { AppBar, Toolbar, Typography, Box, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <AppBar position="static" color="primary" sx={{ top: "auto", bottom: 0, p: 1 }}>
      <Toolbar sx={{ flexDirection: "column", textAlign: "center" }}>
        {/* Links */}
        <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
          <MuiLink component={Link} to="/terms" color="inherit" underline="hover">
            Terms & Conditions
          </MuiLink>
          <MuiLink component={Link} to="/privacy" color="inherit" underline="hover">
            Privacy Policy
          </MuiLink>
          <MuiLink component={Link} to="/about" color="inherit" underline="hover">
            About Us
          </MuiLink>
          <MuiLink component={Link} to="/contact" color="inherit" underline="hover">
            Contact Us
          </MuiLink>
        </Box>

        {/* Copyright */}
        <Typography variant="body2" color="inherit">
          &copy; {currentYear} RentHomeSale.com. All rights reserved.
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
