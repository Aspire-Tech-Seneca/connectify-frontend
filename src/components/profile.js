import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Badge, Popover, List, ListItem, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Load environment variables (ensure these are correctly set in your environment)
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";
const BLOB_STORAGE_BASE_URL = process.env.REACT_APP_BLOB_STORAGE_BASE_URL || "https://yourpublicblobstorage.com/";
const BLOB_SAS_TOKEN = process.env.REACT_APP_BLOB_SAS_TOKEN || "";

/**
 * Upload a file to Azure Blob Storage using the SAS token.
 * Returns a Promise that resolves with the public URL of the uploaded file.
 */
async function uploadFileToBlob(file) {
  const uniqueFileName = `${Date.now()}_${file.name}`;
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
    throw new Error("Gallery upload failed");
  }
  return `${BLOB_STORAGE_BASE_URL}${uniqueFileName}`;
}

// NavBar Component with Notification Icon and Popover
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

  return (
    <nav style={styles.navbar}>
      <div style={styles.navItems}>
        {[
          { label: "Home", path: "/home" },
          { label: "Chat", path: "/ChatPage" },
          { label: "My Profile", path: "/profile" },
          { label: "About Us", path: "/about" },
          { label: "My Matches", path: "/matches" },
          { label: "Logout", path: "/login" },
        ].map((item) => (
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

// ProfileCard Component
const ProfileCard = ({
  profilePic,
  isEditing,
  name,
  age,
  bio,
  categories,
  availableCategories,
  setName,
  setAge,
  setBio,
  setCategories,
  setIsEditing,
  handleProfilePicChange,
  hiddenFileInputRef,
  handleSaveProfile,
}) => (
  <div style={styles.profileCard}>
    <div style={styles.profileContent}>
      <div style={styles.profilePicContainer}>
        <img
          src={profilePic || `${BLOB_STORAGE_BASE_URL}defaultProfilePic.jpg`}
          alt="Profile"
          style={styles.fixedProfilePic}
        />
      </div>
      <div style={styles.profileInfo}>
        {isEditing ? (
          <div style={styles.editContainer}>
            {/* Trigger file input */}
            <button
              style={styles.uploadLabel}
              onClick={() => {
                if (hiddenFileInputRef.current) {
                  hiddenFileInputRef.current.click();
                }
              }}
            >
              Change Profile Picture
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
              ref={hiddenFileInputRef}
            />
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
            <div style={styles.categoriesContainer}>
              <p style={styles.categoryTitle}>Choose Categories (max 3):</p>
              <div style={styles.checkboxGroup}>
                {availableCategories.map((cat) => (
                  <label key={cat.value} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={categories.includes(cat.value)}
                      disabled={
                        !categories.includes(cat.value) && categories.length >= 3
                      }
                      onChange={() => {
                        if (categories.includes(cat.value)) {
                          setCategories(categories.filter((c) => c !== cat.value));
                        } else if (categories.length < 3) {
                          setCategories([...categories, cat.value]);
                        }
                      }}
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>
            <button onClick={handleSaveProfile} style={styles.editButton}>
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
            <p style={styles.profileDetail}>
              <strong>Categories:</strong>{" "}
              {categories.length ? categories.join(", ") : "None selected"}
            </p>
            <button
              onClick={() => {
                console.log("Editing mode enabled");
                setIsEditing(true);
              }}
              style={styles.editButton}
            >
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
const Matches = ({ suggestedMatches, handleApproveMatch }) => {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Suggested Matches</h2>
      {suggestedMatches.length === 0 ? (
        <p style={styles.emptyGalleryText}>No suggested matches available.</p>
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

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Eni Zeqo");
  const [bio, setBio] = useState("I am new in Canada and I want to make more friends that have the same interests as me");
  const [age, setAge] = useState(25);
  const [profilePic, setProfilePic] = useState(`${BLOB_STORAGE_BASE_URL}defaultProfilePic.jpg`);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const profilePicInputRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const notificationCount = notifications.length;

  // Use authToken instead of token
  const authToken = localStorage.getItem("authToken");

  // Fetch available interests
  useEffect(() => {
    fetch(`${BASE_URL}/users/get-interest-list/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length) {
          setAvailableCategories(data);
        } else {
          setAvailableCategories([
            { value: "sports", label: "Sports" },
            { value: "music", label: "Music" },
            { value: "tech", label: "Technology" },
            { value: "art", label: "Art" },
            { value: "travel", label: "Travel" },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error fetching interest list:", error);
        setAvailableCategories([
          { value: "sports", label: "Sports" },
          { value: "music", label: "Music" },
          { value: "tech", label: "Technology" },
          { value: "art", label: "Art" },
          { value: "travel", label: "Travel" },
        ]);
      });
  }, []);

  // Fetch profile details using the new endpoint /users/get-user-info/
  useEffect(() => {
    fetch(`${BASE_URL}/users/get-user-info/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setName(data.fullname || name);
        setAge(data.age || age);
        setBio(data.bio || bio);
        if (data.gallery_images) {
          setGalleryImages(data.gallery_images.map((url, index) => ({ id: index, url })));
        }
      })
      .catch((err) => console.error("Error fetching profile details:", err));
  }, [authToken]);

  // Retrieve profile image (expecting "profile_image_name")
  useEffect(() => {
    fetch(`${BASE_URL}/users/retrieve-profile-image/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.profile_image_name) {
          setProfilePic(`${BLOB_STORAGE_BASE_URL}${data.profile_image_name}`);
        } else {
          console.warn("No profile_image_name in response");
        }
      })
      .catch((err) => console.error("Error retrieving profile image:", err));
  }, [authToken]);

  // Retrieve user's interest
  useEffect(() => {
    fetch(`${BASE_URL}/users/retrieve-interest/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.interest) {
          setCategories([data.interest]);
        }
      })
      .catch((err) => console.error("Error retrieving interest:", err));
  }, [authToken]);

  // Fetch suggested matches based on the first interest
  useEffect(() => {
    if (categories.length > 0) {
      fetch(`${BASE_URL}/users/get-recommend-matchups/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest: categories[0] }),
      })
        .then((response) => response.json())
        .then((data) => setSuggestedMatches(data))
        .catch((error) => console.error("Error fetching suggested matches:", error));
    }
  }, [categories]);

  // Update profile picture using backend endpoint.
  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await fetch(`${BASE_URL}/users/upload-profile-image/`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: (() => {
            const formData = new FormData();
            formData.append("profile_image", file);
            return formData;
          })(),
        });
        if (!response.ok) {
          throw new Error("Profile image upload failed");
        }
        const data = await response.json();
        if (data.profile_image_name) {
          setProfilePic(`${BLOB_STORAGE_BASE_URL}${data.profile_image_name}`);
        }
      } catch (error) {
        console.error("Profile image upload failed:", error);
      }
    }
  };

  // Upload gallery image using direct Azure Blob Storage upload.
  const handleGalleryImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const uploadedUrl = await uploadFileToBlob(file);
        setGalleryImages((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), url: uploadedUrl },
        ]);
      } catch (error) {
        console.error("Gallery image upload failed:", error);
      }
    }
  };

  const removeGalleryImage = (id) =>
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));

  const handleApproveMatch = (id) => {
    setSuggestedMatches((prev) => prev.filter((match) => match.id !== id));
  };

  // Save profile details and update interest
  const handleSaveProfile = async () => {
    const payload = {
      fullname: name,
      age: age,
      bio: bio,
      profile_image: profilePic,
      gallery_images: galleryImages.map((image) => image.url),
    };

    try {
      const response = await fetch(`${BASE_URL}/users/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Profile update failed");
      }
      if (categories.length > 0) {
        const interestResponse = await fetch(`${BASE_URL}/users/update-interest/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ interest: categories[0] }),
        });
        if (!interestResponse.ok) {
          throw new Error("Interest update failed");
        }
      }
      console.log("Profile saved successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <NavBar
        navigate={navigate}
        notificationCount={notificationCount}
        notifications={notifications}
      />
      <div style={styles.contentWrapper}>
        <div style={styles.contentContainer}>
          <div style={styles.column}>
            <h2 style={styles.sectionTitle}>My Profile</h2>
            <ProfileCard
              profilePic={profilePic}
              isEditing={isEditing}
              name={name}
              age={age}
              bio={bio}
              categories={categories}
              availableCategories={availableCategories}
              setName={setName}
              setAge={setAge}
              setBio={setBio}
              setCategories={setCategories}
              setIsEditing={setIsEditing}
              handleProfilePicChange={handleProfilePicChange}
              hiddenFileInputRef={profilePicInputRef}
              handleSaveProfile={handleSaveProfile}
            />
            <Gallery
              galleryImages={galleryImages}
              handleGalleryImageUpload={handleGalleryImageUpload}
              removeGalleryImage={removeGalleryImage}
            />
          </div>
          <div style={styles.column}>
            <Matches
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
  uploadLabel: {
    background: "#8B4513",
    color: "white",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "inline-block",
    marginBottom: "10px",
    border: "none",
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

export default Profile;
