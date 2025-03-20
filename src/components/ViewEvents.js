import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  TextField,
} from "@mui/material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import logo from "../newlogo.png";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

const BackgroundContainer = styled("div")({
  minHeight: "100vh",
  backgroundColor: "#f8f8f8",
  paddingTop: "200px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const Navbar = () => (
  <AppBar position="fixed" sx={{ background: "#008080" }}>
    <Toolbar>
      <img src={logo} alt="Logo" style={{ height: "90px", marginRight: "20px" }} />
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Events List
      </Typography>
      <Button color="inherit" href="/">Home</Button>
      <Button color="inherit" href="/CreateEvent">Create Event</Button>
      <Button color="inherit" href="/profile">Profile</Button>
    </Toolbar>
  </AppBar>
);

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    date_from: "",
    date_to: "",
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/events/list/`, filters, {
        headers: { "Content-Type": "application/json" },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchEvents();
  };

  return (
    <BackgroundContainer>
      <Navbar />
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", color: "#89574c", fontWeight: "bold" }}>
          Upcoming Events
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: "20px" }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="date"
              label="From Date"
              name="date_from"
              value={filters.date_from}
              onChange={handleFilterChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="date"
              label="To Date"
              name="date_to"
              value={filters.date_to}
              onChange={handleFilterChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" onClick={handleSearch} fullWidth sx={{ marginTop: "10px" }}>
              Search
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Typography variant="h6" align="center">Loading events...</Typography>
        ) : events.length === 0 ? (
          <Typography variant="h6" align="center">No events available.</Typography>
        ) : (
          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <Card sx={{ boxShadow: 3 }}>
                  {event.imageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.imageUrl}
                      alt={event.event_name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{event.event_name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {event.event_date} at {event.event_time}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Location: {event.location}</Typography>
                    <Typography variant="body2" color="textSecondary">Category: {event.category}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </BackgroundContainer>
  );
};

export default ViewEvents;
