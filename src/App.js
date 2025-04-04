// src/App.js
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Profile from "./components/profile";
import HomePage from "./components/HomePage"; 
import AboutPage from "./components/AboutPage";
import Signup from "./components/Signup";
import WelcomePage from "./components/WelcomePage";
import ChatPage from "./components/ChatPage";
import CreateEvent from "./components/CreateEvent";
import MyMatches from "./components/MyMatches";
import UserSettings from "./components/UserSettings";
import CommunityChat from "./components/CommunityChat";
import ViewEvents from "./components/ViewEvents";
import PolicyCompliance from "./components/PolicyCompliance";
import NotificationPage from "./components/NotificationPage";
import UserProfile from "./components/userProfile";
import CustomNavbar from "./components/CustomNavbar";
import abstract from "./abstract.jpg";

const AppContent = () => {
  const location = useLocation();

  // Define routes where the navbar should NOT be shown.
  const noNavbarRoutes = ["/login", "/Signup", "/", "/welcome"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  // Background styling (applied to all pages except login/Signup)
  const appStyles =
    location.pathname !== "/Signup" && location.pathname !== "/login"
      ? {
          background: `linear-gradient(
            rgba(100, 126, 135, 0.4),
            rgba(255, 255, 255, 0.3)
          ), url(${abstract})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }
      : {};

  return (
    <div className="App" style={appStyles}>
      {showNavbar && <CustomNavbar />}
      {/* Add a top margin only if navbar is shown */}
      <div style={{ marginTop: showNavbar ? "300px" : "", width: "100%" }}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/about" element={<AboutPage />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/" element={<WelcomePage />} />
          <Route path="/matches" element={<MyMatches />} />
          <Route path="/ChatPage" element={<ChatPage />} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/UserSettings" element={<UserSettings />} />
          <Route path="/ViewEvents" element={<ViewEvents />} />
          <Route path="/createevent" element={<CreateEvent />} />
          <Route path="/comchat" element={<CommunityChat />} />
          <Route path="/PolicyCompliance" element={<PolicyCompliance />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
