import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Picker from "emoji-picker-react"; // Install with npm or yarn
import peachImage from "./peach.jpg"; // Ensure peach.jpg is in the same folder

// Replicates your Profile page's NavBar style
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
        <MenuIcon style={{ color: "white", fontSize: "24px" }} />
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
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
    setInputMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div style={styles.outerContainer}>
      {/* Full-width NavBar at the top */}
      <NavBar />

      {/* Main Chat Section */}
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

          {/* Input Row */}
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

// Styles
const styles = {
  // Outer container: single peach background, 100% width & height
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

  // NavBar from your profile page
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

  // Chat section: centers the chat container
  chatSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 0",
  },

  // Single-layer chat container (wider and taller)
  chatContainer: {
    width: "60%",         // Wider container
    minHeight: "75vh",    // Taller container
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
  },
  messageItem: {
    marginBottom: "10px",
    background: "#f5f5f5",
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

  // Emoji picker popup
  emojiPickerPopup: {
    position: "absolute",
    bottom: "50px",
    left: 0,
    zIndex: 9999,
  },
};

export default CommunityChat;
