import React, { useState, useEffect } from "react";
import { Container, List, ListItem, ListItemText, Typography, CircularProgress, IconButton, Badge, ListItemAvatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate, Link } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";
const BASE_PATH = process.env.REACT_APP_BASE_PATH || "/api/v1"; 
const BLOB_STORAGE_BASE_URL = process.env.REACT_APP_BLOB_STORAGE_BASE_URL || "https://yourpublicblobstorage.com/";
const BLOB_SAS_TOKEN = process.env.REACT_APP_BLOB_SAS_TOKEN || "";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
      .catch(() => {
        setNotifications([
          { message: "New user signed up", timestamp: Date.now() },
          { message: "System maintenance scheduled", timestamp: Date.now() - 3600000 },
          { message: "New comment on your post", timestamp: Date.now() - 7200000 },
        ]);
        setLoading(false);
      });
  }, []);

  const handleNotificationClick = (notif) => {
    console.log("Notification clicked:", notif);
  };

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Chat", path: "/ChatPage" },
    { label: "My Profile", path: "/profile" },
    { label: "About Us", path: "/about" },
    { label: "My Matches", path: "/matches" },
    { label: "Logout", path: "/login" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <div style={styles.outerContainer}>
        <nav style={styles.navbar}>
          <div style={styles.navItems}>
            {navItems.map((item) => (
              <button
                key={item.label}
                style={styles.navButton}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </button>
            ))}
            <IconButton color="inherit" component={Link} to="/notifications">
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </div>
        </nav>

        <Container sx={{ padding: "2rem", maxWidth: "600px", marginTop: "4rem" }}>
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
                <ListItem
                  key={index}
                  divider
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      cursor: 'pointer',
                    },
                    padding: '1rem',
                  }}
                >
                  <ListItemAvatar>
                    <NotificationsIcon color="secondary" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={notif.message}
                    secondary={notif.timestamp ? new Date(notif.timestamp).toLocaleString() : ""}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Container>
      </div>
    </>
  );
};

const styles = {
  outerContainer: {
    background: "transparent",
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    width: "100vw",
  },
  navbar: {
    backgroundColor: "#C38282",
    padding: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    width: "100%",
  },
  navItems: {
    display: "flex",
    gap: "20px",
  },
  navButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "color 0.3s",
  },
};

export default NotificationPage;