import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index.tsx";
import Home from "./pages/Home.tsx";
import Events from "./pages/Events.tsx";
import Balance from "./pages/Balance.tsx";
import LogIn from "./pages/LogIn.tsx";
import Profile from "./pages/Profile.tsx";
import SignIn from "./pages/SignUp.tsx";

function App() { 
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/Events" element={<Events />} />
      <Route path="/Balance" element={<Balance />} />
      <Route path="/LogIn" element={<LogIn />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/Index" element={<Index />} />
    </Routes>
  );
}

export default App;