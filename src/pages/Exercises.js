import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Exercises from "../components/Exercises";

const ExercisesPage = () => {
  const [searchData, setsearchData] = useState("");
  const { search } = useParams();

  // console.log(search);

  useEffect(() => {
    // console.log(search);
    if (search !== "all" || search !== "") setsearchData(search);
    // console.log(searchData);
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
