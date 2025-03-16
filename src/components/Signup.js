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
import { AccountCircle, Email, Lock, CalendarToday } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { AnimatedBackground } from "animated-backgrounds";
import logo from "../newlogo.png"; // Replace with actual logo path
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";

const FormContainer = styled(Container)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(10px)",
  padding: "40px 30px",
  borderRadius: "12px",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
  width: "100%",
  maxWidth: "500px",
  textAlign: "center",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
   marginTop: "60px"
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

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    age: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.age || isNaN(formData.age) || formData.age < 18) {
      newErrors.age = "You must be at least 18 years old";
    }
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validateForm()) {
      try {
        const apiUrl = `${BASE_URL}/users/create/`;
        await axios.post(apiUrl, formData);
        navigate("/login");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Signup failed. Please try again.";
        setServerError(errorMessage);
      }
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <AnimatedBackground animationName="gradientWave" blendMode="normal" />
      <FormContainer>
        <img src={logo} alt="Logo" style={{ width: "250px", marginBottom: "10px" }} />
        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#0052D4" }}>
          Sign Up to Connectify
        </Typography>
        {serverError && <Typography color="error">{serverError}</Typography>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
          <StyledTextField
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            error={!!errors.fullname}
            helperText={errors.fullname}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle style={{ color: "#0052D4" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email style={{ color: "#0052D4" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            error={!!errors.age}
            helperText={errors.age}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday style={{ color: "#0052D4" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#0052D4" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Confirm Password"
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#0052D4" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledButton type="submit">Sign Up</StyledButton>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <span
              style={{ color: "#0052D4", fontWeight: "bold", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Log in here
            </span>
          </Typography>
        </Box>
      </FormContainer>
    </div>
  );
};

export default Signup;
