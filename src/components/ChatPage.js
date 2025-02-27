import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// NavBar component
const NavBar = () => {
  const navigate = useNavigate();
  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Chat", path: "/ChatPage" },
    { label: "My Profile", path: "/profile" },
    { label: "About Us", path: "/about" },
    { label: "My Matches", path: "/matches" },
    { label: "Logout", path: "/login" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="nav-items">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="nav-button"
            onClick={() => handleNavigation(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// ChatMatches component
const ChatMatches = ({ matches, selectedMatch, setSelectedMatch }) => {
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
  };

  return (
    <div className="matches-container">
      <h2 className="section-title">Matches</h2>
      {matches.map((match) => (
        <div
          key={match.id}
          className={`match-card ${selectedMatch?.id === match.id ? "selected" : ""}`}
          onClick={() => handleSelectMatch(match)}
        >
          <img src={match.photo} alt={match.name} className="match-photo" />
          <div className="match-info">
            <p className="match-name">{match.name}</p>
            <p className="match-last-msg">{match.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ChatConversation component
const ChatConversation = ({
  match,
  messages,
  sendMessage,
  messageInput,
  setMessageInput,
  toggleEmojiPanel,
  showEmojiPanel,
  addEmoji,
}) => {
  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    sendMessage(messageInput);
  };

  const handleAddEmoji = (emoji) => {
    addEmoji(emoji);
  };

  return (
    <div className="conversation-container">
      <h2 className="section-title">Chat with {match ? match.name : "Select a Match"}</h2>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender === "me" ? "sent" : "received"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      {match && (
        <div className="message-input-container">
          <button className="emoji-button" onClick={toggleEmojiPanel}>
            😊
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      )}
      {showEmojiPanel && (
        <div className="emoji-panel">
          {["😀", "😂", "😍", "😎", "👍", "🙏", "🔥", "💯"].map((emoji) => (
            <span
              key={emoji}
              className="emoji"
              onClick={() => handleAddEmoji(emoji)}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ChatPage component
const ChatPage = () => {
  const navigate = useNavigate();

  const [matches] = useState([
    { id: 1, name: "Alice", photo: "https://via.placeholder.com/100", lastMessage: "Hey! How have you been?" },
    { id: 2, name: "Bob", photo: "https://via.placeholder.com/100", lastMessage: "Did you check out that new movie?" },
    { id: 3, name: "Charlie", photo: "https://via.placeholder.com/100", lastMessage: "How was your weekend?" },
    { id: 4, name: "Eni Zeqo", photo: "https://via.placeholder.com/100", lastMessage: "Are we still on for dinner?" },
    { id: 5, name: "Kunal", photo: "https://via.placeholder.com/100", lastMessage: "Let's plan a trip soon!" },
    { id: 6, name: "Atif", photo: "https://via.placeholder.com/100", lastMessage: "Hope you're having a great day!" },
    { id: 7, name: "Swagat", photo: "https://via.placeholder.com/100", lastMessage: "When are you free to catch up?" },
    { id: 8, name: "Faizal", photo: "https://via.placeholder.com/100", lastMessage: "Let’s grab a coffee sometime!" },
    { id: 9, name: "Arjoo", photo: "https://via.placeholder.com/100", lastMessage: "I have some exciting news to share!" },
  ]);
  

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);

  useEffect(() => {
    if (selectedMatch) {
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
    setMessageInput("");
  };

  const toggleEmojiPanel = () => {
    setShowEmojiPanel((prev) => !prev);
  };

  const addEmoji = (emoji) => {
    setMessageInput(messageInput + emoji);
  };

  return (
    <div className="outer-container">
      <NavBar />
      <div className="content-wrapper">
        <div className="content-container">
          <div className="column">
            <ChatMatches
              matches={matches}
              selectedMatch={selectedMatch}
              setSelectedMatch={setSelectedMatch}
            />
          </div>
          <div className="column">
            <ChatConversation
              match={selectedMatch}
              messages={messages}
              sendMessage={sendMessage}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              toggleEmojiPanel={toggleEmojiPanel}
              showEmojiPanel={showEmojiPanel}
              addEmoji={addEmoji}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
