import React, { useState, useEffect, useRef } from "react";
import profilePicture from "../assets/images/home-img-7.jpg";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/index.js";
import axios from "axios";
import { errorPopUp } from "../helpers/errorPopUp.js";

const UserProfileInfoCard = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [userInfo, setUserInfo] = useState({
    fullname: user?.fullname || "Fit Hub",
    bio:
      user?.bio ||
      `Welcome to my world of fitness and adventure! 🏋️‍♂️🌎 Follow me on my journey as I explore new heights and push my limits.`,
    location: user?.location || "Home Sweet Home, Earth",
    age: user?.age || 23,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleInfoChange = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "bio" && editMode) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleInfoSave = () => {
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    axios
      .put(
        `${REACT_APP_BASE_URL}/user/updateUserInfo`,
        { ...userInfo },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        dispatch(authActions.setUser(res.data));
        setEditMode((prev) => !prev);
      })
      .catch((err) => {
        // console.log(err);
        setErrorMessage("Something went wrong. Please try again later.");
      });
  };

  useEffect(() => {
    if (user) {
      setUserInfo({
        fullname: user?.fullname || "Fit Hub",
        bio:
          user?.bio ||
          `Welcome to my world of fitness and adventure! 🏋️‍♂️🌎 Follow me on my journey as I explore new heights and push my limits.`,
        location: user?.location || "Home Sweet Home, Earth",
        age: user?.age || 23,
      });
    }
  }, [user]);

  useEffect(() => {
    if (errorMessage.length > 0) {
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  useEffect(() => {
    if (editMode) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editMode]);

  return (
    <div className="user-profile-info-card">
      <div className="edit-icon-container">
        {editMode ? (
          <button
            onClick={() => handleInfoSave()}
            title="Save Info"
            className="save-info-btn"
          >
            Save
          </button>
        ) : (
          <EditIcon
            onClick={() => setEditMode((prev) => !prev)}
            title="Edit Profile"
            className="edit-icon"
          />
        )}
      </div>
      <div className="profile-header">
        <div className="profile-picture-container">
          <img src={profilePicture} alt="Profile" className="profile-picture" />
        </div>
        <div className="user-info">
          <h1 className="username">@{user?.username}</h1>
          <p className="joined-on">
            Joined On: {user?.createdAt?.toString().slice(0, 10)}
          </p>
        </div>
      </div>
      {editMode ? (
        <div className="user-bio">
          <textarea
            ref={textareaRef}
            disabled={!editMode}
            className="user-bio-textarea"
            type="text"
            maxLength={170}
            name="bio"
            rows={3}
            height="auto"
            value={userInfo?.bio}
            onChange={handleInfoChange}
          />
          <span className="total-user-bio-characters">
            {userInfo?.bio?.length}/170
          </span>
        </div>
      ) : (
        <div className="user-bio">
          <p className="user-bio-textarea">{userInfo?.bio}</p>
        </div>
      )}

      <div className="user-details">
        <div className="user-profile-detail">
          <p className="user-profile-detail-label">Name</p>
          {editMode ? (
            <input
              type="text"
              name="fullname"
              onChange={handleInfoChange}
              value={userInfo?.fullname}
              className="user-profile-detail-value-input"
            />
          ) : (
            <p className="user-profile-detail-value">{userInfo?.fullname}</p>
          )}
        </div>
        <div className="user-profile-detail">
          <p className="user-profile-detail-label ">Age</p>
          {editMode ? (
            <input
              type="int"
              name="age"
              onChange={handleInfoChange}
              value={userInfo?.age}
              className="user-profile-detail-value-input"
            />
          ) : (
            <p className="user-profile-detail-value">{userInfo?.age}</p>
          )}
        </div>
        <div className="user-profile-detail">
          <p className="user-profile-detail-label">Location</p>
          {editMode ? (
            <input
              type="text"
              name="location"
              onChange={handleInfoChange}
              value={userInfo?.location}
              className="user-profile-detail-value-input"
            />
          ) : (
            <p className="user-profile-detail-value">{userInfo?.location}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfoCard;
