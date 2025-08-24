import React from "react";
import { Container, Typography } from "@mui/material";

export default function Terms() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Terms & Conditions</Typography>
      <Typography variant="body1" paragraph>
        Welcome to RentHomeSale.com. By using this website, you agree to the following terms.
      </Typography>
      <Typography variant="h6">1. Use of Website</Typography>
      <Typography paragraph>
        You agree to use the website only for lawful purposes. You are responsible for your own actions and account security.
      </Typography>
      <Typography variant="h6">2. Property Listings</Typography>
      <Typography paragraph>
        All property details are posted by users. RentHomeSale.com does not guarantee the accuracy of any listing. Users must verify all property details themselves.
      </Typography>
      <Typography variant="h6">3. User Responsibility</Typography>
      <Typography paragraph>
        RentHomeSale.com is only a platform. Any transaction or agreement between users is their sole responsibility.
      </Typography>
      <Typography variant="h6">4. No Liability</Typography>
      <Typography paragraph>
        We are not liable for fraud, disputes, financial loss, or issues between users. Use this platform at your own risk.
      </Typography>
      <Typography variant="h6">5. Termination</Typography>
      <Typography paragraph>
        We may suspend or delete accounts that violate these terms.
      </Typography>
    </Container>
  );
}
