import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Profile from "./components/profile";
import HomePage from "./components/HomePage"; 
import AboutPage from "./components/AboutPage";
import peachImage from "./peach.jpg"; // Background image for all pages except signup
import Signup from "./components/Signup";
import WelcomePage from "./components/WelcomePage";
import ChatPage from "./components/ChatPage";
import CreateEvent from "./components/CreateEvent";
import MyMatches from "./components/MyMatches";
import UserSettings from "./components/UserSettings";
import CommunityChat from "./components/CommunityChat.js";
import ViewEvents from "./components/ViewEvents";
import PolicyCompliance from "./components/PolicyCompliance";
import NotificationPage from "./components/NotificationPage";

const AppContent = () => {
  const location = useLocation(); // Get current route

  // Apply background only if it's NOT the signup page
  const appStyles = location.pathname !== "/signup"
    ? {
        backgroundImage: `url(${peachImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }
    : {}; // No background styling for signup

  return (
    <div className="App" style={appStyles}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} /> 
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/about" element={<AboutPage />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/matches" element={<MyMatches />} />
        <Route path="/ChatPage" element={<ChatPage />} />
        <Route path="/UserSettings" element={<UserSettings />} />
        <Route path="/ViewEvents" element={<ViewEvents />} />
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/CommunityChat" element={<CommunityChat />} />
        <Route path="/PolicyCompliance" element={<PolicyCompliance />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
