import React from "react";
import { Container, Typography, Box } from "@mui/material";

const PolicyCompliance = () => {
  return (
    <Container maxWidth="md" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Policy and Compliance
      </Typography>
      
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard your personal data. We adhere to applicable data protection laws and strive to ensure that your information is processed securely and transparently.
        </Typography>
      </Box>
      
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Compliance Statement
        </Typography>
        <Typography variant="body1" paragraph>
          We are committed to operating in full compliance with all legal and regulatory requirements. Our internal policies and procedures are regularly reviewed to ensure that we maintain the highest standards of compliance.
        </Typography>
      </Box>
      
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing and using our services, you agree to be bound by our Terms and Conditions. Please review these terms carefully, as they govern your use of our platform.
        </Typography>
      </Box>
      
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Data Security
        </Typography>
        <Typography variant="body1" paragraph>
          We implement a variety of security measures to maintain the safety of your personal information. All sensitive data is stored securely and handled in accordance with industry best practices.
        </Typography>
      </Box>
      
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions or concerns regarding our policies or practices, please contact our support team at support@example.com.
        </Typography>
      </Box>
    </Container>
  );
};

export default PolicyCompliance;
