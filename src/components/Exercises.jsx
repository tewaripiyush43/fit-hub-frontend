import React from "react";
import { useState, useEffect } from "react";

import ExerciseCard from "./ExerciseCard";
import axios from "axios";

import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";

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
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const getNames = async () => {
      await axios
        .get(`${REACT_APP_BASE_URL}/exercise/fetchnames`)
        .then((res) => setSuggestion(res.data))
        .catch((err) => console.log(err.message));
    };

    setInputOpen(false);
    getNames();
  }, []);

  const handleInputChange = (e) => {
    console.log("yo");
    const value = e.target.value;
    setSearchValue(value);
    searchByCarousel = "";
  };

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchSearchResult = async () => {
      await axios
        .get(
          `${REACT_APP_BASE_URL}/exercise/exercises?exercise=${searchValue}&page=${currentPage}`
        )
        .then((res) => {
          setExercises(res.data);
        })
        .catch((err) => console.log(err.message));
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
        .catch((err) => console.log(err.message));
    };

    const fetchSearchResult = async () => {
      await axios
        .get(
          `${REACT_APP_BASE_URL}/exercise/exercises?exercise=${searchValue}&page=${currentPage}`
        )
        .then((res) => setExercises(res.data))
        .catch((err) => console.log(err.message));
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

  const handleSearchBtnClick = (e, value) => {
    if (inputOpen && searchValue.length === 0) {
      setInputOpen(false);
      setSearchClick(!searchClick);
      setDropdownActive(false);
    } else if (inputOpen) {
      setCurrentPage(1);
      setSearchClick(!searchClick);
    } else {
      setInputOpen(true);
    }
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
              className={`exercises-input-search-bar ${
                inputOpen ? "open-input" : ""
              }`}
              value={searchValue}
              onChange={handleInputChange}
              onFocus={() => {
                setDropdownActive(true);
              }}
              onBlur={() => {
                setDropdownActive(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search muscle, bodypart or exercise"
            />

            <div
              className={`drop-down ${dropdownActive ? "dropdown-active" : ""}`}
            >
              {suggestion
                .filter((item) => {
                  const searchTerm = searchValue.toLocaleLowerCase();
                  const hasItem = item.name.toLocaleLowerCase();

                  return searchTerm && hasItem.includes(searchTerm);
                })
                .map(({ _id, name }) => {
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
                .slice(0, 10)}
            </div>
          </div>
          <button onClick={handleSearchBtnClick} className="search-button">
            <SearchIcon className="search-icon" />
          </button>
        </div>
        <div className="exercises">
          {exercises.map((exercise) => {
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
