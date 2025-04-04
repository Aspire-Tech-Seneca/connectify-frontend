import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";
const BLOB_STORAGE_BASE_URL =
  process.env.REACT_APP_BLOB_STORAGE_BASE_URL || "http://127.0.0.1:8000/";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // for modal

  useEffect(() => {
    fetch(`${BASE_URL}/users/get-user-profile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        if (data.gallery_images && Array.isArray(data.gallery_images)) {
          setGalleryImages(
            data.gallery_images.map((filename) => ({
              filename,
              url: `${BLOB_STORAGE_BASE_URL}${filename}`,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching user profile:", err));
  }, [userId]);

  if (!userData) {
    return <div style={styles.loadingText}>Loading...</div>;
  }

  return (
    <div style={styles.outerContainer}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        &larr; Back
      </button>

      <div style={styles.profileCard}>
        <div style={styles.profileContent}>
          <div style={styles.profilePicContainer}>
            <img
              src={`${BLOB_STORAGE_BASE_URL}${
                userData.profile_image?.image_name || "defaultProfilePic.jpg"
              }`}
              alt="Profile"
              style={styles.fixedProfilePic}
              onError={(e) => {
                e.target.src = `${BLOB_STORAGE_BASE_URL}defaultProfilePic.jpg`;
              }}
            />
          </div>
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{userData.fullname}</h2>
            <p style={styles.profileDetail}>
              <strong>Age:</strong> {userData.age}
            </p>
            <p style={styles.profileDetail}>
              <strong>Location:</strong> {userData.location || "Not set"}
            </p>
            <p style={styles.profileDetail}>
              <strong>Bio:</strong> {userData.bio || "No bio available."}
            </p>
            <p style={styles.profileDetail}>
              <strong>Interests:</strong>{" "}
              {userData.interest ? userData.interest.name : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div style={styles.gallerySection}>
        <h2 style={styles.sectionTitle}>Gallery</h2>
        <div style={styles.galleryGrid}>
          {galleryImages.length === 0 ? (
            <p style={styles.noImagesText}>No gallery images.</p>
          ) : (
            galleryImages.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Gallery ${index}`}
                style={styles.galleryImage}
                onClick={() => setSelectedImage(image.url)}
                onError={(e) => {
                  e.target.src = `${BLOB_STORAGE_BASE_URL}defaultGalleryPic.jpg`;
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div style={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Enlarged" style={styles.modalImage} />
            <button style={styles.closeButton} onClick={() => setSelectedImage(null)}>
              &times; {/* black “×” now */}
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  outerContainer: {
    // Use your beach background image; adjust the path accordingly
    background: "url('./beach.jpg') no-repeat center center/cover",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "'Roboto', sans-serif",
  },
  loadingText: {
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
    marginTop: "50px",
    fontSize: "1.2rem",
    color: "#444",
  },
  backButton: {
    marginBottom: "20px",
    padding: "8px 16px",
    background: "#315b7e",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  profileCard: {
    maxWidth: "800px",
    margin: "0 auto 20px auto",
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  profileContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
  },
  profilePicContainer: {
    width: "160px",
    height: "160px",
    overflow: "hidden",
    borderRadius: "12px",
    flexShrink: 0,
  },
  fixedProfilePic: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  profileInfo: {
    flex: 1,
    textAlign: "left",
  },
  profileName: {
    margin: "0 0 10px 0",
    fontSize: "1.5rem",
    color: "#333",
  },
  profileDetail: {
    margin: "5px 0",
    fontSize: "1rem",
    color: "#555",
  },
  gallerySection: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  sectionTitle: {
    marginBottom: "15px",
    textAlign: "center",
    fontSize: "1.4rem",
    color: "#333",
  },
  noImagesText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", // fixed size for grid items
    gap: "15px",
  },
  galleryImage: {
    width: "150px", // fixed width
    height: "150px", // fixed height
    borderRadius: "8px",
    objectFit: "cover",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    position: "relative",
    maxWidth: "90%",
    maxHeight: "90%",
  },
  modalImage: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  closeButton: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    background: "#fff",       // White background
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    fontSize: "20px",
    color: "#000",            // Black text
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default UserProfile;
