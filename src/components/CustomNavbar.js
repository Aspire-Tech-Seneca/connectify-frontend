// src/components/CustomNavbar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import connectifyLogo from "../connectifyLogo.png"; // Adjust the path if needed

// Navigation items for main menu
const navItems = [
  { label: "Home", path: "/home", customStyle: { marginLeft: "10px" } },
  { label: "Chat", path: "/ChatPage" },
  { label: "My Profile", path: "/profile" },
  { label: "About Us", path: "/about" },
  { label: "My Matches", path: "/matches" },
  { label: "Logout", path: "/login", customStyle: { marginRight: "30px" } },
];

// Additional menu items for hamburger menu
const additionalMenuItems = [
  { label: "View Events", path: "/ViewEvents" },
  { label: "Create Event", path: "/CreateEvent" },
  { label: "User Settings", path: "/UserSettings" },
  { label: "Community Chat", path: "/CommunityChat" },
  { label: "Policy Compliance", path: "/PolicyCompliance" },
];

const CustomNavbar = () => {
  const navigate = useNavigate();

  // State for popovers
  const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNotification, setOpenNotification] = useState(false);

  // Notifications state (dummy data or fetched from API)
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Authentication and API base URL (adjust as needed)
  const authToken = localStorage.getItem("authToken");
  const BASE_URL = process.env.REACT_APP_BASE_URL || "https://your-api-base-url.com";

  // Dummy function to get viewed notifications
  const getViewedNotifications = () => {
    return JSON.parse(localStorage.getItem("viewedNotifications") || "{}");
  };

  useEffect(() => {
    if (authToken) {
      fetch(`${BASE_URL}/notifications/list/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch notifications");
          }
          return res.json();
        })
        .then((data) => {
          const viewedNotifications = getViewedNotifications();
          const unreadCount = data.filter((notif) => !viewedNotifications[notif.id]).length;
          setNotifications(data);
          setNotificationCount(unreadCount);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
          setNotifications([]);
          setNotificationCount(0);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setNotifications([]);
      setNotificationCount(0);
    }

    const handleNotificationCountUpdate = (event) => {
      const newCount = event.detail.count;
      setNotificationCount(newCount);
    };

    window.addEventListener("notificationCountUpdated", handleNotificationCountUpdate);
    return () => {
      window.removeEventListener("notificationCountUpdated", handleNotificationCountUpdate);
    };
  }, [authToken, BASE_URL]);

  // Handlers for popovers
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenNotification(true);
  };

  const handleCloseNotificationPopover = () => {
    setAnchorEl(null);
    setOpenNotification(false);
  };

  const handleHamburgerClick = (event) => {
    setHamburgerAnchorEl(event.currentTarget);
  };

  const handleCloseHamburgerPopover = () => {
    setHamburgerAnchorEl(null);
  };

  const openHamburger = Boolean(hamburgerAnchorEl);
  const hamburgerPopoverId = openHamburger ? "hamburger-popover" : undefined;
  const notificationPopoverId = openNotification ? "notification-popover" : undefined;

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <img
        src={connectifyLogo}
        alt="Connectify Logo"
        style={styles.logo}
      />

      {/* Navigation Items */}
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

        {/* Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "1px", marginLeft: "0px" }}>
          <IconButton onClick={() => navigate("/Notifications")} style={{ padding: 0 }}>
            <Badge badgeContent={notificationCount} color="error" invisible={notificationCount <= 0}>
              <NotificationsIcon style={{ color: "#315b7e" }} />
            </Badge>
          </IconButton>
          <IconButton onClick={() => navigate("/ChatPage")} style={{ padding: 0 }}>
            <ChatIcon style={{ color: "#315b7e" }} />
          </IconButton>
          <IconButton onClick={handleHamburgerClick} style={{ padding: 0 }}>
            <MenuIcon style={{ color: "#315b7e" }} />
          </IconButton>
        </div>

        {/* Notification Popover */}
        <Popover
          id={notificationPopoverId}
          open={openNotification}
          anchorEl={anchorEl}
          onClose={handleCloseNotificationPopover}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <ListItem key={index}>
                  <ListItemText primary={notification.title} secondary={notification.message} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No new notifications" />
              </ListItem>
            )}
          </List>
        </Popover>

        {/* Hamburger Menu Popover */}
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
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "white", // Navbar background is white
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#315b7e", // Text color remains blue (#315b7e)
    width: "100%",
    position: "fixed", // Fixed at the top
    padding: "15px",
    top: 0,
    zIndex: 999,
  },
  logo: {
    height: "80px",         // Larger logo height for prominence
    marginRight: "30px",     // Spacing between logo and nav items
    // Removed filter and border properties as requested
  },
  navItems: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  navButton: {
    background: "none",
    border: "none",
    color: "#315b7e", // Nav button text in blue
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "color 0.3s",
    whiteSpace: "nowrap",
  },
};

export default CustomNavbar;
