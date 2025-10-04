import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navigo from "./components/navbar/Navigo";
import ScrollToTop from "./components/scrolltotop/ScrollToTop";
import ProtectedRoute from "./components/ProtectRoute";

import Home from "./pages/home/Home";
import TaskFlow from "./pages/taskflow/TaskFlow";
import Tracker from "./pages/timetracker/Tracker";
import Timer from "./pages/timer/Timer";
import Pomodoro from "./pages/pomodoro/Pomodoro";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";

export default function App() {
  return (
    <div className="w-full min-h-screen m-0 p-0">
      <Router>
        <ScrollToTop />
        <Navigo />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/pomodoro" element={<Pomodoro />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/task" element={<TaskFlow />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </div>
  );
}
