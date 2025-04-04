import React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import eni from "../image/Eni.jpg";
import shailendra from "../image/shailendra.jpg";
import jiyun from "../image/Jiyun.jpg";
import john from "../image/John.jpg";
import behzad from "../image/Behzad.jpg";
import zahrah from "../image/Zahrah.jpg";

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.outerContainer}>
      <div style={styles.contentWrapper}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom style={styles.heading}>
            About Us
          </Typography>
          <Box mt={3}>
            <Typography variant="body1" paragraph style={styles.text}>
              Welcome to Connectify! Connectify is a modern, user-friendly platform designed to help you build meaningful connections based on shared interests. Our application empowers you to create personalized profiles, find like-minded individuals, and engage in social activities both online and in person.
            </Typography>
          </Box>
          <Box mt={5}>
            <Typography variant="h4" align="center" gutterBottom style={styles.subHeading}>
              Meet the Team
            </Typography>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={shailendra} alt="Shailendra" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Shailendra
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Frontend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={eni} alt="Eni Zeqo" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Eni Zeqo
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Frontend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={zahrah} alt="Zahrah" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Zahrah
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Frontend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={behzad} alt="Behzad" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Behzad
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Backend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={jiyun} alt="Jiyun Guo" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  Jiyun Guo
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  Backend
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2} style={{ textAlign: "center" }}>
                <img src={john} alt="John" style={styles.teamImage} />
                <Typography variant="subtitle1" style={styles.teamName}>
                  John
                </Typography>
                <Typography variant="caption" style={styles.teamRole}>
                  SRE
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box mt={5}>
            <Typography variant="h4" align="center" gutterBottom style={styles.subHeading}>
              Contact Us
            </Typography>
            <Box textAlign="center" mt={2}>
              <Typography variant="body1" paragraph style={styles.text}>
                We would love to hear from you! Reach out for any inquiries or feedback.
              </Typography>
              <Typography variant="body1" style={styles.text}>
                Email:{" "}
                <a href="mailto:support@connectify.com" style={styles.link}>
                  support@connectify.com
                </a>
              </Typography>
              <Typography variant="body1" style={styles.text}>
                Phone:{" "}
                <a href="tel:+1234567890" style={styles.link}>
                  (123) 456-7890
                </a>
              </Typography>
              <Typography variant="body1" style={styles.text}>
                Address: 1750 Finch Ave E, North York ON M2J2X5
              </Typography>
            </Box>
          </Box>
        </Container>
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
    background: "rgba(7, 53, 102, 0.7)",
    backgroundImage: "url('./peach.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    margin: "20px auto",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    borderRadius: "8px",
    maxWidth: "1200px",
    width: "95%",
  },
  heading: {
    color: "white",
    fontWeight: 700,
    marginBottom: "1rem",
  },
  subHeading: {
    color: "white",
    fontWeight: 600,
    marginBottom: "1rem",
  },
  text: {
    color: "white",
    lineHeight: 1.6,
    fontSize: "1rem",
  },
  link: {
    color: "white",
    textDecoration: "underline",
  },
  teamImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  teamName: {
    marginTop: "0.5rem",
    fontWeight: 600,
    color: "white",
  },
  teamRole: {
    fontSize: "0.8rem",
    color: "white",
  },
};

export default AboutPage;