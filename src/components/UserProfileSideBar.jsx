import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

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
    { id: "1", name: "Home" },
    { id: "8", name: "Dashboard" },
    { id: "2", name: "My Profile" },
    { id: "3", name: "My Workouts" },
    { id: "4", name: "My Favorite" },
    { id: "6", name: "Fitness Tools" },
    { id: "7", name: "Settings" },
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

  const handleItemClick = (e) => {
    const item = sidebarItems.find((x) => x.id === e.target.id);
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
              id={item.id}
              onClick={(e) => handleItemClick(e)}
            >
              {item.name}
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
