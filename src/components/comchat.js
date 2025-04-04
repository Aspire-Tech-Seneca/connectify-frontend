// src/components/CommunityChat.js
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Picker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";
const authToken = localStorage.getItem("authToken");

const BackgroundContainer = styled("div")({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const ChatBox = styled(Container)({
  position: "relative",
  zIndex: 2,
  background: "rgba(255,255,255,0.95)",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)",
  width: "90%",
  maxWidth: "800px",
  minWidth: "450px",
});

const MessageList = styled(Box)({
  maxHeight: "400px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginBottom: "20px",
});

const MessageItem = styled(Paper)({
  padding: "10px 15px",
  background: "#f1f1f1",
  borderRadius: "8px",
});

const CommunityChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/api/reviews/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error("Failed to fetch chat messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // ⏳ Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/users/api/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ comment: inputMessage, rating: 5 }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setInputMessage("");
      fetchMessages(); // 🟢 Trigger immediate refresh after sending
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInputMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <BackgroundContainer>
      <ChatBox>
        <Typography variant="h5" fontWeight="bold" color="#315b7e" gutterBottom>
          Community Chat 💬
        </Typography>

        <MessageList>
          {loading ? (
            <Typography>Loading messages...</Typography>
          ) : messages.length === 0 ? (
            <Typography>No messages yet. Be the first to chat!</Typography>
          ) : (
            messages.map((msg) => (
              <MessageItem key={msg.id}>
                <Typography variant="subtitle2" color="#0077b6">
                  {msg.user?.fullname || "Anonymous"}
                </Typography>
                <Typography variant="body2">{msg.comment}</Typography>
              </MessageItem>
            ))
          )}
          <div ref={chatEndRef} />
        </MessageList>

        <Box display="flex" alignItems="center" gap={2}>
          <Box position="relative">
            <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
              <EmojiEmotionsIcon sx={{ color: "#315b7e" }} />
            </IconButton>
            {showEmojiPicker && (
              <Box sx={{ position: "absolute", bottom: "50px", zIndex: 999 }}>
                <Picker onEmojiClick={onEmojiClick} />
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{ backgroundColor: "#315b7e", fontWeight: "bold" }}
          >
            Send
          </Button>
        </Box>
      </ChatBox>
    </BackgroundContainer>
  );
};

export default CommunityChat;
