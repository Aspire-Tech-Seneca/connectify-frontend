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
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

// Updated NavBar Component (matches Profile page)
const NavBar = ({ navigate, notificationCount, notifications }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState(null);

  const handleNotificationIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseNotificationPopover = () => {
    setAnchorEl(null);
  };

  const handleHamburgerClick = (event) => {
    setHamburgerAnchorEl(event.currentTarget);
  };
  const handleCloseHamburgerPopover = () => {
    setHamburgerAnchorEl(null);
  };

  const openNotification = Boolean(anchorEl);
  const notificationPopoverId = openNotification ? "notification-popover" : undefined;
  const openHamburger = Boolean(hamburgerAnchorEl);
  const hamburgerPopoverId = openHamburger ? "hamburger-popover" : undefined;

  const navItems = [
    { label: "Home", path: "/home", customStyle: { marginLeft: "40px" } },
    { label: "Chat", path: "/ChatPage" },
    { label: "My Profile", path: "/profile" },
    { label: "About Us", path: "/about" },
    { label: "My Matches", path: "/matches" },
    { label: "Logout", path: "/login", customStyle: { marginRight: "30px" } },
  ];

  const additionalMenuItems = [
    { label: "Notifications", path: "/notifications" },
    { label: "User Settings", path: "/UserSettings" },
    { label: "View Events", path: "/ViewEvents" },
    { label: "Create Event", path: "/createevent" },
    { label: "Community Chat", path: "/CommunityChat" },
    { label: "Policy Compliance", path: "/PolicyCompliance" },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.navItems}>
        {navItems.map((item) => (
          <button
            key={item.label}
            style={{ ...styles.navButton, ...(item.customStyle || {}) }}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
        <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
          <IconButton onClick={handleNotificationIconClick} style={{ padding: 0 }}>
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsIcon style={{ color: "white" }} />
            </Badge>
          </IconButton>
          <IconButton onClick={() => navigate("/ChatPage")} style={{ padding: 0 }}>
            <ChatIcon style={{ color: "white" }} />
          </IconButton>
          <IconButton onClick={handleHamburgerClick} style={{ padding: 0 }}>
            <MenuIcon style={{ color: "white" }} />
          </IconButton>
        </div>
        <Popover
          id={notificationPopoverId}
          open={openNotification}
          anchorEl={anchorEl}
          onClose={handleCloseNotificationPopover}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
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
                    handleCloseNotificationPopover();
                    navigate("/notifications");
                  }}
                >
                  <ListItemText primary={notif} />
                </ListItem>
              ))
            )}
          </List>
        </Popover>
        <Popover
          id={hamburgerPopoverId}
          open={openHamburger}
          anchorEl={hamburgerAnchorEl}
          onClose={handleCloseHamburgerPopover}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <List>
            {additionalMenuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  handleCloseHamburgerPopover();
                  navigate(item.path);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Popover>
      </div>
    </nav>
  );
};

// CurrentMatches Component
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

// IncomingRequests Component
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

