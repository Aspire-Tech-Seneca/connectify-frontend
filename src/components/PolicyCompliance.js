// src/components/PolicyCompliance.js
import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PolicyCompliance = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.outerContainer}>
      <div style={styles.contentWrapper}>
        <Container
          maxWidth="md"
          style={{ marginTop: "2rem", marginBottom: "2rem", color: "white" }}
        >
          <Typography variant="h3" align="center" gutterBottom>
            Policy and Compliance
          </Typography>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph>
              Your privacy is important to us. This Privacy Policy explains how we
              collect, use, and safeguard your personal data. We adhere to applicable
              data protection laws and strive to ensure that your information is
              processed securely and transparently.
            </Typography>
          </Box>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Compliance Statement
            </Typography>
            <Typography variant="body1" paragraph>
              We are committed to operating in full compliance with all legal and
              regulatory requirements. Our internal policies and procedures are
              regularly reviewed to ensure that we maintain the highest standards of
              compliance.
            </Typography>
          </Box>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Terms and Conditions
            </Typography>
            <Typography variant="body1" paragraph>
              By accessing and using our services, you agree to be bound by our Terms
              and Conditions. Please review these terms carefully, as they govern your
              use of our platform.
            </Typography>
          </Box>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Data Security
            </Typography>
            <Typography variant="body1" paragraph>
              We implement a variety of security measures to maintain the safety of your
              personal information. All sensitive data is stored securely and handled
              in accordance with industry best practices.
            </Typography>
          </Box>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions or concerns regarding our policies or practices,
              please contact our support team at support@example.com.
            </Typography>
          </Box>
        </Container>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    background: "transparent",
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    width: "100vw",
  },
  contentWrapper: {
    background: "#315b7e",
    backgroundImage: "url('./peach.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    margin: "20px auto",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    borderRadius: "8px",
    maxWidth: "1200px",
    width: "95%",
  },
};

export default PolicyCompliance;
