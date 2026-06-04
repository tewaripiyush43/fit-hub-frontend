import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";

const UserProfileSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const { page } = useParams();
  const user = useSelector((state) => state.auth.user);
  const username = user?.username;
  const [isSidebarShown, setIsSidebarShown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarShown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  const sidebarItems = [
    { id: "1", name: "Home", icon: <HomeIcon /> },
    { id: "8", name: "Dashboard", icon: <DashboardIcon /> },
    { id: "2", name: "My Profile", icon: <PersonIcon /> },
    { id: "3", name: "My Workouts", icon: <FitnessCenterIcon /> },
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
    } else if (pathname.includes("/dashboard") || pathname.includes("/myachievements")) {
      activeId = "8";
    } else if (pathname.includes("/myprofile")) {
      activeId = "2";
    } else if (pathname.includes("/myworkouts")) {
      activeId = "3";
    } else if (pathname.includes("/myfavorite")) {
      activeId = "4";
    } else if (pathname.includes("/fitnesstools")) {
      activeId = "6";
    } else if (pathname.includes("/settings")) {
      activeId = "7";
    }
    setActiveItem(activeId);
  }, [location.pathname]);

  const handleItemClick = (item) => {
    if (!item) return;

    if (item.id === "1") {
      navigate("/");
      setIsSidebarShown(false);
      return;
    }

    if (!username) return;
    const nextpath = item.name.toLowerCase().replace(" ", "");
    navigate(`/${username}/${nextpath}`);
    setActiveItem(item.id);
    setIsSidebarShown(false);
  };

  return (
    <div
      ref={sidebarRef}
      className={`user-profile-side-bar-container ${
        !isSidebarShown ? "hide" : ""
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
      </div>
      <div
        className="show-sidebar"
        onClick={() => setIsSidebarShown((prev) => !prev)}
      >
        {isSidebarShown ? <ChevronLeftIcon /> : <MenuIcon />}
      </div>
    </div>
  );
};

export default UserProfileSideBar;
