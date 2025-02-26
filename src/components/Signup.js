import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { AccountCircle, Email, Lock, CalendarToday } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import peachImage from "../peach.jpg"; // Ensure correct path
import logo from "../logo.jpg"; // Replace with actual logo path
import axios from "axios";

const BackgroundContainer = styled("div")({
  backgroundImage: `url(${peachImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: "80px",
  position: "relative",
});

const Overlay = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
});

const FormContainer = styled(Container)(() => ({
  background: "rgba(253, 252, 230, 0.4)",
  padding: "60px 30px",
  borderRadius: "10px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)",
  width: "100%",
  maxWidth: "600px",
  textAlign: "center",
  zIndex: 2,
}));

const StyledButton = styled(Button)({
  background: "linear-gradient(to right, #893d3d, #958f8f)",
  color: "white",
  fontWeight: "bold",
  padding: "16px",
  transition: "0.3s",
  "&:hover": {
    background: "linear-gradient(to right, #ae4040, black)",
    transform: "scale(1.05)",
  },
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#89574c" },
    "&:hover fieldset": { borderColor: "#89574c" },
    "&.Mui-focused fieldset": { borderColor: "#89574c", borderWidth: "5px" },
  },
});

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="fixed" sx={{ background: "#89574c" }}>
      <Toolbar>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "90px", marginRight: "20px" }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Connectify, Find Your People Today
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate("/about")}>
          About Us
        </Button>
        <Button color="inherit" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Invalid email format";
    if (!formData.age || isNaN(formData.age) || formData.age < 18) {
      newErrors.age = "You must be at least 18 years old";
    }
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:8000/users/create",
          formData
        );
        alert("Signup successful! Please log in.");
        navigate("/login");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Signup failed. Please try again.";
        setServerError(errorMessage);
      }
    }
  };

  return (
    <BackgroundContainer>
      <Navbar />
      <Overlay />
      <FormContainer>
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontWeight: "bold", color: "#89574c" }}
        >
          Sign Up to Connectify
        </Typography>
        {serverError && <Typography color="error">{serverError}</Typography>}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <StyledTextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle style={{ color: "red" }} />
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
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email style={{ color: "blue" }} />
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
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday style={{ color: "black" }} />
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
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "green" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#89574c" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledButton variant="contained" type="submit">
            Sign Up
          </StyledButton>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <span
              style={{
                color: "#89574c",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/login")}
            >
              Log in here
            </span>
          </Typography>
        </Box>
      </FormContainer>
    </BackgroundContainer>
  );
};

export default Signup;