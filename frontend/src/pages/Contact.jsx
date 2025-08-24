import React from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

export default function Contact() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Contact Us</Typography>
      {/* <Typography paragraph>
        Have questions? Get in touch with us.
      </Typography>

      <Box component="form">
        <TextField fullWidth margin="normal" label="Your Name" />
        <TextField fullWidth margin="normal" label="Your Email" />
        <TextField fullWidth margin="normal" label="Message" multiline rows={4} />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Send Message
        </Button>
      </Box> */}

      <Box sx={{ mt: 4 }}>
        <Typography><strong>Email:</strong> renthomesale9@gmail.com</Typography>
        <Typography><strong>Phone:</strong> +91-8936891957</Typography>
        <Typography><strong>Address:</strong> PAP-R-250, Near Golden Garage, Rabale, Navi Mumbai - 400701.</Typography>
      </Box>
    </Container>
  );
}
