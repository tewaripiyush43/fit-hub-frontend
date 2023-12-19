import React from "react";
import UserProfileSmallCard from "./UserProfileSmallCard";
import BmiCalculator from "./BmiCalculator";
import MyProfile from "./MyProfile";
import MyWorkouts from "./MyWorkouts";
import MyFavorite from "./MyFavorite";
import Settings from "./Settings";
import PageNotFound from "./PageNotFound";

import { useParams } from "react-router-dom";

const UserProfileMainSection = () => {
  const { username, page } = useParams();

  const components = {
    myprofile: <MyProfile />,
    myworkouts: <MyWorkouts />,
    myfavorite: <MyFavorite />,
    settings: <Settings />,
  };

  const pageToDisplay = components[page] || <PageNotFound />;

  return <div className="user-profile-main-section">{pageToDisplay}</div>;
};

export default UserProfileMainSection;
