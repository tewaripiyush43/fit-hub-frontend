import React from "react";
import profilePicture from "../assets/images/home-img-7.jpg";
import { useSelector } from "react-redux";

const UserProfileInfoCard = () => {
  const user = useSelector((state) => state.auth.user);

  const bioText = user?.bio || "Welcome to my world of fitness and adventure! 🏋️‍♂️ Follow me on my journey as I explore new heights and push my limits.";
  const locationText = user?.location || "Home Sweet Home, Earth";
  const ageText = user?.age !== undefined && user?.age !== null ? user?.age : "N/A";
  const nameText = user?.fullname || "Fit Hub";

  return (
    <div className="user-profile-info-card">
      <div className="profile-header">
        <div className="profile-picture-container">
          <img src={profilePicture} alt="Profile" className="profile-picture" />
        </div>
        <div className="user-info">
          <h1 className="username">@{user?.username}</h1>
          <p className="joined-on">
            Joined On: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
          </p>
        </div>
      </div>

      <div className="user-bio">
        <p className="user-bio-textarea">{bioText}</p>
      </div>

      <div className="user-details">
        <div className="user-profile-detail">
          <p className="user-profile-detail-label">Name</p>
          <p className="user-profile-detail-value">{nameText}</p>
        </div>
        <div className="user-profile-detail">
          <p className="user-profile-detail-label">Age</p>
          <p className="user-profile-detail-value">{ageText}</p>
        </div>
        <div className="user-profile-detail">
          <p className="user-profile-detail-label">Location</p>
          <p className="user-profile-detail-value">{locationText}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfoCard;
