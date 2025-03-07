import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, InputAdornment, AppBar, Toolbar } from "@mui/material";
import { Lock, LockOpen } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import peachImage from "../peach.jpg"; // Same background
import logo from "../logo.jpg"; // Ensure correct path


// Background Styling
const BackgroundContainer = styled("div")({
  backgroundImage: `url(${peachImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
});

// Overlay
const Overlay = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
});

// Styled Form Container (Cute & Pretty)
const FormContainer = styled(Container)({
  background: "rgba(253, 252, 230, 0.6)",
  padding: "50px",
  borderRadius: "20px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
  width: "90%",
  maxWidth: "500px",
  textAlign: "center",
  zIndex: 2,
});

// Styled Button
const StyledButton = styled(Button)({
  background: "linear-gradient(to right, #89574c, #a7311a)",
  color: "white",
  fontWeight: "bold",
  padding: "14px",
  transition: "0.3s",
  "&:hover": {
    background: "linear-gradient(to right, #c7a69f, #89574c)",
    transform: "scale(1.05)",
  },
});

// Styled TextField
const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#89574c" },
    "&:hover fieldset": { borderColor: "#89574c" },
    "&.Mui-focused fieldset": { borderColor: "#89574c", borderWidth: "3px" },
  },
});

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="fixed" sx={{ background: "#89574c" }}>
      <Toolbar>
        <img src={logo} alt="Logo" style={{ height: "60px", marginRight: "15px", cursor: "pointer" }} onClick={() => navigate("/")}/>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}>
          Connectify
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
        <Button color="inherit" onClick={() => navigate("/about")}>About Us</Button>
        <Button color="inherit" onClick={() => navigate("/profile")}>Profile</Button>
      </Toolbar>
    </AppBar>
  );
};


const UserSettings = () => {
  const [formData, setFormData] = useState({ old_password: "", new_password: "", confirm_new_password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
        const response = await axios.post("http://127.0.0.1:8000/users/change-password/", formData);
        alert("Password updated successfully!");
        navigate("/");
      } catch (error) {
        alert(error.response?.data?.message || "Update failed. Try again.");
      }
    }
  };

  return (
    <BackgroundContainer>
      <Navbar />
      <Overlay />
      <Box sx={{ mt: 8 }}>
        <FormContainer>
          <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#89574c" }}>
            Update Password 🔒
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <StyledTextField
              label="Current Password"
              type="password"
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              error={!!errors.old_password}
              helperText={errors.old_password}
              required fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen style={{ color: "#ff7e7e" }} />
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
              required fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock style={{ color: "#ff7e7e" }} />
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
              required fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock style={{ color: "#ff7e7e" }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledButton variant="contained" type="submit">Update Password</StyledButton>
          </form>
        </FormContainer>
      </Box>
    </BackgroundContainer>
  );
};

export default UserSettings;
