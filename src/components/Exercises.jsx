import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

import ExerciseCard from "./ExerciseCard";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { errorPopUp } from "../helpers/errorPopUp";
import { fetchExerciseCount, fetchExercises, fetchExerciseNames } from "../api/exerciseApi";

const POPULAR_CATEGORIES = [
  "Chest",
  "Back",
  "Biceps",
  "Triceps",
  "Shoulders",
  "Quads",
  "Abs",
  "Cardio",
];

const Exercises = ({ searchByCarousel }) => {
  const cleanedSearch = searchByCarousel && searchByCarousel.toLowerCase() !== "all" ? searchByCarousel : "";
  const [searchValue, setSearchValue] = useState(cleanedSearch);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (lastSearchTerm.current !== searchValue) {
          const count = await fetchExerciseCount(searchValue);
          setTotalPages(Math.ceil(count / 9));
          lastSearchTerm.current = searchValue;
        }

        const data = await fetchExercises(searchValue, currentPage);
        setExercises(data || []);
      } catch (err) {
        console.log(err.message);
        setErrorMessage("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchClick]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const searchByCarouselClick = () => {
      const cleanValue = searchByCarousel && searchByCarousel.toLowerCase() !== "all" ? searchByCarousel : "";
      setSearchValue(cleanValue);
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

    if (searchByCarousel && searchByCarousel.toLowerCase() !== "all" && searchByCarousel.length !== 0) {
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
        const data = await fetchExerciseNames();
        setSuggestion(data);
      } catch (err) {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
  }, [suggestion]);

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

  const handleClearSearch = useCallback(() => {
    setSearchValue("");
    setCurrentPage(1);
    setSearchClick((prev) => !prev);
    setDropdownActive(false);
  }, []);

  const handleSelectCategory = useCallback((category) => {
    setSearchValue(category);
    setCurrentPage(1);
    setSearchClick((prev) => !prev);
    setDropdownActive(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") handleSearchBtnClick();
  }, [handleSearchBtnClick]);

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="clear-exercise-search-btn"
              title="Clear search"
              type="button"
            >
              <CloseIcon style={{ fontSize: "1.1rem" }} />
            </button>
          )}

          <button onClick={handleSearchBtnClick} className="search-button" type="button">
            <SearchIcon className="search-icon" />
          </button>
        </div>

        {/* Quick Muscle Filters */}
        <div className="quick-muscle-filters">
          {POPULAR_CATEGORIES.map((muscle) => {
            const isActive = searchValue.toLowerCase() === muscle.toLowerCase();
            return (
              <button
                key={muscle}
                onClick={() => handleSelectCategory(muscle)}
                className={`quick-filter-btn ${isActive ? "active" : ""}`}
                type="button"
              >
                {muscle}
              </button>
            );
          })}
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="quick-filter-clear-btn"
              type="button"
            >
              Reset
            </button>
          )}
        </div>

        {/* Exercises Grid or Graceful Empty State */}
        {loading ? (
          <div className="exercises">
            {Array.from({ length: 9 }).map((_, index) => (
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
            ))}
          </div>
        ) : exercises && exercises.length > 0 ? (
          <>
            <div className="exercises">
              {exercises.map((exercise) => (
                <ExerciseCard
                  className="exercise-card"
                  key={exercise._id}
                  exerciseData={exercise}
                  animation={true}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                className="pagination"
                count={totalPages}
                defaultPage={1}
                onChange={handlePageChange}
                size={isSmallScreen ? "small" : "medium"}
                siblingCount={isSmallScreen ? 0 : 1}
              />
            )}
          </>
        ) : (
          <div className="no-exercises-found-card">
            <div className="no-ex-icon-wrap">
              <FitnessCenterIcon className="no-ex-icon" />
            </div>
            <h3 className="no-ex-title">
              No Exercises Found {searchValue ? `for "${searchValue}"` : ""}
            </h3>
            <p className="no-ex-desc">
              We couldn't find any exercises matching your search. Check for typos, or explore popular targeted muscle groups below.
            </p>

            <div className="no-ex-action-buttons">
              <button
                className="no-ex-reset-btn"
                onClick={handleClearSearch}
                type="button"
              >
                <RestartAltIcon fontSize="small" /> View All Exercises
              </button>
            </div>

            <div className="no-ex-suggestions-wrap">
              <span className="suggestions-label">
                <AutoAwesomeIcon style={{ fontSize: "0.95rem", color: "#00f0ff" }} /> Popular Targets:
              </span>
              <div className="suggestion-pills">
                {POPULAR_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className="suggestion-pill"
                    onClick={() => handleSelectCategory(cat)}
                    type="button"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;
