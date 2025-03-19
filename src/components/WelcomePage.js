// src/components/WelcomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import peach from "./peach.jpg"; // Consider using an env variable if needed

// Fullscreen background container with the peach image
const BackgroundContainer = styled("div")({
  backgroundImage: `url(${peach})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
});

// Content container with a semi-transparent overlay
const ContentContainer = styled(Container)({
  position: "relative",
  zIndex: 2,
  background: "rgba(245,236,227,0.4)", // Semi-transparent overlay
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.6)",
  width: "90%",
  maxWidth: "600px",
  minWidth: "450px",
  textAlign: "center",
});

// Styled button with gradient and hover effects
const StyledButton = styled(Button)({
  background: "linear-gradient(to right, #C38282, #ae4040)",
  color: "white",
  fontWeight: "bold",
  padding: "16px",
  borderRadius: "4px",
  transition: "0.3s",
  "&:hover": {
    background: "linear-gradient(to right, #ae4040, #C38282)",
    transform: "scale(1.05)",
  },
});

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <BackgroundContainer>
      <ContentContainer>
        {/* Header */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#C38282" }}
        >
          Connectify: a platform that brings people together.
        </Typography>

        {/* Hero Section */}
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#5D4037", mb: 2 }}
          >
            Connect with People Who Share Your Passions
          </Typography>
          <Typography variant="body1" sx={{ color: "#5D4037", mb: 3 }}>
            Welcome to Connectify – where you can discover your community based
            on shared interests. Whether you're into tech, art, sports, or
            literature, find friends and build meaningful connections.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <StyledButton onClick={() => navigate("/Signup")}>
              Get Started
            </StyledButton>
            <StyledButton onClick={() => navigate("/login")}>
              Log In
            </StyledButton>
          </Box>
        </Box>

        {/* Testimonial Section */}
        <Box
          sx={{
            background: "rgba(245,236,227,0.6)",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            mb: 4,
          }}
        >
          <Typography variant="h6" sx={{ color: "#5D4037", mb: 1 }}>
            What Our Users Say
          </Typography>
          <Typography variant="body2" sx={{ color: "#5D4037", mb: 1 }}>
            "Connectify has completely transformed the way I connect with people
            who share my interests. I’ve made lifelong friends!"
          </Typography>
          <Typography variant="caption" sx={{ color: "#C38282" }}>
            — Jordan
          </Typography>
        </Box>

        {/* Information Section */}
        <Box
          sx={{
            my: 4,
            background: "rgba(245,236,227,0.7)",
            p: 3,
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#5D4037", mb: 2 }}
          >
            Why Choose Connectify?
          </Typography>
          <Typography variant="body1" sx={{ color: "#5D4037" }}>
            Our innovative matching system connects you with like-minded
            individuals, helping you form meaningful relationships. Join our
            vibrant community and explore new opportunities to learn, collaborate,
            and grow.
          </Typography>
        </Box>

        {/* Optional Footer or additional content could be added here */}

      </ContentContainer>
    </BackgroundContainer>
  );
};

export default WelcomePage;
