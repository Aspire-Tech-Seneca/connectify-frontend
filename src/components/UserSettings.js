import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material"; // ✅ Added Snackbar & Alert
import { Lock, LockOpen } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import logo from "../newlogo.png";

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
  width: "90%",
  maxWidth: "600px",
  minWidth: "750px",
  textAlign: "center",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  marginTop: "0px",
}));



const StyledButton = styled(Button)({
  background: "linear-gradient(to right, #008080, #315b7e)",
  color: "white",
  fontWeight: "bold",
  padding: "14px",
  width: "100%",
  transition: "0.3s",
  "&:hover": {
    background: "linear-gradient(to right, #315b7e, #008080)",
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setSnackbar({
        open: true,
        message: "You must be logged in to change your password.",
        severity: "warning",
      });
      navigate("/login");
    }
  }, [navigate]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.old_password)
      newErrors.old_password = "Current password is required";
    if (formData.new_password.length < 6)
      newErrors.new_password = "New password must be at least 6 characters";
    if (formData.new_password !== formData.confirm_new_password)
      newErrors.confirm_new_password = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const apiUrl = `${BASE_URL}/users/change-password/`;
        await axios.put(
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

        setSnackbar({
          open: true,
          message: "Password updated successfully!",
          severity: "success",
        });

        // Optionally redirect after success
        setTimeout(() => navigate("/profile"), 2000);
      } catch (error) {
        setSnackbar({
          open: true,
          message:
            error.response?.data?.detail || "Update failed. Try again.",
          severity: "error",
        });
      }
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <img
          src={logo}
          alt="Connectify Logo"
          style={{ width: "250px", marginBottom: "10px" }}
        />
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontWeight: "bold", color: "#315b7e" }}
        >
          Update Password 🔒
        </Typography>
        {errors.api && <Typography color="error">{errors.api}</Typography>}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "100%",
          }}
        >
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

          <StyledButton variant="contained" type="submit">
            Update Password
          </StyledButton>
        </form>
      </FormContainer>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default UserSettings;
