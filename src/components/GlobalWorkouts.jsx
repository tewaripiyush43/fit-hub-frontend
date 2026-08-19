import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDailyWOD,
  fetchOfficialWorkouts,
  fetchExploreWorkouts,
  cloneWorkout,
} from "../api/workoutApi";
import { portalActions } from "../store/index";
import { toast } from "react-toastify";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LayersIcon from "@mui/icons-material/Layers";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";

import "../styles/_globalWorkouts.scss";

const MUSCLE_FILTER_OPTIONS = [
  { id: "all", label: "All Muscles" },
  { id: "chest", label: "Chest / Push" },
  { id: "back", label: "Back / Pull" },
  { id: "legs", label: "Legs / Lower" },
  { id: "shoulders", label: "Shoulders" },
  { id: "arms", label: "Arms" },
  { id: "core", label: "Core & Abs" },
  { id: "full_body", label: "Full Body" },
];

const DIFFICULTY_OPTIONS = [
  { id: "all", label: "All Levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const GlobalWorkouts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // States
  const [dailyWOD, setDailyWOD] = useState(null);
  const [officialWorkouts, setOfficialWorkouts] = useState([]);
  const [exploreWorkouts, setExploreWorkouts] = useState([]);
  const [loadingWOD, setLoadingWOD] = useState(true);
  const [loadingExplore, setLoadingExplore] = useState(true);
  const [cloningId, setCloningId] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load WOD & Official Workouts
  useEffect(() => {
    const loadWODAndOfficials = async () => {
      setLoadingWOD(true);
      try {
        const [wodData, officialData] = await Promise.all([
          fetchDailyWOD(),
          fetchOfficialWorkouts(),
        ]);
        setDailyWOD(wodData);
        setOfficialWorkouts(officialData || []);
      } catch (err) {
        console.warn("Could not load WOD/Official workouts:", err);
      } finally {
        setLoadingWOD(false);
      }
    };
    loadWODAndOfficials();
  }, []);

  // Load Explore Feed
  const loadExplore = useCallback(async () => {
    setLoadingExplore(true);
    try {
      const data = await fetchExploreWorkouts({
        search: searchTerm,
        muscle: selectedMuscle,
        difficulty: selectedDifficulty,
        sort: sortBy,
        page,
        limit: 12,
      });
      setExploreWorkouts(data.workouts || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.warn("Could not load explore feed:", err);
    } finally {
      setLoadingExplore(false);
    }
  }, [searchTerm, selectedMuscle, selectedDifficulty, sortBy, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExplore();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadExplore]);

  // Clone Workout Action
  const handleCloneWorkout = async (e, workout) => {
    e.stopPropagation();
    if (!isLoggedIn || !user) {
      dispatch(portalActions.setPortalOpen());
      toast.info("Please log in or sign up to save this routine to your library!");
      return;
    }

    setCloningId(workout._id);
    try {
      const clonedId = await cloneWorkout(dispatch, workout._id);
      if (clonedId) {
        toast.success(`"${workout.name}" copied to your workouts!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to copy workout.");
    } finally {
      setCloningId(null);
    }
  };

  const handleStartWorkout = (workoutId) => {
    if (!isLoggedIn || !user) {
      dispatch(portalActions.setPortalOpen());
      toast.info("Please log in or sign up to track and log your live workout sessions!");
      return;
    }
    navigate(`/workout/${workoutId}/session`);
  };

  const handleViewWorkout = (workoutId) => {
    navigate(`/workout/${workoutId}`);
  };

  const isWorkoutSaved = (workout) => {
    if (!workout || !user) return false;
    const cleanName = (workout.name || "").toLowerCase().trim();
    return Boolean(
      user?.workouts?.some(
        (w) =>
          w._id === workout._id ||
          (w.name && w.name.toLowerCase().replace(/ \(copy\)$/i, "").trim() === cleanName)
      )
    );
  };

  const getWODDayName = () => {
    const days = [
      "Sunday Active Recovery",
      "Monday Heavy Push",
      "Tuesday Pull Engine",
      "Wednesday Quad Dominance",
      "Thursday 3D Delts & Core",
      "Friday Posterior Chain",
      "Saturday Full Body Conditioning",
    ];
    return days[new Date().getDay()];
  };

  return (
    <div className="global-workouts-container">
      {/* Header Section */}
      <div className="global-workouts-header">
        <div className="header-badge">
          <StarIcon className="badge-star" />
          <span>EXPLORE GLOBAL WORKOUTS</span>
        </div>
        <h1 className="global-title">Train Smarter with Master Splits & Daily WOD</h1>
        <p className="global-subtitle">
          Experience 10 FitHub Master Signature Workouts, crush today's featured Workout of the Day, or discover routines created by the community and AI.
        </p>
      </div>

      {/* ⭐ Hero Section: Pinned Workout of the Day (WOD) */}
      {loadingWOD ? (
        <div className="wod-hero-loading">
          <CircularProgress size={36} style={{ color: "#00f0ff" }} />
          <span>Curating today's Workout of the Day...</span>
        </div>
      ) : dailyWOD ? (
        <div className="wod-hero-card">
          <div className="wod-hero-left">
            <div className="wod-top-meta">
              <span className="wod-ribbon">
                <StarIcon style={{ fontSize: "1rem" }} /> WORKOUT OF THE DAY
              </span>
              <span className="wod-day-pill">⚡ {getWODDayName()}</span>
            </div>

            <h2 className="wod-title" onClick={() => handleViewWorkout(dailyWOD._id)}>
              {dailyWOD.name}
            </h2>
            <p className="wod-desc">{dailyWOD.description}</p>

            <div className="wod-stats-row">
              <div className="stat-item">
                <AccessTimeIcon className="stat-icon" />
                <span>{dailyWOD.estimatedDuration || 45} mins</span>
              </div>
              <div className="stat-item">
                <LayersIcon className="stat-icon" />
                <span>{dailyWOD.exerciseCount || dailyWOD.exercises?.length || 0} Exercises</span>
              </div>
              <div className="stat-item capitalize">
                <WhatshotIcon className="stat-icon" />
                <span>{dailyWOD.difficulty || "Intermediate"}</span>
              </div>
              <div className="stat-item capitalize">
                <FitnessCenterIcon className="stat-icon" />
                <span>{dailyWOD.targetMuscleGroup?.replace("_", " ") || "Full Body"}</span>
              </div>
            </div>

            {/* Exercise Preview Badges */}
            <div className="wod-exercises-preview">
              <span className="preview-label">Includes:</span>
              <div className="preview-chips-wrap">
                {(dailyWOD.exercises || []).slice(0, 4).map((ex, idx) => (
                  <span key={idx} className="preview-chip">
                    {ex.name || ex}
                  </span>
                ))}
                {(dailyWOD.exercises || []).length > 4 && (
                  <span className="preview-chip more">
                    +{(dailyWOD.exercises || []).length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Hero Action Buttons */}
            <div className="wod-actions-row">
              <button
                className="wod-start-btn"
                onClick={() => handleStartWorkout(dailyWOD._id)}
              >
                <PlayArrowIcon /> Start Today's WOD
              </button>
              <button
                className="wod-view-btn"
                onClick={() => handleViewWorkout(dailyWOD._id)}
                title="View full routine breakdown & exercises"
              >
                <VisibilityIcon /> View Exercises
              </button>
              <button
                className={`wod-clone-btn ${isWorkoutSaved(dailyWOD) ? "saved" : ""}`}
                onClick={(e) => handleCloneWorkout(e, dailyWOD)}
                disabled={cloningId === dailyWOD._id}
              >
                {cloningId === dailyWOD._id ? (
                  <CircularProgress size={16} color="inherit" />
                ) : isWorkoutSaved(dailyWOD) ? (
                  <BookmarkIcon style={{ color: "#00f0ff" }} />
                ) : (
                  <BookmarkBorderIcon />
                )}
                <span>{isWorkoutSaved(dailyWOD) ? "Saved in Library" : "Save to My Workouts"}</span>
              </button>
            </div>
          </div>

          <div className="wod-hero-right">
            <div className="wod-graphic-badge">
              <VerifiedIcon className="graphic-icon" />
              <div className="graphic-text">
                <strong>FitHub Verified</strong>
                <span>Periodized Split</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 🛡️ Section: 10 Official FitHub Master Signatures */}
      {officialWorkouts && officialWorkouts.length > 0 && (
        <div className="official-signatures-section">
          <div className="section-title-row">
            <div className="section-title-left">
              <VerifiedIcon className="section-badge-icon" />
              <div>
                <h3 className="section-heading">FitHub Master Signature Splits</h3>
                <p className="section-subheading">
                  10 scientifically structured master routines with balanced volume and optimal exercise sequencing.
                </p>
              </div>
            </div>
          </div>

          <div className="official-cards-grid">
            {officialWorkouts.map((workout) => (
              <div
                key={workout._id}
                className="official-workout-card"
                onClick={() => handleViewWorkout(workout._id)}
              >
                <div className="card-top-row">
                  <span className="official-badge">
                    <VerifiedIcon style={{ fontSize: "0.85rem" }} /> Official
                  </span>
                  <span className="muscle-pill capitalize">
                    {workout.targetMuscleGroup?.replace("_", " ")}
                  </span>
                </div>

                <h4 className="card-title">{workout.name}</h4>
                <p className="card-desc">{workout.description}</p>

                <div className="card-meta-row">
                  <span>⏱️ {workout.estimatedDuration || 45}m</span>
                  <span>🏋️ {workout.exerciseCount || workout.exercises?.length || 0} Exercises</span>
                  <span className="capitalize">⚡ {workout.difficulty}</span>
                </div>

                <div className="card-actions-row">
                  <button
                    className="card-start-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartWorkout(workout._id);
                    }}
                  >
                    <PlayArrowIcon style={{ fontSize: "1rem" }} /> Start
                  </button>
                  <button
                    className={`card-clone-btn ${isWorkoutSaved(workout) ? "saved" : ""}`}
                    onClick={(e) => handleCloneWorkout(e, workout)}
                    disabled={cloningId === workout._id}
                    title={isWorkoutSaved(workout) ? "Already in your library" : "Save to My Workouts"}
                  >
                    {cloningId === workout._id ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : isWorkoutSaved(workout) ? (
                      <BookmarkIcon style={{ fontSize: "1rem", color: "#00f0ff" }} />
                    ) : (
                      <BookmarkBorderIcon style={{ fontSize: "1rem" }} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🌐 Section: Public & Community Explorer */}
      <div className="explore-community-section">
        <div className="section-title-row">
          <div className="section-title-left">
            <LayersIcon className="section-badge-icon community" />
            <div>
              <h3 className="section-heading">Explore All Public & AI Routines</h3>
              <p className="section-subheading">
                {totalCount} public routines shared by coaches, community members, and AI.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="explore-filter-controls">
          {/* Search Input */}
          <div className="search-bar-wrap">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search routines by name, muscle, or tags (e.g. Dumbbell, Hypertrophy)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => {
                  setSearchTerm("");
                  setPage(1);
                }}
              >
                <ClearIcon style={{ fontSize: "1rem" }} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown-wrap">
            <label>Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <option value="popular">Most Popular (Saved)</option>
              <option value="newest">Newest First</option>
              <option value="official">Official First</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>
        </div>

        {/* Muscle Filter Chips */}
        <div className="filter-chips-scroll">
          {MUSCLE_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`filter-chip ${selectedMuscle === opt.id ? "active" : ""}`}
              onClick={() => {
                setSelectedMuscle(opt.id);
                setPage(1);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filter Chips */}
        <div className="filter-chips-sub-row">
          <span className="filter-label">Difficulty:</span>
          {DIFFICULTY_OPTIONS.map((diff) => (
            <button
              key={diff.id}
              className={`sub-filter-chip ${selectedDifficulty === diff.id ? "active" : ""}`}
              onClick={() => {
                setSelectedDifficulty(diff.id);
                setPage(1);
              }}
            >
              {diff.label}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {loadingExplore ? (
          <div className="explore-loading-grid">
            <CircularProgress size={32} style={{ color: "#00f0ff" }} />
            <span>Discovering workouts...</span>
          </div>
        ) : (() => {
          const communityWorkouts = exploreWorkouts.filter((w) => !w.isOfficial);
          if (communityWorkouts.length === 0) {
            return (
              <div className="no-explore-found-card">
                <FitnessCenterIcon className="no-results-icon" />
                <h4>No community routines found</h4>
                <p>Try clearing your search query or generate a custom routine with AI.</p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedMuscle("all");
                    setSelectedDifficulty("all");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            );
          }

          return (
            <div className="explore-workouts-grid">
              {communityWorkouts.map((workout) => {
                const isOfficial = workout.isOfficial;
                return (
                  <div
                    key={workout._id}
                    className={`explore-card ${isOfficial ? "official-border" : ""}`}
                    onClick={() => handleViewWorkout(workout._id)}
                  >
                  <div className="explore-card-top">
                    {isOfficial ? (
                      <span className="card-badge official">
                        <VerifiedIcon style={{ fontSize: "0.8rem" }} /> Official
                      </span>
                    ) : workout.createdBy ? (
                      <div className="card-author">
                        {workout.createdBy.profilePictureURL ? (
                          <img
                            src={workout.createdBy.profilePictureURL}
                            alt=""
                            className="author-avatar"
                          />
                        ) : (
                          <PersonIcon className="author-icon" />
                        )}
                        <span className="author-name">
                          {workout.createdBy.username || "FitHub Member"}
                        </span>
                      </div>
                    ) : (
                      <span className="card-badge ai">⚡ AI Generated</span>
                    )}

                    <span className="card-muscle-tag capitalize">
                      {workout.targetMuscleGroup?.replace("_", " ") || "Full Body"}
                    </span>
                  </div>

                  <h4 className="explore-card-title">{workout.name}</h4>
                  <p className="explore-card-desc">{workout.description || "Custom training routine."}</p>

                  {/* Tags */}
                  {workout.tags && workout.tags.length > 0 && (
                    <div className="card-tags-list">
                      {workout.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="mini-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="explore-card-stats">
                    <span>⏱️ {workout.estimatedDuration || 45}m</span>
                    <span>🏋️ {workout.exerciseCount || workout.exercises?.length || 0} Ex.</span>
                    <span className="capitalize">⚡ {workout.difficulty || "Intermediate"}</span>
                  </div>

                  <div className="explore-card-footer">
                    <span className="card-saves-count">
                      💾 {workout.clonesCount || 0} saves
                    </span>
                    <div className="card-action-btns">
                      <button
                        className={`quick-clone-btn ${isWorkoutSaved(workout) ? "saved" : ""}`}
                        onClick={(e) => handleCloneWorkout(e, workout)}
                        disabled={cloningId === workout._id}
                        title={isWorkoutSaved(workout) ? "Already in your library" : "Save to My Workouts"}
                      >
                        {cloningId === workout._id ? (
                          <CircularProgress size={14} color="inherit" />
                        ) : isWorkoutSaved(workout) ? (
                          <BookmarkIcon fontSize="small" style={{ color: "#00f0ff" }} />
                        ) : (
                          <BookmarkBorderIcon fontSize="small" />
                        )}
                      </button>
                      <button
                        className="quick-start-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartWorkout(workout._id);
                        }}
                      >
                        <PlayArrowIcon fontSize="small" /> Start
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="explore-pagination-bar">
            <button
              className="page-nav-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </button>
            <span className="page-indicator">
              Page {page} of {totalPages}
            </span>
            <button
              className="page-nav-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalWorkouts;
