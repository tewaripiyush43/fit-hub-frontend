import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Exercises from "../components/Exercises";

const ExercisesPage = () => {
  const [searchData, setsearchData] = useState("");
  const { search } = useParams();

  useEffect(() => {
    if (search !== "all" || search !== "") setsearchData(search);
  }, [search]);

  return (
    <div className="exercise-page-container">
      <div className="today-workout-container"></div>
      <Exercises
        setSearchByCarousel={searchData}
        searchByCarousel={searchData}
      />
      <div></div>
    </div>
  );
};

export default ExercisesPage;
