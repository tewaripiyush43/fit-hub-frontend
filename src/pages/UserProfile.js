import React from "react";
import UserProfileSideBar from "../components/UserProfileSideBar";
import UserProfileMainSection from "../components/UserProfileMainSection";

const UserProfile = () => {
  return (
    <div className="user-profile-page">
      <UserProfileSideBar />
      <UserProfileMainSection />
    </div>
  );
};

export default UserProfile;
