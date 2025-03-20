import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Popover,
  Snackbar,
  Alert,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import Picker from "emoji-picker-react"; // Ensure installation: npm install emoji-picker-react
import peachImage from "./peach.jpg";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

// NavBar component (matching Matches and Profile pages)
const NavBar = ({ navigate, notificationCount, notifications }) => {
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

const CommunityChat = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState("Anonymous");
  const authToken = localStorage.getItem("authToken");

  // Fetch current user's info from backend and set as currentUser
  useEffect(() => {
    if (authToken) {
      fetch(`${BASE_URL}/users/get-user-info/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.fullname) {
            setCurrentUser(data.fullname);
          }
        })
        .catch((err) => console.error("Error fetching user info:", err));
    }
  }, [authToken]);

  // Dummy notifications (if any)
  const [notifications] = useState([]);
  const notificationCount = notifications.length;

  // Chat messages state
  const [messages, setMessages] = useState([
    { user: "Alice", message: "Hello everyone!", timestamp: "10:01 AM" },
    { user: "Bob", message: "Hi Alice! How are you?", timestamp: "10:02 AM" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getFormattedTimestamp = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // When sending a message, the message object uses currentUser as the sender's name.
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg = {
      user: currentUser,
      message: inputMessage.trim(),
      timestamp: getFormattedTimestamp(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
  };

  const onEmojiClick = (emojiData) => {
    setInputMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div style={styles.outerContainer}>
      <NavBar
        navigate={navigate}
        notificationCount={notificationCount}
        notifications={notifications}
      />
      <div style={styles.contentWrapper}>
        <div style={styles.chatSection}>
          <div style={styles.chatContainer}>
            <div style={styles.messagesList}>
              {messages.map((msg, i) => (
                <div key={i} style={styles.messageItem}>
                  <strong>
                    {msg.user} [{msg.timestamp}]:
                  </strong>
                  <p style={{ margin: "5px 0 0 0" }}>{msg.message}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div style={styles.inputRow}>
              <div style={{ position: "relative" }}>
                <Button
                  variant="outlined"
                  style={styles.emojiButton}
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  😊
                </Button>
                {showEmojiPicker && (
                  <div style={styles.emojiPickerPopup}>
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <Button variant="contained" onClick={sendMessage} style={styles.sendButton}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={false}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info">Placeholder</Alert>
      </Snackbar>
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
  contentWrapper: {
    background: "rgba(7, 53, 102, 0.5)",
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
  chatSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 0",
  },
  chatContainer: {
    width: "100%",
    minHeight: "75vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  messagesList: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  messageItem: {
    background: "#f5f5f5",
    borderRadius: "8px",
    padding: "8px 12px",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  emojiButton: {
    marginRight: "5px",
    minWidth: "40px",
    borderColor: "#315b7e",
    color: "#315b7e",
    fontSize: "20px",
    fontWeight: "bold",
  },
  sendButton: {
    background: "#315b7e",
    color: "white",
    padding: "10px 20px",
    fontWeight: "bold",
    textTransform: "none",
  },
  emojiPickerPopup: {
    position: "absolute",
    bottom: "50px",
    left: 0,
    zIndex: 9999,
  },
};

export default CommunityChat;
