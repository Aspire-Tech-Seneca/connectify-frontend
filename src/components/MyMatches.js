import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

// Load environment variables for API endpoints
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost";
const BASE_PATH = process.env.REACT_APP_BASE_PATH || "/api";

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

// Component for displaying current (approved and pending outgoing) matches.
// Pending matches will show a "Pending" label and a Cancel button.
const CurrentMatches = ({ currentMatches, handleChat, handleCancelRequest }) => {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Current Matches</h2>
      {currentMatches.length === 0 ? (
        <p style={styles.emptyText}>No current matches.</p>
      ) : (
        currentMatches.map((match) => (
          <div key={match.id} style={styles.matchedUserCard}>
            <div style={styles.matchContent}>
              <img src={match.photo} alt={match.name} style={styles.matchPhoto} />
              <div style={styles.matchDetails}>
                <p style={styles.matchName}>
                  <strong>
                    {match.name}, {match.age}{" "}
                    {match.status === "pending" && (
                      <span style={{ fontStyle: "italic", color: "#ae4040" }}>
                        (Pending)
                      </span>
                    )}
                  </strong>
                </p>
                <p style={styles.matchInterests}>
                  Interests: {match.interests.join(", ")}
                </p>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button onClick={() => handleChat(match.id)} style={styles.matchButton}>
                Chat
              </button>
              {match.status === "pending" && (
                <button onClick={() => handleCancelRequest(match.id)} style={styles.removeButton}>
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Component for displaying incoming match requests.
const IncomingRequests = ({ incomingRequests, handleApproveIncoming, handleDeclineIncoming }) => {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Incoming Requests</h2>
      {incomingRequests.length === 0 ? (
        <p style={styles.emptyText}>No incoming requests.</p>
      ) : (
        incomingRequests.map((match) => (
          <div key={match.id} style={styles.matchedUserCard}>
            <div style={styles.matchContent}>
              <img src={match.photo} alt={match.name} style={styles.matchPhoto} />
              <div style={styles.matchDetails}>
                <p style={styles.matchName}>
                  <strong>{match.name}, {match.age}</strong>
                </p>
                <p style={styles.matchInterests}>
                  Interests: {match.interests.join(", ")}
                </p>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button onClick={() => handleDeclineIncoming(match.id)} style={styles.removeButton}>
                ❌ Decline
              </button>
              <button onClick={() => handleApproveIncoming(match.id)} style={styles.matchButton}>
                ✅ Approve
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Component for displaying suggested matches with an option to send a match request.
const SuggestedMatches = ({ suggestedMatches, handleSendRequest, handleDeclineSuggested }) => {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Suggested Matches</h2>
      {suggestedMatches.length === 0 ? (
        <p style={styles.emptyText}>No suggested matches available.</p>
      ) : (
        suggestedMatches.map((match) => (
          <div key={match.id} style={styles.matchedUserCard}>
            <div style={styles.matchContent}>
              <img src={match.photo} alt={match.name} style={styles.matchPhoto} />
              <div style={styles.matchDetails}>
                <p style={styles.matchName}>
                  <strong>{match.name}, {match.age}</strong>
                </p>
                <p style={styles.matchInterests}>
                  Interests: {match.interests.join(", ")}
                </p>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button onClick={() => handleDeclineSuggested(match.id)} style={styles.removeButton}>
                ❌ Decline
              </button>
              <button onClick={() => handleSendRequest(match.id)} style={styles.matchButton}>
                ➤ Send Request
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

  // State for matches
  const [currentMatches, setCurrentMatches] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [suggestedMatches, setSuggestedMatches] = useState([]);

  // Notification state for Snackbar
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success", "error", "info", "warning"
  });

  // Fetch current matches (approved and pending outgoing) from backend API
  useEffect(() => {
    fetch(`${BASE_URL}${BASE_PATH}/matches/current`)
      .then((res) => res.json())
      .then((data) => setCurrentMatches(data))
      .catch((err) => {
        console.error("Failed to fetch current matches:", err);
        // Fallback sample data (status can be "approved" or "pending")
        setCurrentMatches([
          {
            id: 1,
            name: "Sofia Martinez",
            age: 24,
            interests: ["Tech", "Books"],
            photo: "https://via.placeholder.com/150",
            status: "approved",
          },
          {
            id: 2,
            name: "Alex Johnson",
            age: 26,
            interests: ["Volleyball", "Music"],
            photo: "https://via.placeholder.com/150",
            status: "approved",
          },
          // Outgoing pending request example
          {
            id: 6,
            name: "Kevin Lee",
            age: 27,
            interests: ["Sports", "Movies"],
            photo: "https://via.placeholder.com/150",
            status: "pending",
          },
        ]);
      });
  }, []);

  // Fetch incoming match requests from backend API
  useEffect(() => {
    fetch(`${BASE_URL}${BASE_PATH}/matches/incoming`)
      .then((res) => res.json())
      .then((data) => setIncomingRequests(data))
      .catch((err) => {
        console.error("Failed to fetch incoming requests:", err);
        // Fallback sample data
        setIncomingRequests([
          {
            id: 7,
            name: "Emily Davis",
            age: 23,
            interests: ["Art", "Books"],
            photo: "https://via.placeholder.com/150",
          },
        ]);
      });
  }, []);

  // Fetch suggested matches from backend API
  useEffect(() => {
    fetch(`${BASE_URL}${BASE_PATH}/matches/suggested`)
      .then((res) => res.json())
      .then((data) => setSuggestedMatches(data))
      .catch((err) => {
        console.error("Failed to fetch suggested matches:", err);
        // Fallback sample data
        setSuggestedMatches([
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
      });
  }, []);

  // Notification close handler
  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  // Navigate to ChatPage
  const handleChat = (id) => {
    navigate("/ChatPage");
  };

  // Outgoing: Send a match request to a suggested match.
  // Add it to currentMatches with status "pending" and remove from suggested.
  const handleSendRequest = (id) => {
    const match = suggestedMatches.find((m) => m.id === id);
    if (match) {
      setSuggestedMatches(suggestedMatches.filter((m) => m.id !== id));
      setCurrentMatches([...currentMatches, { ...match, status: "pending" }]);
      setNotification({
        open: true,
        message: `Match request sent to ${match.name}.`,
        severity: "info",
      });
    }
  };

  // Outgoing: Cancel a pending request.
  const handleCancelRequest = (id) => {
    const match = currentMatches.find((m) => m.id === id && m.status === "pending");
    if (match) {
      setCurrentMatches(currentMatches.filter((m) => m.id !== id));
      setNotification({
        open: true,
        message: `Request to ${match.name} cancelled.`,
        severity: "info",
      });
    }
  };

  // Incoming: Approve a received match request.
  const handleApproveIncoming = (id) => {
    const match = incomingRequests.find((m) => m.id === id);
    if (match) {
      setIncomingRequests(incomingRequests.filter((m) => m.id !== id));
      setCurrentMatches([...currentMatches, { ...match, status: "approved" }]);
      setNotification({
        open: true,
        message: `You approved the match with ${match.name}.`,
        severity: "success",
      });
    }
  };

  // Incoming: Decline a received match request.
  const handleDeclineIncoming = (id) => {
    const match = incomingRequests.find((m) => m.id === id);
    setIncomingRequests(incomingRequests.filter((m) => m.id !== id));
    setNotification({
      open: true,
      message: `${match ? match.name : "Match"} request declined.`,
      severity: "info",
    });
  };

  return (
    <div style={styles.outerContainer}>
      <NavBar navigate={navigate} />
      <div style={styles.contentWrapper}>
        <div style={styles.contentContainer}>
          {/* Left Column: Current Matches (approved & pending outgoing) */}
          <div style={styles.column}>
            <CurrentMatches
              currentMatches={currentMatches}
              handleChat={handleChat}
              handleCancelRequest={handleCancelRequest}
            />
          </div>
          {/* Right Column: Incoming Requests and Suggested Matches */}
          <div style={styles.column}>
            <IncomingRequests
              incomingRequests={incomingRequests}
              handleApproveIncoming={handleApproveIncoming}
              handleDeclineIncoming={handleDeclineIncoming}
            />
            <SuggestedMatches
              suggestedMatches={suggestedMatches}
              handleSendRequest={handleSendRequest}
              handleDeclineSuggested={(id) => {
                const match = suggestedMatches.find((m) => m.id === id);
                setSuggestedMatches(suggestedMatches.filter((m) => m.id !== id));
                setNotification({
                  open: true,
                  message: `${match ? match.name : "Match"} declined.`,
                  severity: "info",
                });
              }}
            />
          </div>
        </div>
      </div>
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
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
