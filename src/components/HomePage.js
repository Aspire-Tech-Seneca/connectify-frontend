import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Import images directly (Option 1)
import eni from '../image/Eni.jpg';
import shailendra from '../image/shailendra.jpg';

// Load environment variables
const BLOB_STORAGE_BASE_URL = process.env.REACT_APP_BLOB_STORAGE_BASE_URL || "https://yourpublicblobstorage.com/";
const BLOB_SAS_TOKEN = process.env.REACT_APP_BLOB_SAS_TOKEN || "";

const dummyMatches = [
  {
    name: "Eni Zeqo",
    age: 25,
    interests: ["Sports", "Music", "Travel", "Technology", "Art"],
    imgUrl: eni,
  },
  {
    name: "Shailendra Kushwaha",
    age: 25,
    interests: ["Sports", "Music", "Travel", "Technology", "Art"],
    imgUrl: shailendra,
  },
];

// Navigation Bar Component – menu items centered
const NavBar = ({ navigate }) => {
  const [notifications, setNotifications] = useState([/* Add notification objects here */]);

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
        
        {/* Bell Icon with Notifications */}
        <IconButton color="inherit" component={Link} to="/notifications">
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </div>
    </nav>
  );
};

/**
 * Upload a file to Azure Blob Storage using the SAS token.
 * Returns a Promise that resolves with the public URL of the uploaded file.
 */
async function uploadFileToBlob(file) {
  const uniqueFileName = `${Date.now()}_${file.name}`;
  // Construct the upload URL: base URL + file name + SAS token
  const uploadUrl = `${BLOB_STORAGE_BASE_URL}${uniqueFileName}${BLOB_SAS_TOKEN}`;
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  // Assuming the container is public, return the URL without the SAS token
  return `${BLOB_STORAGE_BASE_URL}${uniqueFileName}`;
}

// Default export of HomePage component
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.outerContainer}>
      <NavBar navigate={navigate} />
      <div style={styles.contentWrapper}>
        <div style={styles.contentContainer}>
          <div style={styles.homePage}>
            <h1 style={styles.welcomeTitle}>Welcome to Connectify</h1>
            <p style={styles.welcomeText}>
              Find people with similar interests and make meaningful
              connections.
            </p>
            <div style={styles.matchesList}>
              {dummyMatches.map((match, index) => (
                <div key={index} style={styles.matchCard}>
                  <img
                    src={match.imgUrl}
                    alt={match.name}
                    style={styles.matchImg}
                    onError={(e) => {
                      e.target.src = `${BLOB_STORAGE_BASE_URL}defaultProfilePic.jpg`;
                    }}
                  />
                  <div style={styles.matchInfo}>
                    <h3 style={styles.matchName}>
                      {match.name}, {match.age}
                    </h3>
                    <div style={styles.interests}>
                      {match.interests.map((interest, i) => (
                        <span key={i} style={styles.interestTag}>
                          {interest}
                        </span>
                      ))}
                    </div>
                    <button style={styles.messageBtn} onClick={() => navigate("/matches#incoming-requests")}>Match</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer style={styles.footer}>
  <div style={styles.footerLinks}>
    {/* Legal and Policies */}
    <div style={styles.footerSection}>
      <h4 style={styles.footerHeading}>Legal</h4>
      <a href="/legal" style={styles.footerLink}>Legal</a>
      <a href="/privacy" style={styles.footerLink}>Privacy</a>
      <a href="/consumer-health" style={styles.footerLink}>Consumer Health Data Privacy Policy</a>
      <a href="/terms" style={styles.footerLink}>Terms</a>
      <a href="/cookie-policy" style={styles.footerLink}>Cookie Policy</a>
      <a href="/intellectual-property" style={styles.footerLink}>Intellectual Property</a>
    </div>

    {/* Careers and Tech */}
    <div style={styles.footerSection}>
      <h4 style={styles.footerHeading}>Careers</h4>
      <a href="/careers" style={styles.footerLink}>Careers</a>
      <a href="/careers-portal" style={styles.footerLink}>Careers Portal</a>
      <a href="/tech-blog" style={styles.footerLink}>Tech Blog</a>
    </div>

    {/* Social and Community */}
    <div style={styles.footerSection}>
      <h4 style={styles.footerHeading}>Social</h4>
      <a href="/social" style={styles.footerLink}>Social</a>
      <a href="/community" style={styles.footerLink}>Community</a>
    </div>

    {/* Help and Support */}
    <div style={styles.footerSection}>
      <h4 style={styles.footerHeading}>Help</h4>
      <a href="/faq" style={styles.footerLink}>FAQ</a>
      <a href="/destinations" style={styles.footerLink}>Destinations</a>
      <a href="/press-room" style={styles.footerLink}>Press Room</a>
      <a href="/contact" style={styles.footerLink}>Contact</a>
      <a href="/promo-code" style={styles.footerLink}>Promo Code</a>
    </div>
  </div>

  {/* App Download Section */}
  <div style={styles.appDownload}>
    <p style={styles.getAppText}>Get the Connectify app!</p>
    <div style={styles.downloadButtons}>
      <a href="https://apps.apple.com" style={styles.downloadButton}>
        <img src="https://via.placeholder.com/150x50" alt="Download on the App Store" style={styles.downloadImage} />
      </a>
      <a href="https://play.google.com" style={styles.downloadButton}>
        <img src="https://via.placeholder.com/150x50" alt="GET IT ON Google Play" style={styles.downloadImage} />
      </a>
    </div>
  </div>

  {/* Footer Bottom Section */}
  <div style={styles.footerBottom}>
    <p style={styles.footerText}>
      Connectify is the place to meet your next best match. Whether you're looking for love, friendship, or casual connections, Connectify brings people together. With millions of users, you're sure to find someone who shares your interests.
    </p>
    <p style={styles.footerText}>
      FAQ / Safety Tips / Terms / Cookie Policy / Privacy Settings
    </p>
    <p style={styles.footerText}>© 2025 Connectify LLC, All Rights Reserved.</p>
  </div>
</footer>
    </div>
  );
};

const styles = {
  // Outer container now takes the full viewport width
  outerContainer: {
    background: "transparent",
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    width: "100vw",
  },
  // Content wrapper remains the same for the inner content
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
  column: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
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
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  navItems: {
    display: "flex",
    gap: "20px",
  },
  navButton: {
    background: "none",
    border: "none",
    color: "white", // white text for nav links
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "color 0.3s",
    whiteSpace: "nowrap", // Prevents text wrapping
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
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
  ctaSignup: {
    background: "#C38282",
    color: "white",
    padding: "10px 20px",
    width: "20%",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background 0.3s, transform 0.3s",
  },
  matchesList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  matchCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "200px",
    textAlign: "center",
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
  footer: {
    backgroundColor: "#C38282", // Match the navbar color
    padding: "20px",
    textAlign: "center",
    borderTop: "1px solid #e9ecef",
    color: "white", // White text for footer
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
    color: "white", // White text for links
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
    margin: "5px 0",
  },
  appDownload: {
    marginBottom: "20px",
  },
  getAppText: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "white", // White text
  },
  downloadButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  downloadImage: {
    width: "150px",
    height: "50px",
  },
  footerBottom: {
    fontSize: "14px",
    color: "white", // White text
  },
  footerText: {
    margin: "5px 0",
  },
};

export default HomePage;