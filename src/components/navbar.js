import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../newlogo.png"; // adjust if needed

const navItems = [
  { label: "Home", path: "/home", customStyle: { marginLeft: "40px" } },
  { label: "Chat", path: "/ChatPage" },
  { label: "My Profile", path: "/profile" },
  { label: "About Us", path: "/about" },
  { label: "My Matches", path: "/matches" },
  { label: "Logout", path: "/login", customStyle: { marginRight: "30px" } },
];

const additionalMenuItems = [
  { label: "View Events", path: "/ViewEvents" },
  { label: "Create Event", path: "/CreateEvent" },
  { label: "User Settings", path: "/UserSettings" },
  { label: "Community Chat", path: "/CommunityChat" },
  { label: "Policy Compliance", path: "/PolicyCompliance" },
];

const CustomNavbar = () => {
  const navigate = useNavigate();
  const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState(null);

  const handleHamburgerClick = (event) => {
    setHamburgerAnchorEl(event.currentTarget);
  };

  const handleCloseHamburgerPopover = () => {
    setHamburgerAnchorEl(null);
  };

  const openHamburger = Boolean(hamburgerAnchorEl);
  const hamburgerPopoverId = openHamburger ? "hamburger-popover" : undefined;

  return (
    <nav style={styles.navbar}>
      <img src={logo} alt="Logo" style={{ height: "70px", marginRight: "20px" }} />
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "15px" }}>
          <IconButton onClick={() => navigate("/Notifications")} style={{ padding: 0 }}>
            <NotificationsIcon style={{ color: "white" }} />
          </IconButton>

          <IconButton onClick={() => navigate("/ChatPage")} style={{ padding: 0 }}>
            <ChatIcon style={{ color: "white" }} />
          </IconButton>

          <IconButton onClick={handleHamburgerClick} style={{ padding: 0 }}>
            <MenuIcon style={{ color: "white" }} />
          </IconButton>
        </div>

        {/* Hamburger Popover */}
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
    backgroundColor: "#315b7e",
    padding: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    width: "100%",
    position: "fixed",
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
