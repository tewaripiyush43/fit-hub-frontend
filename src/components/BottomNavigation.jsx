import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectActiveWorkout, portalActions } from "../store";
import { logout } from "../api/authApi";

// Material UI Icons
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import LoginIcon from "@mui/icons-material/Login";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const activeWorkout = useSelector(selectActiveWorkout);

  const [activeTab, setActiveTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = React.useRef(0);
  const touchCurrentY = React.useRef(0);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!touchStartY.current) return;
    const currentY = e.touches[0].clientY;
    touchCurrentY.current = currentY;
    const deltaY = currentY - touchStartY.current;
    if (deltaY > 0) {
      setDragOffsetY(deltaY);
    } else {
      setDragOffsetY(deltaY * 0.15); // gentle resistance when pulling upwards
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const deltaY = touchCurrentY.current - touchStartY.current;
    if (deltaY > 70) {
      setIsMenuOpen(false);
    }
    setDragOffsetY(0);
    touchStartY.current = 0;
    touchCurrentY.current = 0;
  };

  // Monitor screen resize to hide bottom navigation when virtual keyboard opens
  useEffect(() => {
    const originalHeight = window.innerHeight;
    const handleResize = () => {
      if (originalHeight - window.innerHeight > 150) {
        setIsKeyboardVisible(true);
      } else {
        setIsKeyboardVisible(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Escape key handler for bottom sheet menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Update active tab based on path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path.includes("/dashboard")) {
      setActiveTab("home");
    } else if (path.includes("/exercises") || path.includes("/exercise/")) {
      setActiveTab("exercises");
    } else if (path.includes("/recipes")) {
      setActiveTab("recipes");
    } else if (path.includes("/workouts") || path.includes("/myworkouts")) {
      setActiveTab("workouts");
    } else if (
      path.includes("/myprofile") ||
      path.includes("/settings") ||
      path.includes("/myfavorite") ||
      path.includes("/fitnesstools") ||
      path.includes("/analytics") ||
      path.includes("/history") ||
      path.includes("/anatomy")
    ) {
      setActiveTab("more");
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    if (tab === "home") {
      if (isLoggedIn && user?.username) {
        navigate(`/${user.username}/dashboard`);
      } else {
        navigate("/");
      }
      setIsMenuOpen(false);
    } else if (tab === "exercises") {
      navigate("/exercises/all");
      setIsMenuOpen(false);
    } else if (tab === "active") {
      if (activeWorkout?.isActive && activeWorkout?.workoutId) {
        navigate(`/workout/${activeWorkout.workoutId}/session`);
      } else {
        window.dispatchEvent(new CustomEvent("open-ai-coach"));
      }
      setIsMenuOpen(false);
    } else if (tab === "workouts") {
      if (isLoggedIn && user?.username) {
        navigate(`/${user.username}/myworkouts`);
      } else {
        navigate("/workouts?tab=explore");
      }
      setIsMenuOpen(false);
    } else if (tab === "more") {
      setIsMenuOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout(dispatch);
    navigate("/");
  };

  if (isKeyboardVisible) return null;

  return (
    <>
      <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        <button
          type="button"
          className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
          onClick={() => handleTabClick("home")}
          aria-label={isLoggedIn ? "Dashboard" : "Home"}
        >
          {isLoggedIn ? <DashboardIcon /> : <HomeIcon />}
          <span className="tab-label">{isLoggedIn ? "Dashboard" : "Home"}</span>
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === "workouts" ? "active" : ""}`}
          onClick={() => handleTabClick("workouts")}
          aria-label="Workouts"
        >
          <FitnessCenterIcon />
          <span className="tab-label">Workouts</span>
        </button>

        {/* Center Glowing Action Button (Active Session / AI Coach) */}
        <button
          type="button"
          className={`nav-tab center-action-tab ${activeWorkout?.isActive ? "pulse-active" : ""}`}
          onClick={() => handleTabClick("active")}
          aria-label={activeWorkout?.isActive ? "Resume Active Workout" : "Open AI Fitness Coach"}
        >
          <div className="center-action-btn">
            {activeWorkout?.isActive ? (
              <WhatshotIcon className="active-flame-icon" />
            ) : (
              <AutoAwesomeIcon />
            )}
          </div>
          <span className="tab-label">
            {activeWorkout?.isActive ? "Active" : "AI Coach"}
          </span>
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === "exercises" ? "active" : ""}`}
          onClick={() => handleTabClick("exercises")}
          aria-label="Exercises"
        >
          <SearchIcon />
          <span className="tab-label">Exercises</span>
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === "more" ? "active" : ""}`}
          onClick={() => handleTabClick("more")}
          aria-label="More Options"
        >
          <MoreHorizIcon />
          <span className="tab-label">More</span>
        </button>
      </nav>

      {/* Slide-up Bottom Menu Drawer */}
      {isMenuOpen && (
        <div
          className="bottom-sheet-overlay"
          onClick={() => setIsMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation & Account Menu"
        >
          <div
            className={`bottom-sheet-container ${isDragging ? "dragging" : ""}`}
            style={{
              transform: `translateY(${Math.max(0, dragOffsetY)}px)`,
              transition: isDragging ? "none" : "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <div
              className="bottom-sheet-handle-zone"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="bottom-sheet-handle" />
            </div>
            <div className="bottom-sheet-header">
              {isLoggedIn ? (
                <div className="user-profile-badge">
                  <span className="user-initial">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                  <div className="user-details">
                    <span className="username">@{user?.username}</span>
                    {user?.streak > 0 && (
                      <span className="streak">
                        <WhatshotIcon /> {user.streak} Day Streak
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="user-profile-badge">
                  <span className="user-initial">F</span>
                  <div className="user-details">
                    <span className="username">FitHub Explorer</span>
                    <span className="streak" style={{ color: "var(--accent)" }}>
                      Science-Backed Training
                    </span>
                  </div>
                </div>
              )}
            </div>

            <ul className="bottom-sheet-list">
              {isLoggedIn ? (
                <>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/${user.username}/myprofile`);
                    }}
                  >
                    <PersonIcon />
                    <span>My Profile & Goals</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/${user.username}/history`);
                    }}
                  >
                    <HistoryIcon />
                    <span>Workout History</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/${user.username}/analytics`);
                    }}
                  >
                    <BarChartIcon />
                    <span>Analytics & PRs</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/anatomy`);
                    }}
                  >
                    <AccessibilityNewIcon />
                    <span>Muscle Anatomy Map</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/${user.username}/fitnesstools`);
                    }}
                  >
                    <CalculateIcon />
                    <span>Fitness Tools & Calculators</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/recipes`);
                    }}
                  >
                    <RestaurantIcon />
                    <span>Healthy Recipes</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/${user.username}/myfavorite`);
                    }}
                  >
                    <FavoriteIcon />
                    <span>Favorite Exercises</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/${user.username}/settings`);
                    }}
                  >
                    <SettingsIcon />
                    <span>Settings & Units</span>
                  </li>
                  <li className="logout-item" onClick={handleLogout}>
                    <LogoutIcon />
                    <span>Logout</span>
                  </li>
                </>
              ) : (
                <>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/anatomy`);
                    }}
                  >
                    <AccessibilityNewIcon />
                    <span>Muscle Anatomy Map</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/recipes`);
                    }}
                  >
                    <RestaurantIcon />
                    <span>Healthy Recipes</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/exercises/all`);
                    }}
                  >
                    <SearchIcon />
                    <span>Exercise Library</span>
                  </li>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/fitnesstools`);
                    }}
                  >
                    <CalculateIcon />
                    <span>Fitness Tools & Calculators</span>
                  </li>
                  <li
                    className="login-action-item"
                    onClick={() => {
                      setIsMenuOpen(false);
                      dispatch(portalActions.setPortalOpen());
                    }}
                    style={{ color: "var(--accent)", fontWeight: "600" }}
                  >
                    <LoginIcon />
                    <span>Login or Sign Up</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNavigation;
