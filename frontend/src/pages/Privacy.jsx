import React from "react";
import { Container, Typography } from "@mui/material";

export default function Privacy() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
      <Typography paragraph>
        Your privacy is important to us. By using RentHomeSale.com, you agree to our privacy practices.
      </Typography>

      <Typography variant="h6">1. Information We Collect</Typography>
      <Typography paragraph>
        We may collect your name, email, phone number, and property details when you register or list a property.
      </Typography>

      <Typography variant="h6">2. How We Use Your Information</Typography>
      <Typography paragraph>
        To provide listing features and notify you about updates. Passwords are stored securely.
      </Typography>

      <Typography variant="h6">3. Data Sharing</Typography>
      <Typography paragraph>
        We do not sell or share your personal data. Information in property listings may be visible publicly.
      </Typography>

      <Typography variant="h6">4. Cookies</Typography>
      <Typography paragraph>
        We may use cookies to improve user experience.
      </Typography>

      <Typography variant="h6">5. User Responsibility</Typography>
      <Typography paragraph>
        You are responsible for the accuracy of the information you provide. We are not responsible for misuse of your data by others.
      </Typography>
    </Container>
  );
}
