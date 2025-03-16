import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { AnimatedBackground } from "animated-backgrounds";
import logo from "../newlogo.png"; // Use the same logo as in sign-up
import loginImage from "../newlogo.png"; // Add your image here
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";

const PageContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  position: "relative",
});

const ImageContainer = styled("div")({
  flex: "1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const LoginImage = styled("img")({
  width: "100%",
  maxWidth: "500px",
  height: "auto",
  borderRadius: "12px",
});

const FormContainer = styled(Container)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(10px)",
  padding: "40px 30px",
  borderRadius: "20px",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
  maxWidth: "500px",
  textAlign: "center",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  marginTop: "40px",
}));

const StyledButton = styled(Button)({
  background: "linear-gradient(to right, #0052D4, #65C7F7)",
  color: "white",
  fontWeight: "bold",
  padding: "14px",
  width: "100%",
  transition: "0.3s",
  "&:hover": {
    background: "linear-gradient(to right, #0044AA, #4DB2E0)",
    transform: "scale(1.05)",
  },
});

const StyledTextField = styled(TextField)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#0052D4" },
    "&:hover fieldset": { borderColor: "#0052D4" },
    "&.Mui-focused fieldset": { borderColor: "#0052D4", borderWidth: "2px" },
  },
});

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const apiUrl = `${BASE_URL}/users/login/`;

    try {
      const response = await axios.post(apiUrl, { email, password });
      localStorage.setItem("authToken", response.data.access);
      // Alert removed
      navigate("/profile");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <AnimatedBackground animationName="starryNight" blendMode="normal" />
      <PageContainer>
        <ImageContainer>
          <LoginImage src={loginImage} alt="Login Visual" />
        </ImageContainer>
        
        <FormContainer>
          <img src={logo} alt="Connectify Logo" style={{ width: "250px", marginBottom: "10px" }} />
          <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#0052D4" }}>
            Log in to Connectify
          </Typography>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
            <StyledTextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email style={{ color: "#0052D4" }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock style={{ color: "#0052D4" }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <StyledButton type="submit">Login</StyledButton>
          </form>
          
          <Box mt={2}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <span style={{ color: "#0052D4", fontWeight: "bold", cursor: "pointer" }}
                onClick={() => navigate("/Signup")}>
                Sign up here
              </span>
            </Typography>
          </Box>
        </FormContainer>
      </PageContainer>
    </div>
  );
};

export default LoginForm;