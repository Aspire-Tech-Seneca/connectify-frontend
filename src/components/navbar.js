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
import logo from "../newlogo.png"; // adjust the path to your logo

// Navigation items for main menu
const navItems = [
  { label: "Home", path: "/home", customStyle: { marginLeft: "40px" } },
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
  
  // State for hamburger and notification popovers
  const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNotification, setOpenNotification] = useState(false);
  
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Authentication and API base URL
  const authToken = localStorage.getItem('authToken');
  const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://your-api-base-url.com';

  // Function to get viewed notifications from localStorage
  const getViewedNotifications = () => {
    return JSON.parse(localStorage.getItem('viewedNotifications') || '{}');
  };

  // Effect hook for fetching notifications and managing notification count
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
          // Get viewed notifications from localStorage
          const viewedNotifications = getViewedNotifications();

          // Calculate unread notifications
          const unreadCount = data.filter(notif => 
            !viewedNotifications[notif.id]
          ).length;

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

    // Listen for notification count updates from other components
    const handleNotificationCountUpdate = (event) => {
      const newCount = event.detail.count;
      setNotificationCount(newCount);
    };

    window.addEventListener('notificationCountUpdated', handleNotificationCountUpdate);

    // Cleanup listener
    return () => {
      window.removeEventListener('notificationCountUpdated', handleNotificationCountUpdate);
    };
  }, [authToken, BASE_URL]);

  // Handler for notification popover
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenNotification(true);
  };

  // Close notification popover
  const handleCloseNotificationPopover = () => {
    setAnchorEl(null);
    setOpenNotification(false);
  };

  // Handler for hamburger menu
  const handleHamburgerClick = (event) => {
    setHamburgerAnchorEl(event.currentTarget);
  };

  // Close hamburger menu
  const handleCloseHamburgerPopover = () => {
    setHamburgerAnchorEl(null);
  };

  // Popover state checks
  const openHamburger = Boolean(hamburgerAnchorEl);
  const hamburgerPopoverId = openHamburger ? "hamburger-popover" : undefined;
  const notificationPopoverId = openNotification ? "notification-popover" : undefined;

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <img 
        src={logo} 
        alt="Logo" 
        style={{ height: "70px", marginRight: "20px" }} 
      />
      
      {/* Navigation Items */}
      <div style={styles.navItems}>
        {/* Main Navigation Buttons */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "15px" }}>
          {/* Notifications Icon */}
          <IconButton 
            onClick={() => navigate("/Notifications")} 
            style={{ padding: 0 }}
          >
            <Badge 
              badgeContent={notificationCount} 
              color="error"
              invisible={notificationCount <= 0}
            >
              <NotificationsIcon style={{ color: "white" }} />
            </Badge>
          </IconButton>
          
          {/* Chat Icon */}
          <IconButton 
            onClick={() => navigate("/ChatPage")} 
            style={{ padding: 0 }}
          >
            <ChatIcon style={{ color: "white" }} />
          </IconButton>
          
          {/* Hamburger Menu Icon */}
          <IconButton 
            onClick={handleHamburgerClick} 
            style={{ padding: 0 }}
          >
            <MenuIcon style={{ color: "white" }} />
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
                  <ListItemText 
                    primary={notification.title} 
                    secondary={notification.message} 
                  />
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

// Styles for the Navbar
const styles = {
  navbar: {
    backgroundColor: "#315b7e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    width: "100%",
  position: "fixed", // ✅ Fixes it to top
    padding: "15px",
    top: 0,
    zIndex: 999,
  },
  navItems: {
    display: "flex",
    alignItems: "center",
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
    whiteSpace: "nowrap",
  },
};

export default CustomNavbar;