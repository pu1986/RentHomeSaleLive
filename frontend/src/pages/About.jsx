import React from "react";
import { Container, Typography } from "@mui/material";

export default function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>About Us</Typography>
      <Typography paragraph>
        RentHomeSale.com is an online platform where users can list, rent, buy, or sell properties easily.
      </Typography>
      <Typography paragraph>
        Our mission is to make property discovery easier, faster, and transparent. 
        Currently, our services are completely free, but we plan to add premium features in the future 
        such as verified listings, promotions, and agent services.
      </Typography>
      <Typography paragraph>
        Disclaimer: RentHomeSale.com is not a broker, agent, or property dealer. We only provide an online platform.
      </Typography>
    </Container>
  );
}
