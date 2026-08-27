import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Exercises from "../components/Exercises";

const ExercisesPage = () => {
  const { search } = useParams();
  const location = useLocation();

  const getTargetQuery = () => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get("search") || queryParams.get("q");
    if (searchParam) return searchParam;
    const target = queryParams.get("target");
    const equipment = queryParams.get("equipment");
    if (target && equipment && equipment !== "all") {
      return `${equipment} ${target}`;
    }
    if (target) return target;
    if (search && search.toLowerCase() !== "all") return search;
    return "";
  };

  const [searchData, setSearchData] = useState(getTargetQuery());

  useEffect(() => {
    setSearchData(getTargetQuery());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, location.search]);

  return (
    <div className="exercise-page-container">
      <Exercises
        searchByCarousel={searchData}
        setSearchByCarousel={setSearchData}
        showAnatomyBanner={false}
      />
    </div>
  );
};

export default ExercisesPage;
