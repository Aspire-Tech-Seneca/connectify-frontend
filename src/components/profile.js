// src/components/Profile.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API base URL and Blob Storage base URL
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
const BLOB_STORAGE_BASE_URL =
  process.env.REACT_APP_BLOB_STORAGE_BASE_URL || "http://localhost:8000/";

// ProfileCard component (your own profile info)
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

// Gallery component
const Gallery = ({ galleryImages, handleGalleryImageUpload, removeGalleryImage }) => {
  const fileInputRef = useRef(null);
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={styles.gallerySection}>
      <h2 style={styles.sectionTitle}>My Gallery</h2>
      <div style={styles.galleryControls}>
        <button style={styles.editButton} onClick={onButtonClick}>
          Choose Files
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleGalleryImageUpload}
          style={{ display: "none" }}
        />
      </div>
      <div style={styles.galleryGrid}>
        {galleryImages.length === 0 ? (
          <p style={styles.emptyGalleryText}>No media added yet.</p>
        ) : (
          galleryImages.map((image) => {
            const key = image.filename || image.tempId || image.id;
            return (
              <div key={key} style={styles.galleryItem}>
                <img
                  src={image.url}
                  alt={`Gallery ${key}`}
                  style={styles.galleryImage}
                />
                <button
                  style={styles.deleteButton}
                  onClick={() => removeGalleryImage(key)}
                >
                  X
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// CurrentMatches component – includes navigation to user profile page
const CurrentMatches = ({ currentMatches, handleChat, handleCancelRequest, navigate }) => {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Current Matches</h2>
      {currentMatches.length === 0 ? (
        <p style={styles.emptyText}>No current matches.</p>
      ) : (
        currentMatches.map((match) => (
          <div key={match.id} style={styles.matchedUserCard}>
            <div
              style={styles.matchContent}
              onClick={() => navigate(`/user-profile/${match.id}`)}
            >
              <img
                src={match.photo}
                alt={match.name}
                style={styles.matchPhoto}
              />
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
              <button
                onClick={() => navigate(`/user-profile/${match.id}`)}
                style={styles.matchButton}
              >
                View Profile
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Main Profile component (your own profile view)
const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Eni Zeqo");
  const [bio, setBio] = useState("I am new in Canada and I want to make more friends...");
  const [age, setAge] = useState(25);
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState(`${BLOB_STORAGE_BASE_URL}defaultProfilePic.jpg`);
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

  // 3) Retrieve profile and gallery images
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
        if (data.gallery_images && Array.isArray(data.gallery_images)) {
          setGalleryImages(
            data.gallery_images.map((filename) => ({
              filename,
              url: `${BLOB_STORAGE_BASE_URL}${filename}`,
            }))
          );
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

  // 5) Fetch current matches with constructed photo URLs
  useEffect(() => {
    if (!authToken) return;
    fetch(`${BASE_URL}/users/get-mymatchup-list/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((user) => {
          let photoUrl = "https://via.placeholder.com/150";
          if (user.profile_image) {
            if (typeof user.profile_image === "object" && user.profile_image.image_name) {
              photoUrl = `${BLOB_STORAGE_BASE_URL}${user.profile_image.image_name}`;
            } else if (typeof user.profile_image === "string") {
              photoUrl = `${BLOB_STORAGE_BASE_URL}${user.profile_image}`;
            }
          }
          return {
            id: user.id,
            name: user.fullname,
            age: user.age,
            interests: user.interest ? [user.interest.name] : [],
            photo: photoUrl,
            status: "approved",
          };
        });
        setCurrentMatches(transformed);
      })
      .catch((err) => console.error("Failed to fetch current matches:", err));
  }, [authToken]);

  // Profile picture upload
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

  // Gallery image upload
  const handleGalleryImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const localPreviews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const localUrl = URL.createObjectURL(file);
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      localPreviews.push({ tempId, url: localUrl });
    }
    setGalleryImages((prev) => [...prev, ...localPreviews]);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("gallery_images", files[i]);
      }
      const response = await fetch(`${BASE_URL}/users/upload-profile-image/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Gallery image upload failed");
      }
      const newResponse = await fetch(`${BASE_URL}/users/retrieve-profile-image/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const newData = await newResponse.json();
      if (newData.gallery_images && Array.isArray(newData.gallery_images)) {
        setGalleryImages(
          newData.gallery_images.map((filename) => ({
            filename,
            url: `${BLOB_STORAGE_BASE_URL}${filename}`,
          }))
        );
      }
    } catch (error) {
      console.error("Error uploading gallery image:", error);
    }
  };

  // Remove gallery image
  const removeGalleryImage = async (key) => {
    if (key.startsWith("temp-")) {
      setGalleryImages((prev) =>
        prev.filter((img) => (img.filename || img.tempId) !== key)
      );
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/users/delete-gallery-image/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ image: key }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete gallery image");
      }
      setGalleryImages((prev) => prev.filter((img) => img.filename !== key));
    } catch (err) {
      console.error("Error deleting gallery image:", err);
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    const payload = { bio, location };
    try {
      const response = await fetch(`${BASE_URL}/users/update/`, {
        method: "PATCH",
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
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Chat and Cancel Request
  const handleChat = (id) => {
    navigate("/ChatPage");
  };

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

  return (
    <div style={styles.outerContainer}>
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
              navigate={navigate}
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
    fontWeight: "bold",
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
    textAlign: "center",
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
    cursor: "pointer",
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
