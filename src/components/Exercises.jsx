import React from "react";
import { useState, useEffect } from "react";

import ExerciseCard from "./ExerciseCard";
import axios from "axios";

import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
// import { useSelector } from "react-redux";
import { errorPopUp } from "../helpers/errorPopUp";

/* Todays workout eg. if monday back bi, tuesday chest tri */

const Exercises = ({ searchByCarousel }) => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchValue, setSearchValue] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(148);
  const [searchClick, setSearchClick] = useState(false);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const getNames = async () => {
      await axios
        .get(`${REACT_APP_BASE_URL}/exercise/fetchnames`)
        .then((res) => setSuggestion(res.data))
        .catch((err) => {
          // console.log(err.message)
          setErrorMessage("Something went wrong. Please try again later.");
        });
    };

    setInputOpen(false);
    getNames();
  }, []);

  useEffect(() => {
    const fetchSearchResult = async () => {
      await axios
        .get(
          `${REACT_APP_BASE_URL}/exercise/exercises?exercise=${searchValue}&page=${currentPage}`
        )
        .then((res) => {
          setExercises(res.data);
        })
        .catch((err) => {
          // console.log(err.message);
          setErrorMessage("Something went wrong. Please try again later.");
        });
    };
    fetchSearchResult();
  }, [currentPage]);

  useEffect(() => {
    const fetchCount = async () => {
      await axios
        .get(
          `${REACT_APP_BASE_URL}/exercise/fetchCount?exercise=${searchValue}`
        )
        .then((res) => setTotalPages(Math.ceil(res.data / 9)))
        .catch((err) => {
          console.log(err.message);
          setErrorMessage("Something went wrong. Please try again later.");
        });
    };

    const fetchSearchResult = async () => {
      await axios
        .get(
          `${REACT_APP_BASE_URL}/exercise/exercises?exercise=${searchValue}&page=${currentPage}`
        )
        .then((res) => setExercises(res.data))
        .catch((err) => {
          console.log(err.message);
          setErrorMessage("Something went wrong. Please try again later.");
        });
    };

    fetchCount();
    fetchSearchResult();
  }, [searchClick]);

  useEffect(() => {
    const searchByCarouselClick = () => {
      setSearchValue(searchByCarousel);
      setSearchClick(!searchClick);
      window.scrollTo(0, window.scrollY + 400);
    };

    if (searchByCarousel.length !== 0) {
      setInputOpen(true);
      searchByCarouselClick();
    }
  }, [searchByCarousel]);

  useEffect(() => {
    if (errorMessage.length > 0) {
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  const handleInputChange = (e) => {
    // console.log("yo");
    const value = e.target.value;
    setSearchValue(value);
    searchByCarousel = "";
  };

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const handleSearchBtnClick = (e, value) => {
    setCurrentPage(1);
    setSearchClick(!searchClick);
    setDropdownActive(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearchBtnClick();
  };

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
              onFocus={() => {
                setDropdownActive(true);
              }}
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
          {exercises?.map((exercise) => {
            return (
              <ExerciseCard
                className="exercise-card"
                key={exercise._id}
                exerciseData={exercise}
                animation={true}
              />
            );
          })}
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
