import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";

import MyProfile from "./MyProfile";
import MyWorkouts from "./MyWorkouts";
import MyFavorite from "./MyFavorite";
import ProgressAnalytics from "./ProgressAnalytics";
import Settings from "./Settings";
import FitnessTools from "./FitnessTools";
import PageNotFound from "./PageNotFound";
import TrainingDashboard from "./TrainingDashboard";
import WorkoutHistory from "./WorkoutHistory";
import { portalActions } from "../store/index";

const UserProfileMainSection = () => {
  const { username, page } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  let detectedPage = page;
  if (!detectedPage) {
    if (pathParts.includes("fitnesstools") || pathParts.includes("tools")) {
      detectedPage = "fitnesstools";
    } else if (pathParts.includes("dashboard")) {
      detectedPage = "dashboard";
    } else if (pathParts.includes("analytics")) {
      detectedPage = "analytics";
    } else if (pathParts.includes("history") || pathParts.includes("workouthistory")) {
      detectedPage = "history";
    } else if (pathParts.includes("myprofile") || pathParts.includes("profile")) {
      detectedPage = "myprofile";
    } else if (pathParts.includes("settings")) {
      detectedPage = "settings";
    } else if (pathParts.includes("workouts") || pathParts.includes("myworkouts")) {
      detectedPage = "myworkouts";
    } else {
      detectedPage = "dashboard";
    }
  }

  const resolvedPage = (detectedPage || "dashboard").toLowerCase();

  // If logged in and username in URL doesn't match the current authenticated username, redirect cleanly
  useEffect(() => {
    if (isLoggedIn && user?.username && username && username !== "profile" && username !== user.username) {
      navigate(`/${user.username}/${resolvedPage}`, { replace: true });
    }
  }, [isLoggedIn, user?.username, username, resolvedPage, navigate]);

  const components = {
    dashboard: <TrainingDashboard />,
    myprofile: <MyProfile />,
    profile: <MyProfile />,
    myworkouts: <MyWorkouts />,
    workouts: <MyWorkouts />,
    myfavorite: <MyFavorite />,
    analytics: <ProgressAnalytics />,
    history: <WorkoutHistory />,
    workouthistory: <WorkoutHistory />,
    fitnesstools: <FitnessTools />,
    tools: <FitnessTools />,
    calculator: <FitnessTools />,
    settings: <Settings />,
  };

  // Pages that are public (can be viewed without signing in)
  const isPublicPage = resolvedPage === "fitnesstools" || resolvedPage === "tools" || resolvedPage === "calculator" || resolvedPage === "myworkouts" || resolvedPage === "workouts";

  // Auth gate for protected pages
  if (!isLoggedIn && !isPublicPage) {
    const pageTitle = resolvedPage ? resolvedPage.charAt(0).toUpperCase() + resolvedPage.slice(1) : "Account Area";
    return (
      <div className="user-profile-main-section">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "65vh",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(0, 240, 255, 0.1)",
              border: "1px solid rgba(0, 240, 255, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              boxShadow: "0 0 30px rgba(0, 240, 255, 0.2)",
            }}
          >
            <LockOutlinedIcon style={{ fontSize: "2rem", color: "#00f0ff" }} />
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#fff", marginBottom: "10px" }}>
            Sign In to Access {pageTitle}
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "450px", fontSize: "1rem", lineHeight: "1.6", marginBottom: "28px" }}>
            You need to be logged in to view your workouts, tracking dashboard, analytics, personal records, and settings.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => {
                dispatch(portalActions.setPortalTypeLogin());
                dispatch(portalActions.setPortalOpen());
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)",
                color: "#050811",
                fontWeight: "700",
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0, 240, 255, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              <LoginIcon style={{ fontSize: "1.1rem" }} /> Sign In / Sign Up
            </button>

            <button
              onClick={() => navigate("/")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#e2e8f0",
                fontWeight: "600",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <HomeIcon style={{ fontSize: "1.1rem" }} /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pageToDisplay = components[resolvedPage] || <PageNotFound />;

  return <div className="user-profile-main-section">{pageToDisplay}</div>;
};

export default UserProfileMainSection;
