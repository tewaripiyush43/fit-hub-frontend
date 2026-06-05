import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

import ExerciseCard from "./ExerciseCard";
import axios from "axios";

import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
// import { useSelector } from "react-redux";
import { errorPopUp } from "../helpers/errorPopUp";

/* Todays workout eg. if monday back bi, tuesday chest tri */

const Exercises = ({ searchByCarousel }) => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchValue, setSearchValue] = useState(searchByCarousel || "");
  const [suggestion, setSuggestion] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(148);
  const [searchClick, setSearchClick] = useState(false);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const lastSearchTerm = useRef(null);
  const isFirstRender = useRef(true);
  // const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (lastSearchTerm.current !== searchValue) {
          const countRes = await axios.get(
            `${REACT_APP_BASE_URL}/exercise/fetchCount?exercise=${searchValue}`
          );
          setTotalPages(Math.ceil(countRes.data / 9));
          lastSearchTerm.current = searchValue;
        }

        const exercisesRes = await axios.get(
          `${REACT_APP_BASE_URL}/exercise/exercises?exercise=${searchValue}&page=${currentPage}`
        );
        setExercises(exercisesRes.data);
      } catch (err) {
        console.log(err.message);
        setErrorMessage("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchClick]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const searchByCarouselClick = () => {
      setSearchValue(searchByCarousel);
      setSearchClick((prev) => !prev);
      const container = document.querySelector('.search-exercises-component-container');
      if (container) {
        const yOffset = -90; // offset for sticky navigation header
        const y = container.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        window.scrollTo(0, window.scrollY + 500);
      }
    };

    if (searchByCarousel && searchByCarousel.length !== 0) {
      searchByCarouselClick();
    }
  }, [searchByCarousel]);

  useEffect(() => {
    if (errorMessage.length > 0) {
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  const handleInputFocus = useCallback(async () => {
    setDropdownActive(true);
    if (suggestion.length === 0) {
      try {
        const res = await axios.get(`${REACT_APP_BASE_URL}/exercise/fetchnames`);
        setSuggestion(res.data);
      } catch (err) {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
  }, [REACT_APP_BASE_URL, suggestion]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchValue(value);
  }, []);

  const handlePageChange = useCallback((e, value) => {
    setCurrentPage(value);
  }, []);

  const handleSearchBtnClick = useCallback(() => {
    setCurrentPage(1);
    setSearchClick((prev) => !prev);
    setDropdownActive(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") handleSearchBtnClick();
  }, [handleSearchBtnClick]);

  return (
    <div className="search-exercises-component-container">
      <div className="search-exercises">
        <div className="search-bar">
          <div className="exercises-input-with-dropdown">
            <input
              type="text"
              className="exercises-input-search-bar open-input"
              value={searchValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={() => {
                setTimeout(() => {
                  setDropdownActive(false);
                }, 400);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search muscle, body part or exercise..."
            />

            <div
              className={`drop-down ${dropdownActive ? "dropdown-active" : ""}`}
            >
              {suggestion
                ?.filter((item) => {
                  const searchTerm = searchValue.toLocaleLowerCase();
                  const hasItem = item.name.toLocaleLowerCase();
                  return searchTerm && hasItem.includes(searchTerm);
                })
                ?.map(({ _id, name }) => {
                  return (
                    name !== searchValue && (
                      <div
                        key={_id}
                        onClick={() => {
                          setSearchValue(name);
                          handleSearchBtnClick();
                        }}
                        className="drop-down-item"
                      >
                        {name}
                      </div>
                    )
                  );
                })
                ?.slice(0, 10)}
            </div>
          </div>
          <button onClick={handleSearchBtnClick} className="search-button">
            <SearchIcon className="search-icon" />
          </button>
        </div>

        {/* Quick Muscle Filters */}
        <div className="quick-muscle-filters">
          {["Chest", "Back", "Biceps", "Triceps", "Shoulders", "Quads", "Abs", "Cardio"].map((muscle) => {
            const isActive = searchValue.toLowerCase() === muscle.toLowerCase();
            return (
              <button
                key={muscle}
                onClick={() => {
                  setSearchValue(muscle);
                  setCurrentPage(1);
                  setSearchClick(!searchClick);
                }}
                className={`quick-filter-btn ${isActive ? "active" : ""}`}
              >
                {muscle}
              </button>
            );
          })}
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                setCurrentPage(1);
                setSearchClick(!searchClick);
              }}
              className="quick-filter-clear-btn"
            >
              Reset
            </button>
          )}
        </div>
        <div className="exercises">
          {loading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="exercise-card-skeleton">
                <div className="skeleton-img"></div>
                <div className="skeleton-body">
                  <div className="skeleton-info">
                    <div className="skeleton-btn"></div>
                    <div className="skeleton-btn"></div>
                  </div>
                  <div className="skeleton-title"></div>
                </div>
              </div>
            ))
          ) : (
            exercises?.map((exercise) => {
              return (
                <ExerciseCard
                  className="exercise-card"
                  key={exercise._id}
                  exerciseData={exercise}
                  animation={true}
                />
              );
            })
          )}
        </div>
        <Pagination
          page={currentPage}
          className="pagination"
          count={totalPages}
          defaultPage={1}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Exercises;

// async function findSearchResult(req, res, next) {
//   try {
//     let exercise = req.query.exercise;
//     if (exercise.length === 0 || exercise === "all") {
//       const page = req.query.page;
//       const data = await Exercise.find()
//         .skip(9 * (page - 1))
//         .limit(9)
//         .catch((err) => {
//           // console.log(err);
//           throw err;
//         });

//       // console.log(data);
//       return res.json(data);
//     } else {
//       const page = req.query.page;
//       if (exercise.includes("(")) {
//         let i = exercise.indexOf("(");
//         let j = exercise.indexOf(")");
//         exercise =
//           exercise.substr(0, i) +
//           exercise.substr(i + 1, j - i - 1) +
//           exercise.substr(j + 1);
//       }

//       // let exerciseArr = exercise.split(" ");
//       // console.log(exercise);
//       // exercise = exerciseArr.join(".*");

//       const exercises = await Exercise.find({
//         $or: [
//           { name: { $regex: new RegExp(`.*${exercise}.*`, "g") } },
//           { bodyPart: { $regex: new RegExp(`.*${exercise}.*`, "g") } },
//           { target: { $regex: new RegExp(`.*${exercise}.*`, "g") } },
//           { equipment: { $regex: new RegExp(`.*${exercise}.*`, "g") } },
//           {
//             secondaryMuscles: {
//               $elemMatch: {
//                 $regex: new RegExp(`.*${exercise}.*`, "g"),
//               },
//             },
//           },
//         ],
//       })
//         .skip(9 * (page - 1))
//         .limit(9);

//       // console.log("exercises   ", exercises);
//       return res.json(exercises);
//     }
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// }
