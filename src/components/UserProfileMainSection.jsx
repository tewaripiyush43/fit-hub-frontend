import React from "react";
import MyProfile from "./MyProfile";
import MyWorkouts from "./MyWorkouts";
import MyFavorite from "./MyFavorite";
import ProgressAnalytics from "./ProgressAnalytics";
import Settings from "./Settings";
import FitnessTools from "./FitnessTools";
import PageNotFound from "./PageNotFound";
import TrainingDashboard from "./TrainingDashboard";

import { useParams } from "react-router-dom";

const UserProfileMainSection = () => {
  const { page } = useParams();

  const components = {
    dashboard: <TrainingDashboard />,
    myprofile: <MyProfile />,
    myworkouts: <MyWorkouts />,
    myfavorite: <MyFavorite />,
    analytics: <ProgressAnalytics />,
    fitnesstools: <FitnessTools />,
    settings: <Settings />,
  };

  const pageToDisplay = components[page] || <PageNotFound />;

  return <div className="user-profile-main-section">{pageToDisplay}</div>;
};

export default UserProfileMainSection;

