import React from 'react';
import { useNavigate } from "react-router-dom";

// Navbar component (you can adjust the navbar styling as needed)
function Navbar({navigate}){
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

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.outerContainer}>
      {/* Navbar */}
      <Navbar navigate={navigate} />
      <div style={styles.contentWrapper}>
        <div style={styles.contentContainer}>
      <div className="about_us_container">
        <div className="about_us">
          <div className="section">
            <h1>About Us</h1>
            <p className="intro">
              Welcome to Connectify! Connectify is a user-friendly web application designed to help individuals build meaningful connections based on shared interests. Our platform allows users to create personalized profiles, discover like-minded people through interest-based matching, and connect with others both online and in person. Whether you're looking for new friends, networking opportunities, or local meetups, Connectify makes it easier to find and engage with people who share your passions.
            </p>
          </div>
          <div className="section">
            <h2>Meet the Team</h2>
            <div className="team">
              <div className="team-member">
                <img src="https://media-yyz1-1.cdn.whatsapp.net/v/t61.24694-24/473396367_1678596543064566_7931647013761059272_n.jpg?ccb=11-4&oh=01_Q5AaIIDWHx1B3ABNpx32-1zbDfKWZLyzwjFlwbMkJFLIP5uL&oe=67C50E01&_nc_sid=5e03e0&_nc_cat=104" alt="Team Member" />
                <h3>Shailendra</h3>
                <p>Frontend</p>
              </div>
              <div className="team-member">
                <img src="https://media-yyz1-1.cdn.whatsapp.net/v/t61.24694-24/473396411_613803474517207_7371020398974454938_n.jpg?ccb=11-4&oh=01_Q5AaIB5_ifmhHU70NtZP463tzx2gAaCm9hSd10X0OL7PT68J&oe=67C4E871&_nc_sid=5e03e0&_nc_cat=106" alt="Team Member" />
                <h3>Eni Zeqo</h3>
                <p>Frontend</p>
              </div>
              <div className="team-member">
                <img src="https://media-yyz1-1.cdn.whatsapp.net/v/t61.24694-24/471647999_1330364294624497_2124070232912017468_n.jpg?ccb=11-4&oh=01_Q5AaIOE_kdK7KB5IB0ZDoU_ljWEj3w7PJPPouLYb-1yJQIQA&oe=67BA8546&_nc_sid=5e03e0&_nc_cat=107" alt="Team Member" />
                <h3>Zahrah</h3>
                <p>Frontend</p>
              </div>
              <div className="team-member">
                <img src="https://media-yyz1-1.cdn.whatsapp.net/v/t61.24694-24/421924633_1087240256101484_8615319572908836399_n.jpg?ccb=11-4&oh=01_Q5AaIBUpgjHqEMl81XeEcYtc4JfchwrP_5OJmhIEIWCBegAJ&oe=67BAB33D&_nc_sid=5e03e0&_nc_cat=106" alt="Team Member" />
                <h3>Behzad</h3>
                <p>Backend</p>
              </div>
              <div className="team-member">
                <img src="https://raw.githubusercontent.com/JillianGuo/CAA900-TEMP/refs/heads/main/IMG_4208(2).jpg" alt="Team Member" />
                <h3>Jiyun Guo</h3>
                <p>Backend</p>
              </div>
              <div className="team-member">
                <img src="https://media-yyz1-1.cdn.whatsapp.net/v/t61.24694-24/436887954_3792826047673392_2520651519346363110_n.jpg?ccb=11-4&oh=01_Q5AaIPG5GjrIB0QAHBjn8DTs_KOAXZ8X4J8xHqOex4Amk-zU&oe=67BAA1C4&_nc_sid=5e03e0&_nc_cat=111" alt="Team Member" />
                <h3>John</h3>
                <p>SRE</p>
              </div>
            </div>
          </div>
          <div className="section">
            <h2>Contact Us</h2>
            <p>
              We would love to hear from you! If you have any questions, feedback, or just want to say hello, please reach out to us at:
            </p>
            <ul>
              <li>Email: <a href="mailto:support@connectify.com">John@connectify.com</a></li>
              <li>Phone: <a href="tel:+1234567890">(123) 456-7890</a></li>
              <li>Address: 1750 Finch Ave E, North York ON M2J2X5</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );


}

const styles = {
  // Outer container fully transparent
  outerContainer: {
    background: "transparent",
    fontFamily: "'Roboto', sans-serif",
    width: "100vw",
    minHeight: "100vh",
  },
  // Content wrapper: Nude container with peach image background,
  // semi-transparent so the peach texture shows, with an enhanced shadow.
  contentWrapper: {
    background: "rgba(245,236,227,0.4)", // Nude overlay at 40% opacity
    backgroundImage: "url('./peach.jpg')", // Peach image background (ensure the path is correct)
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    borderRadius: "8px",
    maxWidth: "1200px",
    padding: "2rem",
    margin: "20px auto",

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
};

export default AboutPage;
