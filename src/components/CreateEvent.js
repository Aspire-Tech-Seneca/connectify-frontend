import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  MenuItem,
  Container,
  Snackbar,
  Alert,
} from "@mui/material"; // ✅ Added Snackbar and Alert
import { styled } from "@mui/material/styles";
import logo from "../newlogo.png";
import axios from "axios";
import CustomNavbar from "./navbar";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
const BASE_IMAGE_URL = process.env.REACT_APP_BLOB_STORAGE_EVENT_IMAGES;
const BLOB_SAS_TOKEN = process.env.REACT_APP_BLOB_SAS_TOKEN || "";

document.body.style.backgroundSize = "cover";

const BackgroundContainer = styled("div")({
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
});

const FormContainer = styled(Container)({
  background: "rgba(255, 255, 255, 0.9)",
  padding: "90px",
  borderRadius: "10px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.8)",
  width: "90%",
  maxWidth: "600px",
  minWidth: "750px",
  textAlign: "center",
  zIndex: 2,
  marginTop: "150px",
});

const StyledButton = styled(Button)({
  background: "linear-gradient(to right, #008080, #315b7e)",
  color: "white",
  fontWeight: "bold",
  padding: "16px",
  transition: "0.3s",
  "&:hover": {
    background: "linear-gradient(to right, #315b7e, #008080)",
    transform: "scale(1.05)",
  },
});

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    event_name: "",
    event_date: "",
    event_time: "",
    location: "",
    description: "",
    category: "",
    imageUrl: "",
    imageFile: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const categories = [
    "Outdoor",
    "Tech",
    "Arts & Crafts",
    "Cooking",
    "Baking",
    "Music",
    "Networking",
    "Other",
  ];

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData({
        ...eventData,
        imageFile: file,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventData.imageFile) {
      setSnackbar({
        open: true,
        message: "Please upload an event image.",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();

    const eventJsonBlob = new Blob(
      [
        JSON.stringify({
          event_name: eventData.event_name,
          event_date: eventData.event_date,
          event_time: eventData.event_time,
          location: eventData.location,
          description: eventData.description,
          category: eventData.category,
        }),
      ],
      { type: "application/json" }
    );

    formData.append("event_data", eventJsonBlob, "event.json");
    formData.append("event_image", eventData.imageFile);

    try {
      await axios.post(`${BASE_URL}/events/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setSnackbar({
        open: true,
        message: "Event created successfully!",
        severity: "success",
      });

      // Optionally reset the form here
      setEventData({
        event_name: "",
        event_date: "",
        event_time: "",
        location: "",
        description: "",
        category: "",
        imageUrl: "",
        imageFile: null,
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Event creation failed. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <BackgroundContainer>
      <CustomNavbar />
      <FormContainer>
        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#89574c" }}>
          Host an Event
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <TextField label="Event Name" name="event_name" value={eventData.event_name} onChange={handleChange} required fullWidth />
          <TextField type="date" name="event_date" value={eventData.event_date} onChange={handleChange} required fullWidth />
          <TextField type="time" name="event_time" value={eventData.event_time} onChange={handleChange} required fullWidth />
          <TextField label="Location" name="location" value={eventData.location} onChange={handleChange} required fullWidth />
          <TextField label="Description" name="description" value={eventData.description} onChange={handleChange} required fullWidth multiline rows={3} />
          <TextField id="category" select label="Category" name="category" value={eventData.category} onChange={handleChange} required fullWidth>
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <StyledButton component="label">
            Add Image
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </StyledButton>
          {eventData.imageUrl && <img src={eventData.imageUrl} alt="Preview" style={{ maxWidth: "100%", marginBottom: "15px" }} />}
          <StyledButton type="submit">Create Event</StyledButton>
        </form>
      </FormContainer>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BackgroundContainer>
  );
};

export default CreateEvent;
