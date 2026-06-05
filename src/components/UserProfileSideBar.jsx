import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BarChartIcon from "@mui/icons-material/BarChart";

const UserProfileSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const { page } = useParams();
  const user = useSelector((state) => state.auth.user);
  const username = user?.username;
  const [isSidebarShown, setIsSidebarShown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isPinned, setIsPinned] = useState(() => {
    return localStorage.getItem("sidebar-pinned") === "true";
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activePinned = isPinned && !isMobile && window.innerWidth > 1024;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activePinned) return;
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarShown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef, activePinned]);

  const sidebarItems = [
    { id: "1", name: "Home", icon: <HomeIcon /> },
    { id: "8", name: "Dashboard", icon: <DashboardIcon /> },
    { id: "9", name: "Analytics", icon: <BarChartIcon /> },
    { id: "2", name: "My Profile", icon: <PersonIcon /> },
    { id: "3", name: "My Workouts", icon: <FitnessCenterIcon /> },
    { id: "10", name: "AI Generator", icon: <AutoAwesomeIcon /> },
    { id: "4", name: "My Favorite", icon: <FavoriteIcon /> },
    { id: "6", name: "Fitness Tools", icon: <CalculateIcon /> },
    { id: "7", name: "Settings", icon: <SettingsIcon /> },
  ];

  const [activeItem, setActiveItem] = useState("1");

  useEffect(() => {
    const pathname = location.pathname;
    let activeId = "1";
    if (pathname === "/") {
      activeId = "1";
    } else if (pathname.includes("/dashboard")) {
      activeId = "8";
    } else if (pathname.includes("/analytics")) {
      activeId = "9";
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

    if (item.id === "1") {
      navigate("/");
      setIsSidebarShown(false);
      return;
    }

    if (!username) return;

    if (item.id === "10") {
      navigate(`/${username}/myworkouts?ai=true`);
      setActiveItem(item.id);
      setIsSidebarShown(false);
      return;
    }

    if (item.id === "9") {
      navigate(`/${username}/analytics`);
      setActiveItem(item.id);
      setIsSidebarShown(false);
      return;
    }

    const nextpath = item.name.toLowerCase().replace(" ", "");
    navigate(`/${username}/${nextpath}`);
    setActiveItem(item.id);
    setIsSidebarShown(false);
  };

  return (
    <div
      ref={sidebarRef}
      className={`user-profile-side-bar-container ${activePinned ? "pinned" : (!isSidebarShown ? "hide" : "")
        }`}
    >
      <div className="user-profile-side-bar">
        <ul className="user-profile-side-bar-list">
          {sidebarItems.map((item) => (
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
        {!isMobile && (
          <div
            className={`sidebar-pin-btn ${activePinned ? "pinned" : ""}`}
            onClick={() => {
              const nextPinned = !isPinned;
              setIsPinned(nextPinned);
              if (nextPinned) {
                setIsSidebarShown(true);
              }
              localStorage.setItem("sidebar-pinned", String(nextPinned));
            }}
            title={activePinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            {activePinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
            <span className="pin-text">{activePinned ? "Pinned" : "Pin"}</span>
          </div>
        )}
      </div>
      {!activePinned && (
        <div
          className="show-sidebar"
          onClick={() => setIsSidebarShown((prev) => !prev)}
        >
          {isSidebarShown ? <ChevronLeftIcon /> : <MenuIcon />}
        </div>
      )}
    </div>
  );
};

export default UserProfileSideBar;
