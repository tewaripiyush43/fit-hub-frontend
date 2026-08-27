import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import ExerciseCard from "./ExerciseCard";
import InteractiveMuscleMap from "./InteractiveMuscleMap";
import Pagination from "@mui/material/Pagination";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

// UI Primitives
import {
  SearchInput,
  Button,
  Badge,
  Skeleton,
  EmptyState,
  ErrorState,
} from "./ui";

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

const Exercises = ({ searchByCarousel, setSearchByCarousel, showAnatomyBanner = false }) => {
  const navigate = useNavigate();
  const cleanedSearch = searchByCarousel && searchByCarousel.toLowerCase() !== "all" ? searchByCarousel : "";
  const [searchValue, setSearchValue] = useState(cleanedSearch);
  const [selectedMuscleId, setSelectedMuscleId] = useState(null);
  const [showAnatomyMap, setShowAnatomyMap] = useState(true);
  const [suggestion, setSuggestion] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(110);
  const [searchClick, setSearchClick] = useState(false);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastSearchTerm = useRef(null);
  const isFirstRender = useRef(true);

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      if (lastSearchTerm.current !== searchValue) {
        const count = await fetchExerciseCount(searchValue);
        setTotalPages(Math.max(1, Math.ceil(count / 12)));
        lastSearchTerm.current = searchValue;
      }

      const data = await fetchExercises(searchValue, currentPage, 12);
      setExercises(data || []);
    } catch (err) {
      console.error(err);
      setFetchError("Unable to load exercises. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  }, [searchValue, currentPage]);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchClick, fetchData]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const searchByCarouselClick = () => {
      const cleanValue = searchByCarousel && searchByCarousel.toLowerCase() !== "all" ? searchByCarousel : "";
      setSearchValue(cleanValue);
      setSearchClick((prev) => !prev);
      const container = document.querySelector(".search-exercises-component-container");
      if (container) {
        const yOffset = -90;
        const y = container.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
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
        console.warn("Failed to load exercise suggestions:", err);
      }
    }
  }, [suggestion]);

  const handleInputChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handlePageChange = useCallback((e, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 400, behavior: "smooth" });
  }, []);

  const handleMuscleSelect = useCallback((muscleId, searchKey) => {
    setSelectedMuscleId(muscleId);
    setSearchValue(searchKey || "");
    setCurrentPage(1);
    setSearchClick((prev) => !prev);
    setDropdownActive(false);
  }, []);

  const handleSearchTrigger = useCallback(() => {
    setCurrentPage(1);
    setSearchClick((prev) => !prev);
    setDropdownActive(false);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSelectedMuscleId(null);
    setSearchValue("");
    setCurrentPage(1);
    setSearchClick((prev) => !prev);
    setDropdownActive(false);
  }, []);

  const handleSelectCategory = useCallback((category) => {
    setSelectedMuscleId(category.toLowerCase());
    setSearchValue(category);
    setCurrentPage(1);
    setSearchClick((prev) => !prev);
    setDropdownActive(false);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSearchTrigger();
    },
    [handleSearchTrigger]
  );

  return (
    <div className="search-exercises-component-container">
      <div className="search-exercises">
        {!showAnatomyBanner && (
          <div className="search-header" style={{ marginBottom: "20px" }}>
            <p className="search-eyebrow">EXERCISE REPOSITORY</p>
            <h1 className="search-heading" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900 }}>
              Movement & Form <span>Library</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto 16px", lineHeight: "1.5" }}>
              Explore 1,300+ exercises with animated execution guides, target muscle tags, and one-tap custom routine logging.
            </p>
          </div>
        )}

        {/* Anatomy Explorer Launcher or Collapsible Banner */}
        {showAnatomyBanner ? (
          <div className="anatomy-map-toggle-section">
            <button
              type="button"
              className={`btn-anatomy-toggle ${showAnatomyMap ? "active" : ""}`}
              onClick={() => setShowAnatomyMap((prev) => !prev)}
            >
              <div className="btn-toggle-left">
                <AccessibilityNewIcon className="icon-anatomy" />
                <span>Interactive 2D Muscle Anatomy Map</span>
              </div>
              <div className="btn-toggle-right">
                {selectedMuscleId && (
                  <Badge variant="accent" size="sm">
                    Target: {selectedMuscleId.toUpperCase()}
                  </Badge>
                )}
                {showAnatomyMap ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
            </button>

            {showAnatomyMap && (
              <div className="anatomy-map-collapse-wrapper">
                <InteractiveMuscleMap
                  selectedMuscleId={selectedMuscleId}
                  onSelectMuscle={handleMuscleSelect}
                  mode="filter"
                  title="Visual Muscle Anatomy Filter"
                  subtitle="Click any muscle group on the 2D mannequin to instantly discover targeted exercises"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="anatomy-launcher-pill-wrap" style={{ margin: "0 auto 1.5rem", textAlign: "center" }}>
            <button
              type="button"
              onClick={() => navigate("/anatomy")}
              className="anatomy-launcher-pill"
              style={{
                background: "linear-gradient(135deg, rgba(0, 229, 255, 0.12), rgba(59, 130, 246, 0.15))",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                color: "var(--accent)",
                fontSize: "0.82rem",
                fontWeight: 700,
                padding: "0.55rem 1.25rem",
                borderRadius: "9999px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 0 16px rgba(0, 229, 255, 0.15)",
                transition: "all 0.2s ease",
              }}
            >
              <AccessibilityNewIcon style={{ fontSize: "1.1rem" }} />
              <span>Explore Interactive 2D Muscle Anatomy Map</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>➔</span>
            </button>
          </div>
        )}

        {/* Search Bar with Autocomplete */}
        <div className="search-bar" style={{ position: "relative" }}>
          <div className="exercises-input-with-dropdown" style={{ width: "100%" }}>
            <SearchInput
              value={searchValue}
              onChange={handleInputChange}
              onClear={handleClearSearch}
              onFocus={handleInputFocus}
              onBlur={() => {
                setTimeout(() => setDropdownActive(false), 300);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search by muscle, body part or exercise name..."
            />

            {dropdownActive && suggestion.length > 0 && (
              <div className="drop-down dropdown-active">
                {suggestion
                  .filter((item) => {
                    const term = searchValue.toLowerCase();
                    const hasItem = item.name.toLowerCase();
                    return term && hasItem.includes(term);
                  })
                  .slice(0, 8)
                  .map(({ _id, name }) => (
                    <div
                      key={_id}
                      onClick={() => {
                        setSearchValue(name);
                        handleSearchTrigger();
                      }}
                      className="drop-down-item"
                    >
                      {name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <Button
            variant="accent"
            size="md"
            onClick={handleSearchTrigger}
            className="search-submit-btn"
            style={{ marginLeft: "8px", borderRadius: "var(--radius-full)" }}
          >
            Search
          </Button>
        </div>

        {/* Quick Muscle Category Filters (Horizontal scroll on mobile) */}
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
              Reset Filter
            </button>
          )}
        </div>

        {/* Error State */}
        {fetchError && !loading && (
          <ErrorState
            title="Failed to Load Exercises"
            message={fetchError}
            onRetry={fetchData}
            retryText="Retry Search"
          />
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="exercises">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="exercise-card"
                className="exercise-card-skeleton-primitive"
              />
            ))}
          </div>
        )}

        {/* Populated Exercises Grid */}
        {!loading && !fetchError && exercises && exercises.length > 0 && (
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
              <div className="exercises-pagination-container">
                <Pagination
                  page={currentPage}
                  className="pagination"
                  count={totalPages}
                  defaultPage={1}
                  onChange={handlePageChange}
                  size={isSmallScreen ? "small" : "medium"}
                  siblingCount={isSmallScreen ? 0 : 1}
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !fetchError && (!exercises || exercises.length === 0) && (
          <EmptyState
            title={`No Exercises Found${searchValue ? ` for "${searchValue}"` : ""}`}
            description="We couldn't find any exercises matching your filter. Check your spelling or choose a popular muscle group below."
            action={
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
                <Button variant="primary" size="md" onClick={handleClearSearch}>
                  View All Exercises
                </Button>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                  {POPULAR_CATEGORIES.slice(0, 5).map((cat) => (
                    <Badge
                      key={cat}
                      variant="neutral"
                      size="md"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectCategory(cat)}
                    >
                      <AutoAwesomeIcon style={{ fontSize: "0.8rem", marginRight: "3px" }} /> {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

Exercises.propTypes = {
  searchByCarousel: PropTypes.string,
  setSearchByCarousel: PropTypes.func,
  showAnatomyBanner: PropTypes.bool,
};

export default Exercises;
