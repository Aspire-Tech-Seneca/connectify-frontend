// File: src/components/MatchesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Snackbar,
  Alert,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

// NavBar Component with a notification icon and popover list
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
        <Popover
          id={popoverId}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
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
                    handleClosePopover();
                    navigate("/notifications");
                  }}
                >
                  <ListItemText primary={notif} />
                </ListItem>
              ))
            )}
          </List>
        </Popover>
      </div>
    </nav>
  );
};

// Component for displaying current (approved) matches or pending outgoing requests
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
                  Interests: {match.interests?.join(", ") || "N/A"}
                </p>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button onClick={() => handleChat(match.id)} style={styles.matchButton}>
                Chat
              </button>
              {match.status === "pending" && (
                <button
                  onClick={() => handleCancelRequest(match.id)}
                  style={styles.removeButton}
                >
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

// Component for displaying incoming match requests (pending from others)
const IncomingRequests = ({
  incomingRequests,
  handleApproveIncoming,
  handleDeclineIncoming,
}) => {
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
                  <strong>
                    {match.name}, {match.age}
                  </strong>
                </p>
                <p style={styles.matchInterests}>
                  Interests: {match.interests?.join(", ") || "N/A"}
                </p>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button
                onClick={() => handleDeclineIncoming(match.id)}
                style={styles.removeButton}
              >
                ❌ Decline
              </button>
              <button
                onClick={() => handleApproveIncoming(match.id)}
                style={styles.matchButton}
              >
                ✅ Approve
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Component for displaying suggested matches with an option to send a match request
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
                  <strong>
                    {match.name}, {match.age}
                  </strong>
                </p>
                <p style={styles.matchInterests}>
                  Interests: {match.interests?.join(", ") || "N/A"}
                </p>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button
                onClick={() => handleDeclineSuggested(match.id)}
                style={styles.removeButton}
              >
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

  // States for matches
  const [currentMatches, setCurrentMatches] = useState([]); // Approved or pending outgoing
  const [incomingRequests, setIncomingRequests] = useState([]); // Pending from others
  const [suggestedMatches, setSuggestedMatches] = useState([]); // New potential matches

  // State for top bar notifications (a list of string messages)
  const [notificationList, setNotificationList] = useState([]);

  // State for Snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success", "error", "info", "warning"
  });

  const token = localStorage.getItem("token");

  // 1) Fetch current matches via GET /users/get-mymatchup-list/
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE_URL}/users/get-mymatchup-list/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((user) => ({
          id: user.id,
          name: user.fullname,
          age: user.age,
          interests: user.interest ? [user.interest.name] : [],
          photo: user.profile_image?.image_url || "https://via.placeholder.com/150",
          status: "approved",
        }));
        setCurrentMatches(transformed);
      })
      .catch((err) => console.error("Failed to fetch my matches:", err));
  }, [token]);

  // 2) Fetch incoming requests via GET /users/get-matchup-status/
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE_URL}/users/get-matchup-status/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((user) => ({
          id: user.id,
          name: user.fullname,
          age: user.age,
          interests: user.interest ? [user.interest.name] : [],
          photo: user.profile_image?.image_url || "https://via.placeholder.com/150",
        }));
        setIncomingRequests(transformed);
      })
      .catch((err) => console.error("Failed to fetch incoming requests:", err));
  }, [token]);

  // 3) Fetch suggested matches: get user's interest then POST /users/get-recommend-matchups/
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE_URL}/users/retrieve-interest/`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((interestData) => {
        if (!interestData.name) {
          console.log("No user interest found. Skipping suggested matches.");
          return;
        }
        return fetch(`${BASE_URL}/users/get-recommend-matchups/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ interest: interestData.name }),
        });
      })
      .then((res) => (res ? res.json() : []))
      .then((data) => {
        if (!data || !Array.isArray(data)) return;
        const transformed = data.map((user) => ({
          id: user.id,
          name: user.fullname,
          age: user.age,
          interests: user.interest ? [user.interest.name] : [],
          photo: user.profile_image?.image_url || "https://via.placeholder.com/150",
        }));
        setSuggestedMatches(transformed);
      })
      .catch((err) => console.error("Failed to fetch suggested matches:", err));
  }, [token]);

  // Snackbar close handler
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Navigate to ChatPage
  const handleChat = (id) => {
    navigate("/ChatPage");
  };

  // 4) Send a match request via POST /users/request-matchup/
  const handleSendRequest = async (id) => {
    const match = suggestedMatches.find((m) => m.id === id);
    if (!match) return;

    try {
      const response = await fetch(`${BASE_URL}/users/request-matchup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "receiver-user-id": id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send matchup request");
      }
      setSuggestedMatches(suggestedMatches.filter((m) => m.id !== id));
      setCurrentMatches([...currentMatches, { ...match, status: "pending" }]);
      const message = `Match request sent to ${match.name}.`;
      setSnackbar({ open: true, message, severity: "info" });
      setNotificationList([...notificationList, message]);
    } catch (err) {
      console.error("Error sending matchup request:", err);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // 5) Cancel a pending request using the Deny matchup request API
  const handleCancelRequest = async (id) => {
    const match = currentMatches.find((m) => m.id === id && m.status === "pending");
    if (!match) return;

    try {
      const response = await fetch(`${BASE_URL}/users/deny-matchup-request/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "requester-user-id": id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel matchup request");
      }
      setCurrentMatches(currentMatches.filter((m) => m.id !== id));
      const message = `Match request to ${match.name} cancelled successfully.`;
      setSnackbar({ open: true, message, severity: "info" });
      setNotificationList([...notificationList, message]);
    } catch (err) {
      console.error("Error cancelling matchup request:", err);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // 6) Approve an incoming match request via PUT /users/confirm-matchup-request/
  const handleApproveIncoming = async (id) => {
    const match = incomingRequests.find((m) => m.id === id);
    if (!match) return;

    try {
      const response = await fetch(`${BASE_URL}/users/confirm-matchup-request/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "requester-user-id": id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm matchup request");
      }
      setIncomingRequests(incomingRequests.filter((m) => m.id !== id));
      setCurrentMatches([...currentMatches, { ...match, status: "approved" }]);
      const message = `You approved the match with ${match.name}.`;
      setSnackbar({ open: true, message, severity: "success" });
      setNotificationList([...notificationList, message]);
    } catch (err) {
      console.error("Error confirming matchup request:", err);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // 7) Decline an incoming match request via PUT /users/deny-matchup-request/
  const handleDeclineIncoming = async (id) => {
    const match = incomingRequests.find((m) => m.id === id);
    if (!match) return;

    try {
      const response = await fetch(`${BASE_URL}/users/deny-matchup-request/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "requester-user-id": id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to deny matchup request");
      }
      setIncomingRequests(incomingRequests.filter((m) => m.id !== id));
      const message = `${match.name}'s request declined.`;
      setSnackbar({ open: true, message, severity: "info" });
      setNotificationList([...notificationList, message]);
    } catch (err) {
      console.error("Error denying matchup request:", err);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // 8) Decline a suggested match (remove from local state)
  const handleDeclineSuggested = (id) => {
    const match = suggestedMatches.find((m) => m.id === id);
    if (!match) return;
    setSuggestedMatches(suggestedMatches.filter((m) => m.id !== id));
    const message = `${match.name} declined.`;
    setSnackbar({ open: true, message, severity: "info" });
    setNotificationList([...notificationList, message]);
  };

  // For top bar notification badge, we'll use the length of incomingRequests.
  const notificationCount = incomingRequests.length;

  return (
    <div style={styles.outerContainer}>
      <NavBar
        navigate={navigate}
        notificationCount={notificationCount}
        notifications={notificationList}
      />
      <div style={styles.contentWrapper}>
        <div style={styles.contentContainer}>
          {/* Left Column: Current Matches */}
          <div style={styles.column}>
            <CurrentMatches
              currentMatches={currentMatches}
              handleChat={(id) => navigate("/ChatPage")}
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
              handleDeclineSuggested={handleDeclineSuggested}
            />
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
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
