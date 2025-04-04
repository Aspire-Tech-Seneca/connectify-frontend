// src/components/CommunityChat.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import Picker from "emoji-picker-react"; // Ensure installation: npm install emoji-picker-react
import peachImage from "./peach.jpg"; // Background image if needed

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

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
      {/* Main Chat Section */}
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
              <Button
                variant="contained"
                onClick={sendMessage}
                style={styles.sendButton}
              >
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
