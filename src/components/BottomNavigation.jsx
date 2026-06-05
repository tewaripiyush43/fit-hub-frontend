import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { portalActions } from "../store";
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

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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

  // Update active tab based on path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveTab("home");
    } else if (path.includes("/dashboard")) {
      setActiveTab("home");
    } else if (path.includes("/exercises") || path.includes("/exercise/")) {
      setActiveTab("exercises");
    } else if (path.includes("/recipes")) {
      setActiveTab("recipes");
    } else if (path.includes("/myworkouts")) {
      setActiveTab("workouts");
    } else if (
      path.includes("/myprofile") ||
      path.includes("/settings") ||
      path.includes("/myfavorite") ||
      path.includes("/fitnesstools") ||
      path.includes("/analytics")
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
    } else if (tab === "recipes") {
      navigate("/recipes");
      setIsMenuOpen(false);
    } else if (tab === "workouts") {
      if (isLoggedIn && user?.username) {
        navigate(`/${user.username}/myworkouts`);
      } else {
        dispatch(portalActions.setPortalOpen());
      }
      setIsMenuOpen(false);
    } else if (tab === "more") {
      if (isLoggedIn) {
        setIsMenuOpen((prev) => !prev);
      } else {
        dispatch(portalActions.setPortalOpen());
      }
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
      <div className="mobile-bottom-nav">
        <div
          className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
          onClick={() => handleTabClick("home")}
        >
          {isLoggedIn ? <DashboardIcon /> : <HomeIcon />}
          <span className="tab-label">{isLoggedIn ? "Dashboard" : "Home"}</span>
        </div>

        <div
          className={`nav-tab ${activeTab === "exercises" ? "active" : ""}`}
          onClick={() => handleTabClick("exercises")}
        >
          <SearchIcon />
          <span className="tab-label">Exercises</span>
        </div>

        {isLoggedIn && (
          <div
            className={`nav-tab ${activeTab === "workouts" ? "active" : ""}`}
            onClick={() => handleTabClick("workouts")}
          >
            <FitnessCenterIcon />
            <span className="tab-label">Workouts</span>
          </div>
        )}

        <div
          className={`nav-tab ${activeTab === "recipes" ? "active" : ""}`}
          onClick={() => handleTabClick("recipes")}
        >
          <RestaurantIcon />
          <span className="tab-label">Recipes</span>
        </div>

        {isLoggedIn && (
          <div
            className={`nav-tab ${activeTab === "more" ? "active" : ""}`}
            onClick={() => handleTabClick("more")}
          >
            <MoreHorizIcon />
            <span className="tab-label">More</span>
          </div>
        )}
      </div>

      {/* Slide-up Bottom Menu Drawer */}
      {isLoggedIn && isMenuOpen && (
        <div
          className="bottom-sheet-overlay"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="bottom-sheet-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bottom-sheet-handle"></div>
            <div className="bottom-sheet-header">
              <div className="user-profile-badge">
                <span className="user-initial">
                  {user?.username?.[0]?.toUpperCase()}
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
            </div>

            <ul className="bottom-sheet-list">
              <li
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/${user.username}/myprofile`);
                }}
              >
                <PersonIcon />
                <span>My Profile</span>
              </li>
              <li
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/${user.username}/analytics`);
                }}
              >
                <WhatshotIcon />
                <span>Achievements</span>
              </li>
              <li
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/${user.username}/myfavorite`);
                }}
              >
                <FavoriteIcon />
                <span>My Favorites</span>
              </li>
              <li
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/${user.username}/fitnesstools`);
                }}
              >
                <CalculateIcon />
                <span>Fitness Tools</span>
              </li>
              <li
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/${user.username}/settings`);
                }}
              >
                <SettingsIcon />
                <span>Settings</span>
              </li>
              <li className="logout-item" onClick={handleLogout}>
                <LogoutIcon />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNavigation;
