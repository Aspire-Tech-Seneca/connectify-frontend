import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Profile from "./components/profile";
import HomePage from "./components/HomePage"; 
import AboutPage from "./components/AboutPage";
import peachImage from "./peach.jpg"; // Background image
import Signup from "./components/Signup";
import WelcomePage from "./components/WelcomePage";
import ChatPage from "./components/ChatPage";
import CreateEvent from "./components/CreateEvent";
import MyMatches from "./components/MyMatches";


const App = () => {
  const appStyles = {
    backgroundImage: `url(${peachImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  };

  return (
    <Router>
      <div className="App" style={appStyles}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/Home" element={<HomePage />} /> 
          <Route path="/about" element={<AboutPage />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<WelcomePage />} />
          <Route path="/matches" element={<MyMatches/>} />
          <Route path="/ChatPage" element={<ChatPage/>} />
		  <Route path="/createevent" element={<CreateEvent />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;