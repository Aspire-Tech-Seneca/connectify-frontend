import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import Picker from "emoji-picker-react"; // Make sure you've installed emoji-picker-react
import peachImage from "./peach.jpg"; // Ensure peach.jpg is in the same folder
import MenuIcon from "@mui/icons-material/Menu";

// A NavBar component that mimics your profile page styling
const NavBar = ({ navigate }) => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.navItems}>
        {[
          { label: "Home", path: "/home" },
          { label: "Chat", path: "/ChatPage" },
          { label: "My Profile", path: "/profile" },
          { label: "About Us", path: "/about" },
          { label: "My Matches", path: "/matches" },
          { label: "Logout", path: "/login" },
        ].map((item) => (
          <button
            key={item.label}
            style={styles.navButton}
            onClick={() => (navigate ? navigate(item.path) : null)}
          >
            {item.label}
          </button>
        ))}
        <MenuIcon style={{ color: "white" }} />
      </div>
    </nav>
  );
};

const CommunityChat = () => {
  const [messages, setMessages] = useState([
    { user: "Alice", message: "Hello everyone!", timestamp: "10:01 AM" },
    { user: "Bob", message: "Hi Alice! How are you?", timestamp: "10:02 AM" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef(null);

  // Emoji picker visibility
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dummy send message
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg = {
      user: "CurrentUser",
      message: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
  };

  // Handle emoji selection
  const onEmojiClick = (emojiData) => {
    setInputMessage(inputMessage + emojiData.emoji);
  };

  return (
    <div style={styles.outerContainer}>
      {/* Full-Width NavBar */}
      <NavBar />

      {/* Main Chat Section with Glassmorphism */}
      <div style={styles.chatSection}>
        <div style={styles.chatContainer}>
          <List style={styles.messagesList}>
            {messages.map((msg, i) => (
              <ListItem key={i} style={styles.messageItem}>
                <ListItemText
                  primary={`${msg.user} [${msg.timestamp}]:`}
                  secondary={msg.message}
                />
              </ListItem>
            ))}
            <div ref={chatEndRef} />
          </List>

          <div style={styles.inputRow}>
            <div style={{ position: "relative" }}>
              {/* Emoji Picker Toggle Button */}
              <Button
                variant="outlined"
                style={styles.emojiButton}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                😊
              </Button>

              {/* Emoji Picker Popup */}
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

const styles = {
  // Outer container with peach background
  outerContainer: {
    minHeight: "100vh",
    backgroundImage: `url(${peachImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
  },

  // NavBar styles (from your profile page)
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

  // Chat section container
  chatSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  // Glassmorphism chat container
  chatContainer: {
    width: "95%",
    maxWidth: "600px",
    height: "80vh", // bigger height
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    borderRadius: "16px",
    // Glass effect
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },

  messagesList: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "15px",
  },
  messageItem: {
    marginBottom: "10px",
    background: "rgba(255,255,255,0.8)",
    borderRadius: "8px",
    padding: "8px 12px",
  },

  // Input row
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

  // Emoji Picker popup styling
  emojiPickerPopup: {
    position: "absolute",
    bottom: "50px",
    // Adjust left or right as needed
    left: 0,
    zIndex: 9999,
  },
};

export default CommunityChat;
