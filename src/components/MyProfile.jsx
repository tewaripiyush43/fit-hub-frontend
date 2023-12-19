import React from "react";
import UserProfileInfoCard from "./UserProfileInfoCard";

import GoalComponent from "./GoalComponent";
import WorkoutsSmallComponent from "./WorkoutsSmallComponent";
import BmiCalculator from "./BmiCalculator";

const MyProfile = () => {
  return (
    <div className="my-profile-container">
      <div className="user-profile-info-card-container">
        <UserProfileInfoCard />
      </div>
      <div className="user-profile-small-card-container">
        <GoalComponent />
        <WorkoutsSmallComponent />
      </div>
    </div>
  );
};

export default MyProfile;
