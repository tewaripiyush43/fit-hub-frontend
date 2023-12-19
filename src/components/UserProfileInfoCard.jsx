import React, { useState, useEffect, useRef } from "react";
import profilePicture from "../assets/images/home-img-7.jpg";
import EditIcon from "@mui/icons-material/Edit";

const UserProfileInfoCard = () => {
  const textareaRef = useRef(null);
  const [userInfo, setUserInfo] = useState({
    bio: `Welcome to my world of fitness and adventure! 🏋️‍♂️🌎 Follow me on my journey as I explore new heights and push my limits. I explore new heights and push my limits.`,
    location: "city, state",
    age: "21",
  });

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

  useEffect(() => {
    if (editMode) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editMode]);

  return (
    <div className="user-profile-info-card">
      <div
        onClick={() => setEditMode((prev) => !prev)}
        className="edit-icon-container"
      >
        {editMode ? (
          <button title="Save Info" className="save-info-btn">
            Save
          </button>
        ) : (
          <EditIcon title="Edit Profile" className="edit-icon" />
        )}
      </div>
      <div className="profile-header">
        <div className="profile-picture-container">
          <img src={profilePicture} alt="Profile" className="profile-picture" />
        </div>
        <div className="user-info">
          <h1 className="username">@flexhub</h1>
          <p className="joined-on">Joined On: 9/23/23</p>
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
            value={userInfo.bio}
            onChange={handleInfoChange}
          />
        </div>
      ) : (
        <div className="user-bio">
          <p className="user-bio-textarea">{userInfo.bio}</p>
        </div>
      )}

      <div className="user-details">
        <div className="user-profile-detail">
          <p className="user-profile-detail-label">Name</p>
          <p className="user-profile-detail-value">Piyush Tewari</p>
        </div>
        <div className="user-profile-detail">
          <p className="user-profile-detail-label ">Age</p>
          <p
            contentEditable={editMode}
            className={`user-profile-detail-value ${
              editMode ? "editable" : ""
            }`}
            name="age"
            onChange={handleInfoChange}
          >
            {userInfo.age}
          </p>
        </div>
        <div className="user-profile-detail">
          <p className="user-profile-detail-label">Location</p>
          <p
            contentEditable={editMode}
            className={`user-profile-detail-value ${
              editMode ? "editable" : ""
            }`}
            name="location"
            onChange={handleInfoChange}
          >
            {userInfo.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfoCard;
