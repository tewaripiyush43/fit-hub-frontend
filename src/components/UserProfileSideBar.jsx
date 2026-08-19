import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HistoryIcon from "@mui/icons-material/History";

import { authActions } from "../store/index";
import { updateUserSettings } from "../api/userApi";

const UserProfileSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const username = user?.username;
  const [isSidebarShown, setIsSidebarShown] = useState(() => {
    const saved = localStorage.getItem("sidebar-shown");
    return saved !== null ? saved === "true" : false;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isPinned, setIsPinned] = useState(() => {
    if (user?.settings?.sidebarPinned !== undefined) {
      return Boolean(user.settings.sidebarPinned);
    }
    const saved = localStorage.getItem("sidebar-pinned");
    if (saved !== null) {
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    const handleToggle = () => {
      setIsSidebarShown((prev) => {
        const next = !prev;
        localStorage.setItem("sidebar-shown", next.toString());
        return next;
      });
    };
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("sidebar-state-change", { detail: { isSidebarShown } }));
  }, [isSidebarShown]);

  useEffect(() => {
    if (user?.settings?.sidebarPinned !== undefined) {
      setIsPinned(Boolean(user.settings.sidebarPinned));
    }
  }, [user?.settings?.sidebarPinned]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activePinned = isPinned && !isMobile && isSidebarShown;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activePinned) return;
      // Prevent race condition when clicking the hamburger toggle or edge trigger
      if (
        event.target.closest(".navbar-hamburger-btn") ||
        event.target.closest(".show-sidebar")
      ) {
        return;
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarShown(false);
        localStorage.setItem("sidebar-shown", "false");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef, activePinned]);

  const sidebarGroups = [
    {
      groupTitle: "TRAINING",
      items: [
        { id: "8", name: "Dashboard", icon: <DashboardIcon />, path: `/${username}/dashboard` },
        { id: "3", name: "My Routines", icon: <FitnessCenterIcon />, path: `/${username}/myworkouts` },
        { id: "10", name: "AI Generator", icon: <AutoAwesomeIcon />, path: `/${username}/myworkouts?ai=true` },
      ],
    },
    {
      groupTitle: "PROGRESS & DATA",
      items: [
        { id: "11", name: "Workout History", icon: <HistoryIcon />, path: `/${username}/history` },
        { id: "9", name: "Analytics & PRs", icon: <BarChartIcon />, path: `/${username}/analytics` },
      ],
    },
    {
      groupTitle: "LIBRARY & TOOLS",
      items: [
        { id: "4", name: "Favorite Exercises", icon: <FavoriteIcon />, path: `/${username}/myfavorite` },
        { id: "6", name: "Fitness Tools", icon: <CalculateIcon />, path: `/${username}/fitnesstools` },
        { id: "2", name: "My Profile", icon: <PersonIcon />, path: `/${username}/myprofile` },
        { id: "7", name: "Settings", icon: <SettingsIcon />, path: `/${username}/settings` },
      ],
    },
  ];

  const [activeItem, setActiveItem] = useState("8");

  useEffect(() => {
    const pathname = location.pathname;
    let activeId = "8";
    if (pathname.includes("/dashboard")) {
      activeId = "8";
    } else if (pathname.includes("/analytics")) {
      activeId = "9";
    } else if (pathname.includes("/history")) {
      activeId = "11";
    } else if (pathname.includes("/myprofile")) {
      activeId = "2";
    } else if (pathname.includes("/myworkouts")) {
      activeId = location.search.includes("ai=true") ? "10" : "3";
    } else if (pathname.includes("/myfavorite")) {
      activeId = "4";
    } else if (pathname.includes("/fitnesstools")) {
      activeId = "6";
    } else if (pathname.includes("/settings")) {
      activeId = "7";
    }
    setActiveItem(activeId);
  }, [location.pathname, location.search]);

  const handleItemClick = (item) => {
    if (!item) return;
    if (item.path) {
      navigate(item.path);
      setActiveItem(item.id);
      setIsSidebarShown(false);
    }
  };

  const handleTogglePin = async () => {
    const nextPinned = !isPinned;
    setIsPinned(nextPinned);
    if (nextPinned) {
      setIsSidebarShown(true);
    }
    localStorage.setItem("sidebar-pinned", String(nextPinned));
    dispatch(authActions.updateSettings({ sidebarPinned: nextPinned }));

    if (isLoggedIn) {
      try {
        await updateUserSettings(dispatch, { sidebarPinned: nextPinned });
      } catch (err) {
        console.error("Failed to sync sidebar pin preference to DB:", err);
      }
    }
  };

  if (isMobile) {
    return null;
  }

  return (
    <>
      {isSidebarShown && !activePinned && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarShown(false)} />
      )}

      <div
        ref={sidebarRef}
        className={`user-profile-side-bar-container ${activePinned ? "pinned" : !isSidebarShown ? "hide" : ""
          }`}
      >
        <div className="user-profile-side-bar">
          <div className="sidebar-top-header">
            <span className="sidebar-workspace-label">WORKSPACE</span>
          </div>

          <div className="user-profile-side-bar-scrollable">
            {sidebarGroups.map((group, gIdx) => (
              <div className="sidebar-nav-group" key={gIdx}>
                <span className="sidebar-group-title">{group.groupTitle}</span>
                <ul className="user-profile-side-bar-list">
                  {group.items.map((item) => (
                    <li
                      className={
                        "user-profile-side-bar-list-item" +
                        (activeItem === item.id
                          ? " user-profile-side-bar-list-item-active"
                          : "")
                      }
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                    >
                      <span className="sidebar-icon-wrapper">{item.icon}</span>
                      <span className="sidebar-text">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {!isMobile && (
            <div
              className={`sidebar-pin-btn ${activePinned ? "pinned" : ""}`}
              onClick={handleTogglePin}
              title={activePinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              {activePinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
              <span className="pin-text">{activePinned ? "Pinned" : "Pin"}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfileSideBar;
