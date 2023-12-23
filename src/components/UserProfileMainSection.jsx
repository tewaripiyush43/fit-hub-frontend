import React from "react";
import MyProfile from "./MyProfile";
import MyWorkouts from "./MyWorkouts";
import MyFavorite from "./MyFavorite";
import PageNotFound from "./PageNotFound";

import { useParams } from "react-router-dom";

const UserProfileMainSection = () => {
  const { page } = useParams();

  const components = {
    myprofile: <MyProfile />,
    myworkouts: <MyWorkouts />,
    myfavorite: <MyFavorite />,
  };

  const pageToDisplay = components[page] || <PageNotFound />;

  return <div className="user-profile-main-section">{pageToDisplay}</div>;
};

export default UserProfileMainSection;
