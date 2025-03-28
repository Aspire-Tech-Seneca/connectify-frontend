import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Rating } from "@mui/material";
import { styled } from "@mui/material/styles";

// Same BASE_URL and token retrieval as HomePage
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";
const authToken = localStorage.getItem("authToken");

// Background styling (optional)
const BackgroundContainer = styled("div")({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  // backgroundImage: `url('./peach.jpg')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

// Main content container
const ContentContainer = styled(Container)({
  position: "relative",
  zIndex: 2,
  background: "rgba(245,236,227,0.4)",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.6)",
  width: "90%",
  maxWidth: "800px",
  minWidth: "450px",
  textAlign: "center",
});

// Styled button
const StyledButton = styled(Button)({
  background: "linear-gradient(to right, #315b7e, rgb(109, 135, 155))",
  color: "white",
  fontWeight: "bold",
  padding: "16px",
  borderRadius: "4px",
  transition: "0.3s",
  "&:hover": {
    background: "linear-gradient(to right, #315b7e, rgb(109, 135, 155))",
    transform: "scale(1.05)",
  },
});

// Reuse the same styles for reviews that you have in HomePage
const reviewStyles = {
  reviewsContainer: {
    background: "rgba(7, 53, 102, 0.7)",
    padding: "40px 20px",
    textAlign: "center",
    position: "relative",
    marginTop: "30px",
    borderRadius: "8px",
  },
  reviewsTitle: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "white",
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
  reviewText: {
    fontSize: "16px",
    color: "#5D4037",
    marginBottom: "10px",
  },
  reviewAuthor: {
    fontSize: "14px",
    color: "#6c757d",
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
};

const WelcomePage = () => {
  const navigate = useNavigate();

  // Replicate the same state and logic as in HomePage’s UserReviews
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/users/api/reviews/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // same as HomePage
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          // No reviews or invalid response
          setError(true);
        } else {
          setReviews(data);
          setError(false);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Slider logic (same as HomePage)
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= reviews.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? reviews.length - (reviews.length % 3 || 3)
        : prevIndex - 3
    );
  };

  useEffect(() => {
    if (reviews.length > 3) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews]);

  // Compute which reviews to display (3 at a time)
  const displayedReviews =
    reviews.length > 3
      ? reviews
          .slice(currentIndex, currentIndex + 3)
          .concat(
            reviews.slice(
              0,
              Math.max(0, currentIndex + 3 - reviews.length)
            )
          )
      : reviews;

  return (
    <BackgroundContainer>
      <ContentContainer>
        {/* Header / Hero Section */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#315b7e" }}
        >
          Connectify: a platform that brings people together.
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#315b7e", mb: 2 }}
          >
            Connect with People Who Share Your Passions
          </Typography>
          <Typography variant="body1" sx={{ color: "#315b7e", mb: 3 }}>
            Welcome to Connectify – where you can discover your community based
            on shared interests. Whether you're into tech, art, sports, or
            literature, find friends and build meaningful connections.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <StyledButton onClick={() => navigate("/Signup")}>
              Get Started
            </StyledButton>
            <StyledButton onClick={() => navigate("/login")}>
              Log In
            </StyledButton>
          </Box>
        </Box>

        {/* Reviews Section - same slider logic as HomePage */}
        <div
          style={reviewStyles.reviewsContainer}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h2 style={reviewStyles.reviewsTitle}>What Our Users Say</h2>

          {loading ? (
            <p style={reviewStyles.reviewText}>Loading reviews...</p>
          ) : error || reviews.length === 0 ? (
            <p style={reviewStyles.reviewText}>No user reviews available</p>
          ) : (
            <div style={reviewStyles.reviewSliderContainer}>
              {/* Previous Button */}
              {isHovered && reviews.length > 3 && (
                <button style={{ ...reviewStyles.sliderButton, left: "0" }} onClick={prevSlide}>
                  &#8249;
                </button>
              )}

              {/* Reviews to display */}
              <div style={reviewStyles.reviewsList}>
                {displayedReviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      ...reviewStyles.reviewItem,
                      transition: "all 0.5s ease",
                      opacity: 1,
                    }}
                  >
                    <p style={reviewStyles.reviewText}>"{review.comment}"</p>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        marginTop: 2,
                      }}
                    >
                      <Rating name="read-only" value={review.rating} readOnly size="medium" />
                      <Typography variant="body2" color="text.secondary">
                        ({review.rating}/5)
                      </Typography>
                    </Box>
                    <p style={reviewStyles.reviewAuthor}>- {review.user?.fullname}</p>
                  </div>
                ))}
              </div>

              {/* Next Button */}
              {isHovered && reviews.length > 3 && (
                <button style={{ ...reviewStyles.sliderButton, right: "0" }} onClick={nextSlide}>
                  &#8250;
                </button>
              )}
            </div>
          )}
        </div>

        {/* Information Section (optional) */}
        <Box
          sx={{
            my: 4,
            background: "rgba(245,236,227,0.7)",
            p: 3,
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#315b7e", mb: 2 }}
          >
            Why Choose Connectify?
          </Typography>
          <Typography variant="body1" sx={{ color: "#315b7e" }}>
            Our innovative matching system connects you with like-minded
            individuals, helping you form meaningful relationships. Join our
            vibrant community and explore new opportunities to learn,
            collaborate, and grow.
          </Typography>
        </Box>
      </ContentContainer>
    </BackgroundContainer>
  );
};

export default WelcomePage;
