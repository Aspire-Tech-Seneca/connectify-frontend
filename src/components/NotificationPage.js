import React, { useState, useEffect } from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  ListItemAvatar
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

// Adjust to your actual backend URLs
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  // Function to get and update viewed notifications from localStorage
  const getViewedNotifications = () => {
    return JSON.parse(localStorage.getItem('viewedNotifications') || '{}');
  };

  // Function to update viewed notifications in localStorage
  const updateViewedNotifications = (notificationId) => {
    const viewedNotifications = getViewedNotifications();
    viewedNotifications[notificationId] = true;
    localStorage.setItem('viewedNotifications', JSON.stringify(viewedNotifications));
  };

  // Calculate unread notification count
  const unreadCount = notifications.filter(notif => 
    !getViewedNotifications()[notif.id]
  ).length;

  useEffect(() => {
    if (authToken) {
      fetch(`${BASE_URL}/notifications/list/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }) 
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch notifications");
          }
          return res.json();
        })
        .then((data) => {
          // Add a 'seen' property based on localStorage
          const viewedNotifications = getViewedNotifications();
          const processedNotifications = data.map(notif => ({
            ...notif,
            seen: !!viewedNotifications[notif.id]
          }));

          setNotifications(processedNotifications);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
          setNotifications([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setNotifications([]);
    }
  }, [authToken]);

  const handleNotificationClick = (notif) => {
    // Update local storage to mark notification as viewed
    updateViewedNotifications(notif.id);

    // Update local state to mark notification as seen
    const updatedNotifications = notifications.map(n => 
      n.id === notif.id ? { ...n, seen: true } : n
    );
    setNotifications(updatedNotifications);

    // Add specific handling for different notification types
    switch(notif.type) {
      case 'matchup':
        // Navigate to matchup or open matchup details
        console.log("Matchup notification clicked:", notif);
        break;
      default:
        console.log("Notification clicked:", notif);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.contentWrapper}>
        <Container sx={{ padding: "2rem", maxWidth: "600px", marginTop: "4rem" }}>
          <Typography variant="h4" gutterBottom style={styles.heading}>
            Notifications
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : notifications.length === 0 ? (
            <Typography variant="body1" style={styles.text}>
              No new notifications.
            </Typography>
          ) : (
            <List>
              {notifications.map((notif) => (
                <ListItem
                  key={notif.id}
                  divider
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
                    backgroundColor: notif.seen ? "rgba(255,255,255,0.1)" : undefined,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                      "& .MuiListItemText-primary, & .MuiListItemText-secondary": {
                        color: "black",
                      },
                    },
                    padding: "1rem",
                  }}
                >
                  <ListItemAvatar>
                    <NotificationsIcon 
                      color={notif.seen ? "disabled" : "secondary"} 
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={notif.requester}
                    primaryTypographyProps={{ 
                      sx: { 
                        color: "white",
                        fontWeight: notif.seen ? "normal" : "bold"
                      } 
                    }}
                    secondary={`${notif.detail} - ${new Date(notif.created_at).toLocaleString()}`}
                    secondaryTypographyProps={{ 
                      sx: { 
                        color: notif.seen ? "rgb(150,150,150)" : "rgb(208 208 208)"
                      } 
                    }}
                    sx={{ ...styles.text, color: "white" }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Container>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    background: "transparent",
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    width: "100vw",
  },
  contentWrapper: {
    background: "rgba(7, 53, 102, 0.7)",
    backgroundImage: "url('./peach.jpg')", // Ensure this path is correct
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    margin: "20px auto",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
    borderRadius: "8px",
    maxWidth: "1200px",
    width: "95%",
    color: "white",
  },
  heading: {
    color: "white",
    fontWeight: "bold",
  },
  text: {
    color: "white",
    "&:hover": {
      color: "black",
    },
  },
};

export default NotificationPage;