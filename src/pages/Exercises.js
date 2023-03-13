import React, { useEffect } from "react";
// import backgroundImg from "../assets/images/anime-girl.jpg";
import Exercises from "../components/Exercises";

import { useParams } from "react-router-dom";
import { useState } from "react";

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