// SuggestedMatches Component
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
  const [currentMatches, setCurrentMatches] = useState([]); // Approved or pending outgoing
  const [incomingRequests, setIncomingRequests] = useState([]); // Pending from others
  const [suggestedMatches, setSuggestedMatches] = useState([]); // New potential matches
  const [notificationList, setNotificationList] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const authToken = localStorage.getItem("authToken");

  // 1) Fetch current matches
  useEffect(() => {
    if (!authToken) return;
    fetch(`${BASE_URL}/users/get-mymatchup-list/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((user) => ({
          id: user.id,
          name: user.fullname,
          age: user.age,
          interests: user.interest ? [user.interest.name] : [],
          photo: user.profile_image?.image_name || "https://via.placeholder.com/150",
          status: "approved",
        }));
        setCurrentMatches(transformed);
      })
      .catch((err) => console.error("Failed to fetch my matches:", err));
  }, [authToken]);

  // 2) Fetch incoming requests
  useEffect(() => {
    if (!authToken) return;
    fetch(`${BASE_URL}/users/get-matchup-status/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((user) => ({
          id: user.id,
          name: user.fullname,
          age: user.age,
          interests: user.interest ? [user.interest.name] : [],
          photo: user.profile_image?.image_name || "https://via.placeholder.com/150",
        }));
        setIncomingRequests(transformed);
      })
      .catch((err) => console.error("Failed to fetch incoming requests:", err));
  }, [authToken]);

  // 3) Fetch suggested matches based on user's interest
  useEffect(() => {
    if (!authToken) return;
    fetch(`${BASE_URL}/users/retrieve-interest/`, {
      headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((interestData) => {
        if (!interestData.name) {
          console.log("No user interest found. Skipping suggested matches.");
          return;
        }
        return fetch(`${BASE_URL}/users/get-recommend-matchups/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
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
          photo: user.profile_image?.image_name || "https://via.placeholder.com/150",
        }));
        setSuggestedMatches(transformed);
      })
      .catch((err) => console.error("Failed to fetch suggested matches:", err));
  }, [authToken]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChat = (id) => {
    navigate("/ChatPage");
  };

  // Send a match request
  const handleSendRequest = async (id) => {
    const match = suggestedMatches.find((m) => m.id === id);
    if (!match) return;
    try {
      const response = await fetch(`${BASE_URL}/users/request-matchup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
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
    } catch (err) {
      console.error("Error sending matchup request:", err);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // Cancel a pending request
  const handleCancelRequest = async (id) => {
    const match = currentMatches.find((m) => m.id === id && m.status === "pending");
    if (!match) return;
    try {
      const response = await fetch(`${BASE_URL}/users/deny-matchup-request/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ "requester-user-id": id }),
      });
      if (!response.ok) {
        throw new Error("Failed to cancel matchup request");
      }
      setCurrentMatches(currentMatches.filter((m) => m.id !== id));
      const message = `Match request to ${match.name} cancelled successfully.`;
      setSnackbar({ open: true, message, severity: "info" });
    } catch (err) {
      console.error("Error cancelling matchup request:", err);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // Approve an incoming request
  const handleApproveIncoming = async (id) => {
    const match = incomingRequests.find((m) => m.id === id);
    if (!match) return;
    try {
      const response = await fetch(`${BASE_URL}/users/confirm-matchup-request/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
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
    } catch (err) {
      console.error("Error confirming matchup request:", err);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // Decline an incoming request
  const handleDeclineIncoming = async (id) => {
    const match = incomingRequests.find((m) => m.id === id);
    if (!match) return;
    try {
      const response = await fetch(`${BASE_URL}/users/deny-matchup-request/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ "requester-user-id": id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to deny matchup request");
      }
      setIncomingRequests(incomingRequests.filter((m) => m.id !== id));
      const message = `${match.name}'s request declined.`;
      setSnackbar({ open: true, message, severity: "info" });
    } catch (err) {
      console.error("Error denying matchup request:", err);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // Decline a suggested match
  const handleDeclineSuggested = (id) => {
    const match = suggestedMatches.find((m) => m.id === id);
    if (!match) return;
    setSuggestedMatches(suggestedMatches.filter((m) => m.id !== id));
    const message = `${match.name} declined.`;
    setSnackbar({ open: true, message, severity: "info" });
  };

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
          <div style={styles.column}>
            <CurrentMatches
              currentMatches={currentMatches}
              handleChat={handleChat}
              handleCancelRequest={handleCancelRequest}
            />
          </div>
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
  navbar: {
    backgroundColor: "#315b7e",
    padding: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    width: "100%",
  },
  navItems: {
    display: "flex",
    alignItems: "center",
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
    color: "#ffffff",
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
    background: "#315b7e",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background 0.3s, transform 0.3s",
  },
  removeButton: {
    background: "#315b7e",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background 0.3s, transform 0.3s",
  },
  emptyText: {
    textAlign: "center",
    color: "#ffffff",
    fontStyle: "italic",
  },
};

export default MatchesPage;
