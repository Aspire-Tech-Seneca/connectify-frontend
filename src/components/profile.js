import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
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

// Adjust to your actual backend URLs
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

// Points to your Azure Blob Storage endpoint
const BLOB_STORAGE_BASE_URL =
  process.env.REACT_APP_BLOB_STORAGE_BASE_URL || "https://yourpublicblobstorage.com/";
// SAS token for write access
const BLOB_SAS_TOKEN = process.env.REACT_APP_BLOB_SAS_TOKEN || "";

// Container names for direct Azure blob uploads (used during upload only)
const PROFILE_IMAGES_CONTAINER = "profile_images/";
const GALLERY_IMAGES_CONTAINER = "gallery_images/";

/**
 * (Optional) Helper function to upload files directly to Azure Blob.
 * Not used for gallery uploads in the updated approach.
 */
async function uploadFileToBlob(file, containerName) {
  const uniqueFileName = `${Date.now()}_${file.name}`;
  const uploadUrl = `${BLOB_STORAGE_BASE_URL}${containerName}${uniqueFileName}${
    BLOB_SAS_TOKEN.startsWith("?") ? BLOB_SAS_TOKEN : `?${BLOB_SAS_TOKEN}`
  }`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Upload to Blob failed");
  }

  return `${BLOB_STORAGE_BASE_URL}${containerName}${uniqueFileName}`;
}

