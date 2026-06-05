import "./styles/styles.scss";
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import UserProfileSideBar from "./components/UserProfileSideBar";

import "react-toastify/dist/ReactToastify.css";
import { getUser } from "./api/authApi";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Home = lazy(() => import("./pages/Home"));
const Recipes = lazy(() => import("./pages/Recipes"));
const ExercisePage = lazy(() => import("./pages/ExercisePage"));
const ExercisesPage = lazy(() => import("./pages/Exercises"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const WorkoutPage = lazy(() => import("./pages/WorkoutPage"));
const SharedWorkoutPage = lazy(() => import("./pages/SharedWorkoutPage"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const AICoachChat = lazy(() => import("./components/AICoachChat"));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  // console.log(REACT_APP_BASE_URL);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isRouteResetPassword =
    window.location.pathname.includes("/reset-password");

  const shouldRenderNavbar = isRouteResetPassword;

  useEffect(() => {
    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);

    if (parts.length === 0) {
      document.title = "FitHub - Challenge yourself, change yourself | AI Workout Generator & Tracker";
    } else if (parts[0] === "forgot-password") {
      document.title = "FitHub - Forgot Password";
    } else if (parts[0] === "reset-password") {
      document.title = "FitHub - Reset Password";
    } else if (parts[0] === "exercises") {
      document.title = "FitHub - Search Exercises & Muscle Workouts | Interactive GIFs";
    } else if (parts[0] === "recipes") {
      document.title = "FitHub - Healthy Recipes";
    } else if (parts[0] === "exercise") {
      document.title = "FitHub - Exercise Details & Interactive GIFs";
    } else if (parts[0] === "share" && parts[1] === "workout") {
      document.title = "FitHub - Shared Workout Routine";
    } else if (parts.length >= 2) {
      const page = parts[1];
      if (page === "myworkouts") {
        if (parts.length >= 3) {
          document.title = "FitHub - View Workout Routine";
        } else {
          document.title = "FitHub - My Custom Workout Routines & Training Programs";
        }
      } else if (page === "dashboard") {
        document.title = "FitHub - Training Dashboard: Streaks, History & PRs";
      } else if (page === "settings") {
        document.title = "FitHub - Account Settings & Profile Customization";
      } else {
        document.title = `FitHub - ${parts[0]}'s Profile`;
      }
    } else {
      document.title = "FitHub : Challenge yourself, change yourself";
    }
  }, [location.pathname]);

  useEffect(() => {
    getUser(dispatch);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getUser(dispatch);
    }
  }, [isLoggedIn]);

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`App ${isLoggedIn ? "has-sidebar" : ""}`}>
      <ToastContainer
        theme="dark"
        progressStyle={{
          background: "red",
        }}
      />
      {isLoggedIn && <UserProfileSideBar />}
      <div className="main-app-content">
        {!shouldRenderNavbar && <Navbar />}
        <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><div style={{ width: "32px", height: "32px", border: "2px solid rgba(0, 240, 255, 0.1)", borderTopColor: "#00f0ff", borderRadius: "50%", animation: "spin 0.8s infinite linear" }}></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/exercises/:search" element={<ExercisesPage />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/exercise/:id" element={<ExercisePage />} />
            <Route path="/:username/:page" element={<UserProfile />} />

            <Route
              path="/:username/myworkouts/:workoutId"
              element={<WorkoutPage />}
            />
            <Route path="/share/workout/:workoutId" element={<SharedWorkoutPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
      {showScrollButton && (
        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <KeyboardArrowUpIcon />
        </button>
      )}
      <Suspense fallback={null}>
        <AICoachChat />
      </Suspense>
    </div>
  );
}

export default App;
