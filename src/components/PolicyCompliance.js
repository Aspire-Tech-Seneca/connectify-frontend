import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";

// NavBar component matching your other pages
const NavBar = ({ navigate, notificationCount, notifications }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [hamburgerAnchorEl, setHamburgerAnchorEl] = React.useState(null);

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
            <Badge badgeContent={notificationCount} color="error">
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
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No new notifications" />
            </ListItem>
          ) : (
            notifications.map((notif, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  handleCloseNotificationPopover();
                  navigate("/notifications");
                }}
              >
                <ListItemText primary={notif} />
              </ListItem>
            ))
          )}
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

const PolicyCompliance = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.outerContainer}>
      <NavBar navigate={navigate} notificationCount={0} notifications={[]} />
      <div style={styles.contentWrapper}>
        <Container maxWidth="md" style={{ marginTop: "2rem", marginBottom: "2rem", color: "white" }}>
          <Typography variant="h3" align="center" gutterBottom>
            Policy and Compliance
          </Typography>
          
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph>
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard your personal data. We adhere to applicable data protection laws and strive to ensure that your information is processed securely and transparently.
            </Typography>
          </Box>
          
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Compliance Statement
            </Typography>
            <Typography variant="body1" paragraph>
              We are committed to operating in full compliance with all legal and regulatory requirements. Our internal policies and procedures are regularly reviewed to ensure that we maintain the highest standards of compliance.
            </Typography>
          </Box>
          
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Terms and Conditions
            </Typography>
            <Typography variant="body1" paragraph>
              By accessing and using our services, you agree to be bound by our Terms and Conditions. Please review these terms carefully, as they govern your use of our platform.
            </Typography>
          </Box>
          
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Data Security
            </Typography>
            <Typography variant="body1" paragraph>
              We implement a variety of security measures to maintain the safety of your personal information. All sensitive data is stored securely and handled in accordance with industry best practices.
            </Typography>
          </Box>
          
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions or concerns regarding our policies or practices, please contact our support team at support@example.com.
            </Typography>
          </Box>
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
    background: "#315b7e",
    backgroundImage: "url('./peach.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    margin: "20px auto",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    borderRadius: "8px",
    maxWidth: "1200px",
    width: "95%",
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

export default PolicyCompliance;
