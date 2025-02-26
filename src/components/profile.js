import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Navigation Bar Component – menu items centered
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

// Profile Card Component
const ProfileCard = ({
  profilePic,
  isEditing,
  name,
  age,
  bio,
  setName,
  setAge,
  setBio,
  setIsEditing,
  handleProfilePicChange,
  hiddenFileInputRef,
}) => (
  <div style={styles.profileCard}>
    <div style={styles.profileContent}>
      {/* Profile picture on the left */}
      <div style={styles.profilePicContainer}>
        <img src={profilePic} alt="Profile" style={styles.fixedProfilePic} />
      </div>
      <div style={styles.profileInfo}>
        {isEditing ? (
          <div style={styles.editContainer}>
            <label style={styles.uploadLabel}>
              Change Profile Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                style={styles.hiddenFileInput}
                ref={hiddenFileInputRef}
              />
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Name"
            />
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={styles.input}
              placeholder="Age"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={styles.textarea}
              placeholder="Bio"
            />
            <button onClick={() => setIsEditing(false)} style={styles.editButton}>
              Save Profile
            </button>
          </div>
        ) : (
          <div>
            <h3 style={styles.profileName}>{name}</h3>
            <p style={styles.profileDetail}>
              <strong>Age:</strong> {age}
            </p>
            <p style={styles.profileDetail}>
              <strong>Bio:</strong> {bio}
            </p>
            <button onClick={() => setIsEditing(true)} style={styles.editButton}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Gallery Component
const Gallery = ({ galleryImages, handleGalleryImageUpload, removeGalleryImage }) => (
  <div style={styles.gallerySection}>
    <h2 style={styles.sectionTitle}>My Gallery</h2>
    <div style={styles.galleryControls}>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleGalleryImageUpload}
        style={styles.fileInput}
      />
    </div>
    <div style={styles.galleryGrid}>
      {galleryImages.length === 0 ? (
        <p style={styles.emptyGalleryText}>No media added yet.</p>
      ) : (
        galleryImages.map((image) => (
          <div key={image.id} style={styles.galleryItem}>
            <img
              src={image.url}
              alt={`Gallery ${image.id}`}
              style={styles.galleryImage}
            />
            <button
              style={styles.deleteButton}
              onClick={() => removeGalleryImage(image.id)}
            >
              X
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);

// Matches Component
const Matches = ({ suggestedMatches, handleApproveMatch }) => (
  <div>
    <h2 style={styles.sectionTitle}>Suggested Matches</h2>
    {suggestedMatches.map((match) => (
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
              Interests: {match.interests.join(", ")}
            </p>
          </div>
        </div>
        <div style={styles.buttonRow}>
          <button onClick={() => handleApproveMatch(match.id)} style={styles.removeButton}>
            ❌ Remove
          </button>
          <button onClick={() => handleApproveMatch(match.id)} style={styles.matchButton}>
            ✅ Match
          </button>
        </div>
      </div>
    ))}
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Eni Zeqo");
  const [bio, setBio] = useState(
    "I am new in Canada and I want to make more friends that have the same interests as me"
  );
  const [age, setAge] = useState(25);
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");
  const [isEditing, setIsEditing] = useState(false);
  const [suggestedMatches, setSuggestedMatches] = useState([
    { id: 1, name: "Sofia Martinez", age: 24, interests: ["Tech", "Books"], photo: "https://via.placeholder.com/150" },
    { id: 2, name: "Alex Johnson", age: 26, interests: ["Volleyball", "Music"], photo: "https://via.placeholder.com/150" },
    { id: 3, name: "Daniel Kim", age: 25, interests: ["Gaming", "Books"], photo: "https://via.placeholder.com/150" },
    { id: 4, name: "Lina Roberts", age: 22, interests: ["Art", "Tech"], photo: "https://via.placeholder.com/150" },
    { id: 5, name: "George Evans", age: 28, interests: ["Fitness", "Books"], photo: "https://via.placeholder.com/150" },
  ]);
  const [galleryImages, setGalleryImages] = useState([]);
  const profilePicInputRef = useRef(null);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleGalleryImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setGalleryImages((prev) => [...prev, { id: Date.now(), url: imageUrl }]);
    }
  };

  const removeGalleryImage = (id) =>
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));

  const handleApproveMatch = (id) => {
    setSuggestedMatches((prev) => {
      const updated = prev.filter((match) => match.id !== id);
      const newMatch = {
        id: Date.now(),
        name: "New Match",
        age: 27,
        interests: ["Photography", "Movies"],
        photo: "https://via.placeholder.com/150",
      };
      return [...updated, newMatch].slice(0, 5);
    });
  };

  return (
    <div style={styles.outerContainer}>
      <NavBar navigate={navigate} />
      <div style={styles.contentWrapper}>
        <div style={styles.contentContainer}>
          {/* Left Column: Profile Info & Gallery */}
          <div style={styles.column}>
            <h2 style={styles.sectionTitle}>My Profile</h2>
            <ProfileCard
              profilePic={profilePic}
              isEditing={isEditing}
              name={name}
              age={age}
              bio={bio}
              setName={setName}
              setAge={setAge}
              setBio={setBio}
              setIsEditing={setIsEditing}
              handleProfilePicChange={handleProfilePicChange}
              hiddenFileInputRef={profilePicInputRef}
            />
            <Gallery
              galleryImages={galleryImages}
              handleGalleryImageUpload={handleGalleryImageUpload}
              removeGalleryImage={removeGalleryImage}
            />
          </div>
          {/* Right Column: Suggested Matches */}
          <div style={styles.column}>
            <Matches suggestedMatches={suggestedMatches} handleApproveMatch={handleApproveMatch} />
          </div>
        </div>
      </div>
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
  profileCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    marginBottom: "20px",
  },
  profileContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
  },
  profilePicContainer: {
    width: "150px",
    height: "150px",
    overflow: "hidden",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  fixedProfilePic: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  hiddenFileInput: {
    display: "none",
  },
  uploadLabel: {
    background: "#8B4513",
    color: "white",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "inline-block",
    marginBottom: "10px",
  },
  fileInput: {
    margin: "10px 0",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  editButton: {
    background: "#C38282",
    color: "white",
    padding: "10px 15px",
    border: "none",
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
  profileInfo: {
    textAlign: "left",
    flex: 1,
  },
  profileName: {
    margin: "5px 0",
  },
  profileDetail: {
    margin: "5px 0",
  },
  gallerySection: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    marginTop: "20px",
  },
  galleryControls: {
    marginBottom: "10px",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "10px",
  },
  emptyGalleryText: {
    textAlign: "center",
    color: "#A0522D",
    fontStyle: "italic",
  },
  galleryItem: {
    position: "relative",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  deleteButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "rgba(255, 0, 0, 0.7)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    fontSize: "14px",
    lineHeight: "24px",
    textAlign: "center",
    padding: 0,
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
  // Updated NavBar style to match the MyMatches page (full width)
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
    color: "white", // white text for nav links
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "color 0.3s",
    whiteSpace: "nowrap",
  },
};

export default Profile;
