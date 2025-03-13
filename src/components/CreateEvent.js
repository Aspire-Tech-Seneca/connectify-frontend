import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  MenuItem,
  Container,
  Box,
  InputAdornment,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Event, CalendarToday, AccessTime, LocationOn, Description, Category } from "@mui/icons-material";
import peachImage from "../peach.jpg";
import logo from "../logo.jpg";
import axios from "axios";

// Load base URL from environment variable
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

// Base image URL (if needed for uploads to your blob storage)
const BASE_IMAGE_URL = "https://atcdevstorageaccount.blob.core.windows.net/atcdevstoragecontainer/";

// Background Styling
const BackgroundContainer = styled("div")({
  backgroundImage: `url(${peachImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
});

// Form Container Styling
const FormContainer = styled(Container)({
  background: "rgba(253, 252, 230, 0.6)",
  padding: "90px",
  borderRadius: "10px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.8)",
  width: "90%",
  maxWidth: "600px",
  minWidth: "650px",
  textAlign: "center",
  zIndex: 2,
  marginTop: "100px",
});

// Styled Button
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

// Navbar Component
const Navbar = () => (
  <AppBar position="fixed" sx={{ background: "#89574c" }}>
    <Toolbar>
      <img src={logo} alt="Logo" style={{ height: "90px", marginRight: "20px" }} />
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Create an Event
      </Typography>
      <Button color="inherit" href="/">Home</Button>
      <Button color="inherit" href="/events">Events</Button>
      <Button color="inherit" href="/profile">Profile</Button>
    </Toolbar>
  </AppBar>
);

// Styled TextField
const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#89574c" },
    "&:hover fieldset": { borderColor: "#89574c" },
    "&.Mui-focused fieldset": { borderColor: "#89574c", borderWidth: "5px" },
  },
});

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "",
    imageUrl: "",
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  const categories = ["Outdoor", "Tech", "Arts & Crafts", "Food & Drinks", "Networking", "Other"];

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Modified to use URL.createObjectURL for local preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setEventData({ ...eventData, imageUrl: localImageUrl });
      // Optionally: if you plan to upload the file to your server, you might want to store the file as well.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/events/create/`, eventData);
      console.log("Event Created Successfully:", response.data);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Event creation failed:", error.response?.data || error.message);
      alert("Event creation failed. Please try again.");
    }
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <BackgroundContainer>
      <Navbar />
      <FormContainer>
        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#89574c" }}>
          Host an Event
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <StyledTextField
            label="Event Name"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Event style={{ color: "blue" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday style={{ color: "green" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTime style={{ color: "orange" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn style={{ color: "green" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description style={{ color: "purple" }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            select
            label="Category"
            name="category"
            value={eventData.category}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Category style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledTextField>

          <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: "15px" }} />
          {/* Show image preview if available */}
          {eventData.imageUrl && (
            <img src={eventData.imageUrl} alt="Preview" style={{ maxWidth: "100%", marginBottom: "15px" }} />
          )}
          <StyledButton variant="contained" onClick={handlePreview}>Preview</StyledButton>
          <StyledButton variant="contained" type="submit">Create Event</StyledButton>
        </form>
      </FormContainer>
      {/* Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ bgcolor: "background.paper", p: 4, borderRadius: 2, maxWidth: "600px", width: "90%" }}>
          <Typography variant="h5" gutterBottom>Event Preview</Typography>
          <Typography variant="subtitle1">Name: {eventData.name}</Typography>
          <Typography variant="subtitle1">Date: {eventData.date}</Typography>
          <Typography variant="subtitle1">Time: {eventData.time}</Typography>
          <Typography variant="subtitle1">Location: {eventData.location}</Typography>
          <Typography variant="subtitle1">Description: {eventData.description}</Typography>
          <Typography variant="subtitle1">Category: {eventData.category}</Typography>
          {eventData.imageUrl && (
            <Box component="img" src={eventData.imageUrl} alt="Event Preview" sx={{ width: "100%", mt: 2 }} />
          )}
          <StyledButton variant="contained" onClick={handleClosePreview} sx={{ mt: 2 }}>Close Preview</StyledButton>
        </Box>
      </Modal>
    </BackgroundContainer>
  );
};

export default CreateEvent;
