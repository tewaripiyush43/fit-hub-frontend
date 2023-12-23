import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/index.js";
import axios from "axios";
import ConfirmationPopup from "../components/ConfirmationPopUp.jsx";

const UserProfileSideBar = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const { username, page } = useParams();
  const [isSidebarShown, setIsSidebarShown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    { id: "1", name: "My Profile" },
    { id: "2", name: "My Workouts" },
    { id: "3", name: "My Favorite" },
  ];

  const currPage = {
    myprofile: "1",
    myworkouts: "2",
    myfavorite: "3",
  }[page];

  const [activeItem, setActiveItem] = useState(currPage);

  useEffect(() => {
    setActiveItem(currPage);
  }, [currPage]);

  const handleItemClick = (e) => {
    // console.log(username);
    const nextpath = sidebarItems[e.target.id - 1].name
      .toLowerCase()
      .replace(" ", "");
    navigate(`/${username}/${nextpath}`);
    setActiveItem(e.target.id);
  };

  const sendDeleteReq = async () => {
    await axios
      .delete(`${REACT_APP_BASE_URL}/auth/delete`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.clear();
          dispatch(authActions.logout());
          dispatch(authActions.setUser({}));
          navigate(`/`);
          // console.log(isLoggedIn);
          return;
        }
        return new Error("Unable to delete account. Please try again");
      })

      .catch((err) => {
        return new Error("Unable to delete account. Please try again");
      });
  };

  return (
    <div
      ref={sidebarRef}
      className={`user-profile-side-bar-container ${
        !isSidebarShown ? "hide" : ""
      }`}
    >
      {showConfirmation && (
        <ConfirmationPopup
          onClose={() => setShowConfirmation(false)}
          textContent="account"
          onDelete={() => {
            sendDeleteReq();
            setShowConfirmation(false);
          }}
        />
      )}
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
        <button
          onClick={() => setShowConfirmation(true)}
          className="user-profile-delete-btn"
        >
          Delete Account
        </button>
      </div>
      <p
        className="show-sidebar"
        onClick={() => setIsSidebarShown((prev) => !prev)}
      >
        SIDEBAR
      </p>
    </div>
  );
};

export default UserProfileSideBar;