// NavBar Component with hamburger and other icons
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

  // Additional pages for hamburger menu
  const additionalMenuItems = [
    { label: "Notifications", path: "/Notifications" },
    { label: "User Settings", path: "/UserSettings" },
    { label: "View Events", path: "/ViewEvents" },
    { label: "Create Event", path: "/CreateEvent" },
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

        {/* Icons grouped with minimal spacing */}
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

const ProfileCard = ({
  profilePic,
  isEditing,
  name,
  age,
  bio,
  location,
  categories,
  availableCategories,
  setName,
  setAge,
  setBio,
  setLocation,
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
          <div>
            <button
              style={styles.uploadLabel}
              onClick={() =>
                hiddenFileInputRef.current && hiddenFileInputRef.current.click()
              }
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
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
              placeholder="Location"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={styles.textarea}
              placeholder="Bio"
            />
            <div style={styles.categoriesContainer}>
              <p style={styles.categoryTitle}>Choose The interest (max 1):</p>
              <div style={styles.radioGroup}>
                {availableCategories.map((cat) => (
                  <label key={cat.value} style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="interest"
                      value={cat.value}
                      checked={categories[0] === cat.value}
                      onChange={() => setCategories([cat.value])}
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
              <strong>Location:</strong> {location || "Not set"}
            </p>
            <p style={styles.profileDetail}>
              <strong>Bio:</strong> {bio}
            </p>
            <p style={styles.profileDetail}>
              <strong>Categories:</strong>{" "}
              {categories.length ? categories.join(", ") : "None selected"}
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

/* 
  Gallery Component: 
  – We update this to use "filename" (returned by the backend) as the key.
  – The upload handler now calls the API endpoint with a FormData containing "gallery_images"
  – After upload, we retrieve the updated list from the backend.
*/
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
          <div key={image.id}>
          <img src={image.url} alt="Gallery item" />
        </div>
        ))
      )}
    </div>
  </div>
);

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

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Eni Zeqo");
  const [bio, setBio] = useState("I am new in Canada and I want to make more friends...");
  const [age, setAge] = useState(25);
  const [location, setLocation] = useState("");

  const [profilePic, setProfilePic] = useState(
    `${BLOB_STORAGE_BASE_URL}defaultProfilePic.jpg`
  );

  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentMatches, setCurrentMatches] = useState([]);
  const profilePicInputRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const notificationCount = notifications.length;
  const authToken = localStorage.getItem("authToken");

  // 1) Fetch available interests
  useEffect(() => {
    fetch(`${BASE_URL}/users/get-interest-list/`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) {
          setAvailableCategories(data);
        }
      })
      .catch((err) => console.error("Error fetching interest list:", err));
  }, []);

  // 2) Fetch user info (including gallery images and location)
  useEffect(() => {
    fetch(`${BASE_URL}/users/get-user-info/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.fullname || name);
        setAge(data.age || age);
        setBio(data.bio || bio);
        setLocation(data.location || "");

        if (data.gallery_images) {
          // Map returned filenames into objects with "filename" and "url"
          setGalleryImages(
            data.gallery_images.map((filename) => ({
              filename,
              url: `${BLOB_STORAGE_BASE_URL}${filename}`,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching profile details:", err));
  }, [authToken]);

  // 3) Retrieve profile image
  useEffect(() => {
    fetch(`${BASE_URL}/users/retrieve-profile-image/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profile_image) {
          setProfilePic(`${BLOB_STORAGE_BASE_URL}${data.profile_image}`);
        }
      })
      .catch((err) => console.error("Error retrieving profile image:", err));
  }, [authToken]);

  // 4) Retrieve user's interest
  useEffect(() => {
    fetch(`${BASE_URL}/users/retrieve-interest/`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setCategories([data.name]);
        }
      })
      .catch((err) => console.error("Error retrieving interest:", err));
  }, [authToken]);

  // 5) Fetch current matches (approved or pending outgoing)
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
          photo: user.profile_image?.image_url || "https://via.placeholder.com/150",
          status: "approved",
        }));
        setCurrentMatches(transformed);
      })
      .catch((err) => console.error("Failed to fetch current matches:", err));
  }, [authToken]);

  // Handle profile picture upload (already working)
  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("profile_image", file);

        const response = await fetch(`${BASE_URL}/users/upload-profile-image/`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Profile image upload failed");
        }
        const newResponse = await fetch(`${BASE_URL}/users/retrieve-profile-image/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const newData = await newResponse.json();
        if (newData.profile_image) {
          setProfilePic(`${BLOB_STORAGE_BASE_URL}${newData.profile_image}`);
        }
      } catch (error) {
        console.error("Profile image upload failed:", error);
      }
    }
  };

  // Handle gallery upload using the API endpoint
  const handleGalleryImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    try {
      const uploadedUrl = await uploadFileToBlob(file, GALLERY_IMAGES_CONTAINER);
      setGalleryImages((prev) => [
        ...prev,
        {
          // local unique id for React
          id: Date.now() + Math.random(),
          url: uploadedUrl,
        },
      ]);
    } catch (error) {
      console.error("Gallery image upload failed:", error);
    }
  };
  

  // Remove gallery image by filename (calls delete endpoint)
  const removeGalleryImage = async (filename) => {
    try {
      const response = await fetch(`${BASE_URL}/users/delete-gallery-image/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ image: filename }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete gallery image");
      }
      setGalleryImages((prev) => prev.filter((img) => img.filename !== filename));
    } catch (err) {
      console.error("Error deleting gallery image:", err);
    }
  };

  // Handler to navigate to ChatPage
  const handleChat = (id) => {
    navigate("/ChatPage");
  };

  // Handler to cancel a pending request
  const handleCancelRequest = async (id) => {
    const match = currentMatches.find((m) => m.id === id && m.status === "pending");
    if (!match) return;
    try {
      const response = await fetch(`${BASE_URL}/users/deny-matchup-request/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ "requester-user-id": id }),
      });
      if (!response.ok) {
        throw new Error("Failed to cancel matchup request");
      }
      setCurrentMatches(currentMatches.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error cancelling matchup request:", err);
    }
  };

  // Save profile (for bio, location, and interest updates)
  const handleSaveProfile = async () => {
    const payload = { bio, location };
    try {
      const response = await fetch(`${BASE_URL}/users/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
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
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <NavBar navigate={navigate} notificationCount={notificationCount} notifications={[]} />
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
              location={location}
              categories={categories}
              availableCategories={availableCategories}
              setName={setName}
              setAge={setAge}
              setBio={setBio}
              setLocation={setLocation}
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
            <CurrentMatches
              currentMatches={currentMatches}
              handleChat={handleChat}
              handleCancelRequest={handleCancelRequest}
            />
          </div>
        </div>
      </div>
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
    background: "#315b7e",
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
    background: "#315b7e",
    color: "white",
    padding: "10px 15px",
    border: "none",
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
    color: "#315b7e",
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
  emptyText: {
    textAlign: "center",
    color: "#ffffff",
    fontStyle: "italic",
  },
};

export default Profile;
