import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert, TextField, Button, Rating, Box, Typography } from "@mui/material";

// Environment variables
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";
const BLOB_STORAGE_BASE_URL = process.env.REACT_APP_BLOB_STORAGE_BASE_URL || "https://yourpublicblobstorage.com/";
const BLOB_SAS_TOKEN = process.env.REACT_APP_BLOB_SAS_TOKEN || "";

const ReviewForm = () => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [formMessage, setFormMessage] = useState({ text: "", type: "" });
  const authToken = localStorage.getItem("authToken");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      setFormMessage({ text: "Please enter a review", type: "error" });
      return;
    }
    
    if (rating === 0) {
      setFormMessage({ text: "Please select a rating", type: "error" });
      return;
    }
    
    try {
      const response = await fetch(`${BASE_URL}/users/api/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          comment: reviewText,
          rating: rating
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      
      setFormMessage({ text: "Review submitted successfully!", type: "success" });
      setReviewText("");
      setRating(0);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setFormMessage({ text: "", type: "" });
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      setFormMessage({ text: "Failed to submit review. Please try again.", type: "error" });
    }
  };
  
  return (
    <div style={styles.reviewFormContainer}>
      <h2 style={styles.reviewFormTitle}>Share Your Experience</h2>
      <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
        <div style={styles.formGroup}>
          <TextField
            label="Your Review"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            style={styles.inputField}
          />
        </div>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            marginBottom: 2 
          }}
        >
          <Typography component="legend">Rate Your Experience</Typography>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
          />
        </Box>
        <Button 
          type="submit" 
          variant="contained" 
          style={styles.submitButton}
        >
          Submit Review
        </Button>
        
        {formMessage.text && (
          <div style={{
            ...styles.formMessage,
            color: formMessage.type === "success" ? "#4caf50" : "#f44336"
          }}>
            {formMessage.text}
          </div>
        )}
      </form>
    </div>
  );
};

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/users/api/reviews/`, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
          setError(true);
        } else {
          setReviews(data);
          setError(false);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [authToken]);

  const nextSlide = () => {
    // Circular navigation for all reviews
    setCurrentIndex((prevIndex) => 
      (prevIndex + 3) % reviews.length
    );
  };

  const prevSlide = () => {
    // Circular navigation for all reviews
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - (reviews.length % 3 || 3) : prevIndex - 3
    );
  };

  // Auto-slider effect
  useEffect(() => {
    if (reviews.length > 3) {
      const interval = setInterval(nextSlide, 2000);
      return () => clearInterval(interval);
    }
  }, [reviews]);

  if (loading) {
    return (
      <div style={styles.reviewsContainer}>
        <h2 style={styles.reviewsTitle}>User Reviews</h2>
        <p style={styles.reviewText}>Loading reviews...</p>
      </div>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <div style={styles.reviewsContainer}>
        <h2 style={styles.reviewsTitle}>User Reviews</h2>
        <p style={styles.reviewText}>No user reviews available</p>
      </div>
    );
  }

  // Prepare reviews to display (3 at a time with circular navigation)
  const displayedReviews = reviews.length > 3 
    ? reviews.slice(currentIndex, currentIndex + 3).concat(
        reviews.slice(0, Math.max(0, (currentIndex + 3) - reviews.length))
      )
    : reviews;

  return (
    <div style={styles.reviewsContainer}>
      <h2 style={styles.reviewsTitle}>What Our Users Say</h2>
      
      <div style={styles.reviewSliderContainer}>
        {/* Previous Button - Always Visible */}
        <button
          style={{
            ...styles.sliderButton,
            left: '10px',
          }}
          onClick={prevSlide}
        >
          &#8249;
        </button>

        {/* Reviews Container */}
        <div style={styles.reviewsList}>
          {displayedReviews.map((review, index) => (
            <div
              key={review.id}
              style={{
                ...styles.reviewItem,
                transition: 'all 0.5s ease',
                opacity: 1,
              }}
            >
              <p style={styles.reviewText}>"{review.comment}"</p>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 1, 
                marginTop: 2 
              }}>
                <Rating 
                  name="read-only" 
                  value={review.rating} 
                  readOnly 
                  size="medium" 
                />
                <Typography variant="body2" color="text.secondary">
                  ({review.rating}/5)
                </Typography>
              </Box>
              <p style={styles.reviewAuthor}>- {review.user.fullname}</p>
            </div>
          ))}
        </div>

        {/* Next Button - Always Visible */}
        <button
          style={{
            ...styles.sliderButton,
            right: '10px',
          }}
          onClick={nextSlide}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        {/* About Connectify Section */}
        <div style={styles.aboutSection}>
          <h4 style={styles.sectionTitle}>About Connectify</h4>
          <p style={styles.aboutText}>
            Connectify is a platform designed to bring people together based on shared interests. 
            Whether you're looking for friendship, love, or just someone to chat with, Connectify 
            makes it easy to find meaningful connections.
          </p>
        </div>

        {/* Quick Links Section */}
        <div style={styles.quickLinksSection}>
          <h4 style={styles.sectionTitle}>Quick Links</h4>
          <ul style={styles.shortcutsList}>
            <li><a href="/home" style={styles.shortcutLink}>Home</a></li>
            <li><a href="/ChatPage" style={styles.shortcutLink}>Chat</a></li>
            <li><a href="/profile" style={styles.shortcutLink}>My Profile</a></li>
            <li><a href="/about" style={styles.shortcutLink}>About Us</a></li>
            <li><a href="/matches" style={styles.shortcutLink}>My Matches</a></li>
            <li><a href="/ViewEvents" style={styles.shortcutLink}>My Events</a></li>
            <li><a href="/PolicyCompliance" style={styles.shortcutLink}>Policy & Compliance</a></li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div style={styles.contactSection}>
          <h4 style={styles.sectionTitle}>Contact Us</h4>
          <div style={styles.mapContainer}>
            <iframe
              title="Connectify Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5759.76709855528!2d-79.3511667241204!3d43.79602937109577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d31babbf5ce7%3A0x5812aa25d9fb9912!2sSeneca%20Polytechnic%20Newnham%20Campus!5e0!3m2!1sen!2sca!4v1742076701886!5m2!1sen!2sca"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <p style={styles.contactText}>
            Email: John@connectify.com<br />
            Phone: +1 (123) 456-7890<br />
            Address: 1750 Finch Ave E, North York ON M2J2X5
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={styles.footerBottom}>
        <p style={styles.footerText}>© 2025 Connectify LLC, All Rights Reserved.</p>
      </div>
    </footer>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const [matches, setMatches] = useState([]);
  const [currentMatches, setCurrentMatches] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    if (!authToken) {
      // navigate("/login"); // Redirect to login if no token is found
      return;
    }

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
          imgUrl: user.profile_image?.image_name
          ? BLOB_STORAGE_BASE_URL + user.profile_image.image_name
          : "https://via.placeholder.com/150",
        }));
        setMatches(transformed);
      })
      .catch((err) => console.error("Failed to fetch matches:", err));
  }, [authToken, navigate]);

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
      setCurrentMatches((prevMatches) => [
        ...prevMatches,
        { ...match, status: "pending" },
      ]);

      setSnackbarMessage("Match request sent successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error sending matchup request:", error);
      setSnackbarMessage(error.message || "Failed to send matchup request.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const currentProfile = matches[currentProfileIndex];

  return (
    <div style={styles.outerContainer}>
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
                          disabled={currentMatches.some(match => match.id === currentProfile.id && match.status === "pending")}
                        >
                          {currentMatches.some(match => match.id === currentProfile.id && match.status === "pending") ? "Pending" : "Match"}
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
      <UserReviews />
      <ReviewForm />
      <Footer />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

const styles = {
  outerContainer: {
    marginTop: "950px",
    background: "transparent",
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    width: "100vw",
  },
  contentWrapper: {
    background: "rgba(7, 53, 102, 0.7)",
    backgroundImage: "url('./peach.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    margin: "20px auto",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    borderRadius: "8px",
    maxWidth: "1200px",
    width: "95%",
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
    color: "white",
  },
  welcomeText: {
    marginBottom: "20px",
    color: "white",
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
    background: "rgba(7, 53, 102, 0.7)",
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
    background: "rgba(7, 53, 102, 0.7)",
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
    color: "white",
  },
  interests: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "5px",
    marginBottom: "10px",
    color: "white",
  },
  interestTag: {
    background: "rgba(7, 53, 102, 0.7)",
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
    background: "rgba(7, 53, 102, 0.7)",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background 0.3s, transform 0.3s",
  },
  reviewsContainer: {
    background: "rgba(7, 53, 102, 0.7)",
    padding: "40px 20px",
    textAlign: "center",
    position: "relative",
  },
  reviewSliderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  reviewsList: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    width: "100%",
    overflow: "hidden",
  },
  reviewItem: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "300px",
    textAlign: "center",
    flex: "0 0 auto",
  },
  sliderButton: {
    background: "rgba(7, 53, 102, 0.7)",
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
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
  },
  reviewsTitle: {
    color: "white",
    marginBottom: "20px",
  },
  reviewText: {
    color: "#333",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  reviewAuthor: {
    color: "#666",
    fontStyle: "italic",
    marginTop: "10px",
  },
  // Review Form Styles
  reviewFormContainer: {
    padding: "40px 20px",
    maxWidth: "450px",
    margin: "20px auto",
    borderRadius: "20px",
  },
  reviewFormTitle: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "white",
    textAlign: "center",
  },
  reviewForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    width: "100%",
  },
  inputField: {
    background: "#fff",
  },
  submitButton: {
    background: "rgba(7, 53, 102, 0.7)",
    color: "white",
    padding: "10px 20px",
    alignSelf: "center",
    fontWeight: "bold",
    "&:hover": {
      background: "rgba(7, 53, 102, 0.7)",
    },
  },
  formMessage: {
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "bold",
  },
  footer: {
    background: "rgba(7, 53, 102, 0.7)",
    padding: "40px 20px",
    color: "white",
  },
  footerContent: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
    gap: "40px",
    flexWrap: "wrap",
    textAlign: "justify",
  },
  aboutSection: {
    flex: 1,
    minWidth: "250px",
  },
  quickLinksSection: {
    flex: 1,
    minWidth: "150px",
    textAlign: "center",
  },
  contactSection: {
    flex: 1,
    minWidth: "250px",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "20px",
  },
  aboutText: {
    fontSize: "14px",
    lineHeight: "1.6",
  },
  shortcutsList: {
    listStyle: "none",
    padding: "0",
  },
  shortcutLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
    margin: "10px 0",
  },
  mapContainer: {
    marginBottom: "20px",
  },
  contactText: {
    fontSize: "14px",
    lineHeight: "1.6",
  },
  footerBottom: {
    textAlign: "center",
    marginTop: "40px",
  },
  footerText: {
    fontSize: "14px",
  },
};

export default HomePage;