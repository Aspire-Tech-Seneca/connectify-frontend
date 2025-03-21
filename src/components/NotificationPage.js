import React, { useState, useEffect } from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  IconButton,
  Badge,
  ListItemAvatar,
  Popover,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";
const BASE_PATH = process.env.REACT_APP_BASE_PATH || "/api/v1";

const NavBar = ({ navigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState(null);

  const handleNotificationIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseNotificationPopover = () => {
    setAnchorEl(null);
  };
  const handleHamburgerClick = (event) => {
    setHamburgerAnchorEl(event.currentTarget);
  };
  const handleCloseHamburgerPopover = () => {
    setHamburgerAnchorEl(null);
  };

  const openNotification = Boolean(anchorEl);
  const notificationPopoverId = openNotification ? "notification-popover" : undefined;
  const openHamburger = Boolean(hamburgerAnchorEl);
  const hamburgerPopoverId = openHamburger ? "hamburger-popover" : undefined;

  const navItems = [
    { label: "Home", path: "/home", customStyle: { marginLeft: "40px" } },
    { label: "Chat", path: "/ChatPage" },
    { label: "My Profile", path: "/profile" },
    { label: "About Us", path: "/about" },
    { label: "My Matches", path: "/matches" },
    { label: "Logout", path: "/login", customStyle: { marginRight: "30px" } },
  ];

  const additionalMenuItems = [
    { label: "Notifications", path: "/notifications" },
    { label: "User Settings", path: "/UserSettings" },
    { label: "View Events", path: "/ViewEvents" },
    { label: "Create Event", path: "/createevent" },
    { label: "Community Chat", path: "/CommunityChat" },
    { label: "Policy Compliance", path: "/PolicyCompliance" },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.navItems}>
        {navItems.map((item) => (
          <button
            key={item.label}
            style={{ ...styles.navButton, ...(item.customStyle || {}) }}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
        <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
          <IconButton onClick={handleNotificationIconClick} style={{ padding: 0 }}>
            <Badge badgeContent={0} color="error">
              <NotificationsIcon style={{ color: "white" }} />
            </Badge>
          </IconButton>
          <IconButton onClick={() => navigate("/ChatPage")} style={{ padding: 0 }}>
            <ChatIcon style={{ color: "white", fontSize: "24px" }} />
          </IconButton>
          <IconButton onClick={handleHamburgerClick} style={{ padding: 0 }}>
            <MenuIcon style={{ color: "white", fontSize: "24px" }} />
          </IconButton>
        </div>
      </div>
      <Popover
        id={notificationPopoverId}
        open={openNotification}
        anchorEl={anchorEl}
        onClose={handleCloseNotificationPopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <List>
          <ListItem>
            <ListItemText primary="No new notifications" />
          </ListItem>
        </List>
      </Popover>
      <Popover
        id={hamburgerPopoverId}
        open={openHamburger}
        anchorEl={hamburgerAnchorEl}
        onClose={handleCloseHamburgerPopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <List>
          {additionalMenuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                handleCloseHamburgerPopover();
                navigate(item.path);
              }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </nav>
  );
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`<span class="math-inline">\{BASE\_URL\}</span>{BASE_PATH}/notifications`)
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
        // Mock data for demonstration purposes
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

  return (
    <div style={styles.outerContainer}>
      <NavBar navigate={navigate} />
      <div style={styles.contentWrapper}>
        <Container sx={{ padding: "2rem", maxWidth: "600px", marginTop: "4rem" }}>
          <Typography variant="h4" gutterBottom style={styles.heading}>
            Notifications
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : notifications.length === 0 ? (
            <Typography variant="body1" style={styles.text}>
              No notifications.
            </Typography>
          ) : (
            <List>
              {notifications.map((notif, index) => (
                <ListItem
                  key={index}
                  divider
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
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
                    <NotificationsIcon color="secondary" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={notif.message}
                    primaryTypographyProps={{ sx: { color: "white" } }}
                    secondary={notif.timestamp ? new Date(notif.timestamp).toLocaleString() : ""}
                    secondaryTypographyProps={{ sx: { color: "rgb(208 208 208)" } }}
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
  navbar: {
    backgroundColor: "#315b7e",
    padding: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    width: "100%",
  },
  navItems: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  text: {
    color: "white",
    "&:hover": {
      color: "black",
    },
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