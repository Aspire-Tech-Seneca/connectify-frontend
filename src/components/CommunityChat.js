// File: src/components/CommunityChat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, List, ListItem, ListItemText, IconButton, Badge, Popover } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import Picker from "emoji-picker-react"; // Make sure to install with: npm install emoji-picker-react
import peachImage from "./peach.jpg"; // Make sure peach.jpg is in the same folder

// NavBar component (mirroring Profile.js)
const NavBar = ({ navigate, notificationCount, notifications }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleNotificationIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "notification-popover" : undefined;

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Chat", path: "/ChatPage" },
    { label: "My Profile", path: "/profile" },
    { label: "About Us", path: "/about" },
    { label: "My Matches", path: "/matches" },
    { label: "Logout", path: "/login" },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.navItems}>
        {navItems.map((item) => (
          <button
            key={item.label}
            style={styles.navButton}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
        <IconButton onClick={handleNotificationIconClick}>
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsIcon style={{ color: "white" }} />
          </Badge>
        </IconButton>
        <MenuIcon style={{ color: "white", fontSize: "24px" }} />
      </div>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {notifications.length === 0 ? (
          <List style={{ padding: "10px" }}>
            <ListItem>
              <ListItemText primary="No new notifications" />
            </ListItem>
          </List>
        ) : (
          <List>
            {notifications.map((notif, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  handleClosePopover();
                  navigate("/notifications");
                }}
              >
                <ListItemText primary={notif} />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </nav>
  );
};

const CommunityChat = () => {
  const navigate = useNavigate();

  // Dummy notifications
  const [notifications] = useState([]);
  const notificationCount = notifications.length;

  // Dummy chat messages
  const [messages, setMessages] = useState([
    { user: "Alice", message: "Hello everyone!", timestamp: "10:01 AM" },
    { user: "Bob", message: "Hi Alice! How are you?", timestamp: "10:02 AM" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to format the timestamp consistently
  const getFormattedTimestamp = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Dummy send message function
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg = {
      user: "CurrentUser",
      message: inputMessage.trim(),
      timestamp: getFormattedTimestamp(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
  };

  // Handle emoji selection
  const onEmojiClick = (emojiData) => {
    setInputMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div style={styles.outerContainer}>
      {/* Full-width NavBar */}
      <NavBar
        navigate={navigate}
        notificationCount={notificationCount}
        notifications={notifications}
      />

      {/* Main Chat Section */}
      <div style={styles.chatSection}>
        <div style={styles.chatContainer}>
          <div style={styles.messagesList}>
            {messages.map((msg, i) => (
              <div key={i} style={styles.messageItem}>
                <strong>{msg.user} [{msg.timestamp}]:</strong>
                <p style={{ margin: "5px 0 0 0" }}>{msg.message}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Row */}
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
  );
};

// Styles
const styles = {
  outerContainer: {
    width: "100%",
    minHeight: "100vh",
    backgroundImage: `url(${peachImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
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
    whiteSpace: "nowrap",
  },
  chatSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 0",
  },
  chatContainer: {
    width: "60%",
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
    borderColor: "#C38282",
    color: "#C38282",
    fontSize: "20px",
    fontWeight: "bold",
  },
  sendButton: {
    background: "#C38282",
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
