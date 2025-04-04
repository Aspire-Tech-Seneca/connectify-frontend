import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// Placeholder image to avoid repeated blob calls
const DEFAULT_IMAGE = "https://atcdevstorageaccount.blob.core.windows.net/media/profile_images/defaultProfilePic.jpg";

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
  contentContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "stretch",
  },
  column: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  // Matches list styling
  matchesContainer: {
    background: "rgba(7, 53, 102, 0.7)",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    padding: "15px",
    marginBottom: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  matchCard: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    cursor: "pointer",
    backgroundColor: "#f5f5f5",
  },
  matchCardSelected: {
    backgroundColor: "rgb(170, 198, 227)",
  },
  matchPhoto: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
  },
  matchName: {
    fontWeight: "bold",
    margin: 0,
  },
  lastMessage: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
  },
  // Conversation styling
  conversationContainer: {
    background: "rgba(7, 53, 102, 0.7)",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    padding: "15px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  messageBubble: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#eee",
    color: "black",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  messageInput: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  sendButton: {
    background: "rgba(7, 53, 102, 0.7)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 15px",
    cursor: "pointer",
  },
};

const ChatMatches = ({ matches, selectedMatch, setSelectedMatch }) => {
  return (
    <div style={styles.matchesContainer}>
      <h2 style={{ marginBottom: "10px", textAlign: "center", color: "white" }}>Matches</h2>
      {matches.map((match) => {
        const isSelected = selectedMatch?.id === match.id;
        return (
          <div
            key={match.id}
            style={{
              ...styles.matchCard,
              ...(isSelected ? styles.matchCardSelected : {}),
            }}
            onClick={() => setSelectedMatch(match)}
          >
            <img
              src={DEFAULT_IMAGE || match.photo}
              alt={match.name}
              style={styles.matchPhoto}
            />
            <div>
              <p style={styles.matchName}>{match.name}</p>
              <p style={styles.lastMessage}>{match.lastMessage}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ChatConversation = ({
  match,
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
}) => {
  const handleSend = () => {
    if (!messageInput.trim()) return;
    sendMessage(messageInput);
    setMessageInput("");
  };

  return (
    <div style={styles.conversationContainer}>
      <h2 style={{ marginBottom: "10px", textAlign: "center", color: "white" }}>
        {match ? `Chat with ${match.name}` : "Select a Match"}
      </h2>
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageBubble,
              ...(msg.sender === "me" ? styles.sent : styles.received),
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      {match && (
        <div style={styles.inputRow}>
          <input
            style={styles.messageInput}
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button style={styles.sendButton} onClick={handleSend}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

const ChatPage = () => {
  const navigate = useNavigate();
  const [matches] = useState([
    {
      id: 1,
      name: "Alice",
      photo: DEFAULT_IMAGE,
      lastMessage: "Hey! How have you been?",
    },
    {
      id: 2,
      name: "Bob",
      photo: DEFAULT_IMAGE,
      lastMessage: "Did you check out that new movie?",
    },
    {
      id: 3,
      name: "Charlie",
      photo: DEFAULT_IMAGE,
      lastMessage: "How was your weekend?",
    },
  ]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (selectedMatch) {
      // Dummy conversation
      setMessages([
        { sender: "them", text: `Hello, I'm ${selectedMatch.name}!` },
        { sender: "me", text: "Hi, how are you?" },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedMatch]);

  const sendMessage = (text) => {
    setMessages([...messages, { sender: "me", text }]);
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.contentContainer}>
          <div style={styles.column}>
            <ChatMatches
              matches={matches}
              selectedMatch={selectedMatch}
              setSelectedMatch={setSelectedMatch}
            />
          </div>
          <div style={styles.column}>
            <ChatConversation
              match={selectedMatch}
              messages={messages}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;