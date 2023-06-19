import React from "react";
// import { Avatar, Typography } from "@material-ui/core";
// import { FitnessCenter } from "@material-ui/icons";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const user = useSelector((state) => state.user);
  console.log(user);
  //   const { name, profilePhotoUrl, workouts, favoriteExercises } = user;

  return (
    <div className="container">
      {/* Other common profile page information */}
    </div>
  );
};

export default UserProfile;
