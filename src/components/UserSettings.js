import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Lock, LockOpen } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import logo from "../newlogo.png"; // Use the same logo as in login

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";

const PageContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  position: "relative",
});

const FormContainer = styled(Container)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(10px)",
  padding: "40px 30px",
  borderRadius: "20px",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
  maxWidth: "800px",
  minWidth: "800px",
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

const UserSettings = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Retrieve the token when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    } else {
      alert("You must be logged in to change your password.");
      navigate("/login"); // Redirect to login if token is missing
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.old_password) newErrors.old_password = "Current password is required";
    if (formData.new_password.length < 6) newErrors.new_password = "New password must be at least 6 characters";
    if (formData.new_password !== formData.confirm_new_password) newErrors.confirm_new_password = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const apiUrl = `${BASE_URL}/users/change-password/`;

        const response = await axios.put(
          apiUrl,
          {
            old_password: formData.old_password,
            new_password: formData.new_password,
            confirm_new_password: formData.confirm_new_password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Password updated successfully!");
        navigate("/profile");
      } catch (error) {
        console.error("Update failed:", error);
        setErrors({ api: error.response?.data?.detail || "Update failed. Try again." });
      }
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <img src={logo} alt="Connectify Logo" style={{ width: "250px", marginBottom: "10px" }} />
        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#0052D4" }}>
          Update Password 🔒
        </Typography>
        {errors.api && <Typography color="error">{errors.api}</Typography>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
          <StyledTextField
            label="Current Password"
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            error={!!errors.old_password}
            helperText={errors.old_password}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpen style={{ color: "#0052D4" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="New Password"
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            error={!!errors.new_password}
            helperText={errors.new_password}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#0052D4" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Confirm New Password"
            type="password"
            name="confirm_new_password"
            value={formData.confirm_new_password}
            onChange={handleChange}
            error={!!errors.confirm_new_password}
            helperText={errors.confirm_new_password}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#0052D4" }} />
                </InputAdornment>
              ),
            }}
          />

          <StyledButton variant="contained" type="submit">Update Password</StyledButton>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default UserSettings;
