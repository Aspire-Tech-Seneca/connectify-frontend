import React, { useState, useEffect } from "react";
import { Container, List, ListItem, ListItemText, Typography, CircularProgress } from "@mui/material";

// Load environment variables for API endpoints
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost";
const BASE_PATH = process.env.REACT_APP_BASE_PATH || "/api";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications from the backend API
    fetch(`${BASE_URL}${BASE_PATH}/notifications`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }
        return res.json();
      })
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        // Fallback to an empty list if the fetch fails
        setNotifications([]);
        setLoading(false);
      });
  }, []);

  return (
    <Container style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : notifications.length === 0 ? (
        <Typography variant="body1">No notifications.</Typography>
      ) : (
        <List>
          {notifications.map((notif, index) => (
            <ListItem key={index} divider button>
              <ListItemText
                primary={notif.message}
                secondary={notif.timestamp ? new Date(notif.timestamp).toLocaleString() : ""}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default NotificationPage;