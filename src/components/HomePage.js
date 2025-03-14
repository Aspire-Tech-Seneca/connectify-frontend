import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Environment variables
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";
const BLOB_STORAGE_BASE_URL = process.env.REACT_APP_BLOB_STORAGE_BASE_URL || "https://yourpublicblobstorage.com/";
const BLOB_SAS_TOKEN = process.env.REACT_APP_BLOB_SAS_TOKEN || "";

// NavBar component
const NavBar = ({ navigate }) => {
  const [notifications, setNotifications] = useState([]);

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
        <IconButton color="inherit" component={Link} to="/notifications">
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </div>
    </nav>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerLinks}>
        <div style={styles.footerSection}>
          <h4 style={styles.footerHeading}>User</h4>
          <a href="/profile" style={styles.footerLink}>My Profile</a>
          <a href="/matches" style={styles.footerLink}>My Matches</a>
          <a href="/ViewEvents" style={styles.footerLink}>Events</a>
        </div>
        <div style={styles.footerSection}>
          <h4 style={styles.footerHeading}>Connect</h4>
          <a href="/ChatPage" style={styles.footerLink}>Chat</a>
          <a href="/CommunityChat" style={styles.footerLink}>Community Chat</a>
        </div>
        <div style={styles.footerSection}>
          <h4 style={styles.footerHeading}>Information</h4>
          <a href="/PolicyCompliance" style={styles.footerLink}>Policy and Compliance</a>
          <a href="/about" style={styles.footerLink}>About Us</a>
          <a href="/UserSettings" style={styles.footerLink}>Contact</a>
        </div>
      </div>
      <div style={styles.appDownload}>
        <p style={styles.getAppText}>Get the Connectify app!</p>
        <div style={styles.downloadButtons}>
          <a href="https://apps.apple.com" style={styles.downloadButton}>
            <img
              src="https://via.placeholder.com/150x50"
              alt="Download on the App Store"
              style={styles.downloadImage}
            />
          </a>
          <a href="https://play.google.com" style={styles.downloadButton}>
            <img
              src="https://via.placeholder.com/150x50"
              alt="GET IT ON Google Play"
              style={styles.downloadImage}
            />
          </a>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <p style={styles.footerText}>
          Connectify is the place to meet your next best match. Whether you're looking for love, friendship, or casual connections, Connectify brings people together.
        </p>
        <p style={styles.footerText}>
          <a href="/profile" style={styles.inlineLink}>My Profile</a> | 
          <a href="/chat" style={styles.inlineLink}>Chat</a> | 
          <a href="/CommunityChat" style={styles.inlineLink}>Community</a> | 
          <a href="/PolicyCompliance" style={styles.inlineLink}>Policy</a> | 
          <a href="/ViewEvents" style={styles.inlineLink}>Events</a> | 
          <a href="/matches" style={styles.inlineLink}>Matches</a>
        </p>
        <p style={styles.footerText}>© 2025 Connectify LLC, All Rights Reserved.</p>
      </div>
    </footer>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const [matches, setMatches] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  useEffect(() => {
    if (!authToken) return;

    fetch(`${BASE_URL}/users/retrieve-interest/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((interestData) => {
        if (!interestData.name) {
          console.log("No user interest found. Skipping match recommendations.");
          return;
        }
        return fetch(`${BASE_URL}/users/get-recommend-matchups/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
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
          imgUrl: user.profile_image?.image_url || `${BLOB_STORAGE_BASE_URL}defaultProfilePic.jpg`,
        }));
        setMatches(transformed);
      })
      .catch((err) => console.error("Failed to fetch matches:", err));
  }, [authToken]);

  const nextProfile = () => {
    setCurrentProfileIndex((prevIndex) =>
      matches.length > 0 ? (prevIndex === matches.length - 1 ? 0 : prevIndex + 1) : 0
    );
  };

  const prevProfile = () => {
    setCurrentProfileIndex((prevIndex) =>
      matches.length > 0 ? (prevIndex === 0 ? matches.length - 1 : prevIndex - 1) : 0
    );
  };

  const handleSendRequest = async (id) => {
    const match = matches.find((m) => m.id === id);
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

      setMatches(matches.filter((m) => m.id !== id));
      navigate("/matches");
    } catch (error) {
      console.error("Error sending matchup request:", error);
    }
  };

  const currentProfile = matches[currentProfileIndex];

  return (
    <div style={styles.outerContainer}>
      <NavBar navigate={navigate} />
      <div style={styles.contentWrapper}>
        <div style={styles.contentContainer}>
          <div style={styles.homePage}>
            <h1 style={styles.welcomeTitle}>Welcome to Connectify</h1>
            <p style={styles.welcomeText}>
              Find people with similar interests and make meaningful connections.
            </p>

            {matches.length === 0 ? (
              <p style={styles.welcomeText}>Loading matches...</p>
            ) : (
              <div style={styles.profileContainer}>
                <div style={styles.profileWrapper}>
                  <button 
                    style={styles.arrowButton}
                    onClick={prevProfile}
                    aria-label="Previous profile"
                  >
                    &#8249;
                  </button>
                  <div style={styles.matchCard}>
                    <img
                      src={currentProfile.imgUrl}
                      alt={currentProfile.name}
                      style={styles.matchImg}
                      onError={(e) => {
                        e.target.src = `${BLOB_STORAGE_BASE_URL}defaultProfilePic.jpg`;
                      }}
                    />
                    <div style={styles.matchInfo}>
                      <h3 style={styles.matchName}>
                        {currentProfile.name}, {currentProfile.age}
                      </h3>
                      <div style={styles.interests}>
                        {currentProfile.interests.map((interest, i) => (
                          <span key={i} style={styles.interestTag}>
                            {interest}
                          </span>
                        ))}
                      </div>
                      <div style={styles.actionButtons}>
                        <button 
                          style={styles.messageBtn}
                          onClick={() => handleSendRequest(currentProfile.id)}
                        >
                          Match
                        </button>
                        <button 
                          style={styles.messageBtn}
                          onClick={() => console.log("Unmatch functionality to be implemented")}
                        >
                          Unmatch
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    style={styles.arrowButton}
                    onClick={nextProfile}
                    aria-label="Next profile"
                  >
                    &#8250;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
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
  },
  contentContainer: {
    display: "grid",
    gap: "20px",
    alignItems: "stretch",
  },
  homePage: {
    textAlign: "center",
  },
  welcomeTitle: {
    marginBottom: "15px",
    color: "#5D4037",
  },
  welcomeText: {
    marginBottom: "20px",
    color: "#5D4037",
  },
  profileContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  profileWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    position: "relative",
  },
  arrowButton: {
    background: "rgba(195, 130, 130, 0.8)",
    color: "white",
    fontSize: "28px",
    fontWeight: "bold",
    width: "40px",
    height: "40px",
    border: "none",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background 0.3s, transform 0.3s",
    padding: "0",
    lineHeight: "1",
    zIndex: "2",
  },
  matchCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "300px",
    textAlign: "center",
    zIndex: "1",
  },
  matchImg: {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  matchInfo: {
    textAlign: "center",
  },
  matchName: {
    margin: "5px 0",
    color: "#5D4037",
  },
  interests: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "5px",
    marginBottom: "10px",
  },
  interestTag: {
    background: "#e9ecef",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
  messageBtn: {
    background: "#C38282",
    color: "white",
    padding: "8px 12px",
    border: "none",
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
  footer: {
    backgroundColor: "#C38282",
    padding: "20px",
    textAlign: "center",
    borderTop: "1px solid #e9ecef",
    color: "white",
  },
  footerLinks: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: "20px",
    marginBottom: "20px",
  },
  footerSection: {
    textAlign: "left",
  },
  footerHeading: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  footerLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
    margin: "5px 0",
  },
  inlineLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    padding: "0 8px",
  },
  appDownload: {
    marginBottom: "20px",
  },
  getAppText: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "white",
  },
  downloadButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  downloadButton: {
    display: "inline-block",
  },
  downloadImage: {
    width: "150px",
    height: "50px",
  },
  footerBottom: {
    fontSize: "14px",
    color: "white",
  },
  footerText: {
    margin: "5px 0",
  },
};

export default HomePage;