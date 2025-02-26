import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Navigation Bar Component – same as your profile page nav bar
const NavBar = ({ navigate }) => {
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
      </div>
    </nav>
  );
};

// Component for displaying current matches with a chat button
const CurrentMatches = ({ currentMatches, handleChat }) => {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Current Matches</h2>
      {currentMatches.length === 0 ? (
        <p style={styles.emptyText}>No current matches.</p>
      ) : (
        currentMatches.map((match) => (
          <div key={match.id} style={styles.matchedUserCard}>
            <div style={styles.matchContent}>
              <img
                src={match.photo}
                alt={match.name}
                style={styles.matchPhoto}
              />
              <div style={styles.matchDetails}>
                <p style={styles.matchName}>
                  <strong>
                    {match.name}, {match.age}
                  </strong>
                </p>
                <p style={styles.matchInterests}>
                  Interests: {match.interests.join(", ")}
                </p>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button
                onClick={() => handleChat(match.id)}
                style={styles.matchButton}
              >
                Chat
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Component for displaying suggested matches (similar to your profile page)
const SuggestedMatches = ({ suggestedMatches, handleApproveMatch }) => {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Suggested Matches</h2>
      {suggestedMatches.length === 0 ? (
        <p style={styles.emptyText}>No suggested matches available.</p>
      ) : (
        suggestedMatches.map((match) => (
          <div key={match.id} style={styles.matchedUserCard}>
            <div style={styles.matchContent}>
              <img
                src={match.photo}
                alt={match.name}
                style={styles.matchPhoto}
              />
              <div style={styles.matchDetails}>
                <p style={styles.matchName}>
                  <strong>
                    {match.name}, {match.age}
                  </strong>
                </p>
                <p style={styles.matchInterests}>
                  Interests: {match.interests.join(", ")}
                </p>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button
                onClick={() => handleApproveMatch(match.id)}
                style={styles.removeButton}
              >
                ❌ Remove
              </button>
              <button
                onClick={() => handleApproveMatch(match.id)}
                style={styles.matchButton}
              >
                ✅ Match
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const MatchesPage = () => {
  const navigate = useNavigate();

  // Sample data for current matches and suggested matches
  const [currentMatches, setCurrentMatches] = useState([
    {
      id: 1,
      name: "Sofia Martinez",
      age: 24,
      interests: ["Tech", "Books"],
      photo: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Alex Johnson",
      age: 26,
      interests: ["Volleyball", "Music"],
      photo: "https://via.placeholder.com/150",
    },
  ]);

  const [suggestedMatches, setSuggestedMatches] = useState([
    {
      id: 3,
      name: "Daniel Kim",
      age: 25,
      interests: ["Gaming", "Books"],
      photo: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Lina Roberts",
      age: 22,
      interests: ["Art", "Tech"],
      photo: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "George Evans",
      age: 28,
      interests: ["Fitness", "Books"],
      photo: "https://via.placeholder.com/150",
    },
  ]);

  const handleChat = (id) => {
    navigate("/ChatPage");
  };

  const handleApproveMatch = (id) => {
    const match = suggestedMatches.find((m) => m.id === id);
    if (match) {
      setSuggestedMatches(suggestedMatches.filter((m) => m.id !== id));
      setCurrentMatches([...currentMatches, match]);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <NavBar navigate={navigate} />
      <div style={styles.contentWrapper}>
        <div style={styles.contentContainer}>
          {/* Left Column: Current Matches */}
          <div style={styles.column}>
            <CurrentMatches
              currentMatches={currentMatches}
              handleChat={handleChat}
            />
          </div>
          {/* Right Column: Suggested Matches */}
          <div style={styles.column}>
            <SuggestedMatches
              suggestedMatches={suggestedMatches}
              handleApproveMatch={handleApproveMatch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Outer container takes full viewport width
  outerContainer: {
    background: "transparent",
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    width: "100vw",
  },
  // Same container style as in your profile page
  contentWrapper: {
    background: "rgba(245,236,227,0.4)",
    backgroundImage: "url('./peach.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    margin: "20px auto",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    borderRadius: "8px",
    maxWidth: "1200px",
    width: "100%",
  },
  // Matches the profile page: flex container without extra wrapping settings
  contentContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "stretch",
  },
  // Use the same column style as in your profile page
  column: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  sectionTitle: {
    marginBottom: "15px",
    color: "#5D4037",
    textAlign: "center",
  },
  matchedUserCard: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  matchContent: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  matchPhoto: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  matchDetails: {
    marginLeft: "15px",
    display: "flex",
    flexDirection: "column",
  },
  matchName: {
    margin: "0",
    fontSize: "16px",
  },
  matchInterests: {
    margin: "5px 0 0 0",
    fontSize: "14px",
    color: "#555",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
  },
  matchButton: {
    background: "#C38282",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background 0.3s, transform 0.3s",
  },
  removeButton: {
    background: "#C38282",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background 0.3s, transform 0.3s",
  },
  // NavBar style exactly matching the profile page
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
  emptyText: {
    textAlign: "center",
    color: "#A0522D",
    fontStyle: "italic",
  },
};

export default MatchesPage;
