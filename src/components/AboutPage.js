import React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IconButton, Badge, Popover, List, ListItem, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import eni from "../image/Eni.jpg";
import shailendra from "../image/shailendra.jpg";
import jiyun from "../image/Jiyun.jpg";
import john from "../image/John.jpg";
import behzad from "../image/Behzad.jpg";
import zahrah from "../image/Zahrah.jpg";

const NavBar = ({ navigate }) => {
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

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.outerContainer}>
      <NavBar navigate={navigate} />
      <div style={styles.contentWrapper}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom style={styles.heading}>
            About Us
          </Typography>
          <Box mt={3}>
            <Typography variant="body1" paragraph style={styles.text}>
              Welcome to Connectify! Connectify is a modern, user-friendly platform designed to help you build meaningful connections based on shared interests. Our application empowers you to create personalized profiles, find like-minded individuals, and engage in social activities both online and in person.
            </Typography>
          </Box>
          <Box mt={5}>
            <Typography variant="h4" align="center" gutterBottom style={styles.subHeading}>
              Meet the Team
            </Typography>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={shailendra} alt="Shailendra" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Shailendra
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Frontend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={eni} alt="Eni Zeqo" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Eni Zeqo
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Frontend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={zahrah} alt="Zahrah" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Zahrah
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Frontend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={behzad} alt="Behzad" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Behzad
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Backend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={jiyun} alt="Jiyun Guo" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Jiyun Guo
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Backend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={john} alt="John" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  John
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  SRE
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box mt={5}>
            <Typography variant="h4" align="center" gutterBottom style={styles.subHeading}>
              Contact Us
            </Typography>
            <Box textAlign="center" mt={2}>
              <Typography variant="body1" paragraph style={styles.text}>
                We would love to hear from you! Reach out for any inquiries or feedback.
              </Typography>
              <Typography variant="body1" style={styles.text}>
                Email:{" "}
                <a href="mailto:support@connectify.com" style={styles.link}>
                  support@connectify.com
                </a>
              </Typography>
              <Typography variant="body1" style={styles.text}>
                Phone:{" "}
                <a href="tel:+1234567890" style={styles.link}>
                  (123) 456-7890
                </a>
              </Typography>
              <Typography variant="body1" style={styles.text}>
                Address: 1750 Finch Ave E, North York ON M2J2X5
              </Typography>
            </Box>
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
    background: "rgba(7, 53, 102, 0.7)",
    backgroundImage: "url('./peach.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    margin: "20px auto",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
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
  heading: {
    color: "white",
    fontWeight: 700,
    marginBottom: "1rem",
  },
  subHeading: {
    color: "white",
    fontWeight: 600,
    marginBottom: "1rem",
  },
  text: {
    color: "white",
    lineHeight: 1.6,
    fontSize: "1rem",
  },
  link: {
    color: "white",
    textDecoration: "underline",
  },
  teamImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  teamName: {
    marginTop: "0.5rem",
    fontWeight: 600,
    color: "white",
  },
  teamRole: {
    fontSize: "0.8rem",
    color: "white",
  },
};

export default AboutPage;