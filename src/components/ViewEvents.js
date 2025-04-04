import React, { useEffect, useState } from "react";
import {
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
import SearchIcon from "@mui/icons-material/Search";
import bgImage from "../abstract.jpg"; // ✅ Import your image from src/

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

const BackgroundContainer = styled("div")({
  minHeight: "100vh",
 background: `linear-gradient(
            rgba(100, 126, 135, 0.4),
            rgba(255, 255, 255, 0.3)
          ), url(${bgImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed", // Optional: Keeps background static while scrolling
  paddingTop: "230px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

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
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/events/list/`,
        filters,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchEvents();
  };

  return (
    <BackgroundContainer>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            mt: 4,
            background: "linear-gradient(to right, #315b7e, #008080)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            letterSpacing: "3px",
            animation: "fadeInSlideUp 1s ease-in-out",
            marginTop: "270px"
          }}
        >
          Upcoming Events
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ marginTop: "50px" }}>
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
            <Button
              variant="contained"
              onClick={handleSearch}
              fullWidth
              startIcon={<SearchIcon />}
              sx={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #315b7e, #008080)",
                color: "white",
                fontWeight: "bold",
                borderRadius: "30px",
                boxShadow: "0 8px 20px rgba(49, 91, 126, 0.4)",
                backdropFilter: "blur(4px)",
                textTransform: "uppercase",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(135deg, #008080, #315b7e)",
                  boxShadow: "0 12px 24px rgba(0, 128, 128, 0.5)",
                  transform: "scale(1.06)",
                },
              }}
            >
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
                  {event.event_image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.event_image}
                      alt={event.event_name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {event.event_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {event.event_date} at {event.event_time}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Location: {event.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Category: {event.category}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {event.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <style>
        {`
          @keyframes fadeInSlideUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </BackgroundContainer>
  );
};

export default ViewEvents;
