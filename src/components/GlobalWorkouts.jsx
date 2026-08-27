import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDailyWOD,
  fetchOfficialWorkouts,
  fetchExploreWorkouts,
  cloneWorkout,
} from "../api/workoutApi";
import { portalActions } from "../store/index";
import { toast } from "../helpers/errorPopUp";

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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
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

  // Active View Tab on Mobile & Desktop
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'official' | 'community' | 'wod'
  const [signatureViewMode, setSignatureViewMode] = useState("carousel"); // 'carousel' | 'grid'

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
  const [limit, setLimit] = useState(12);
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
        limit,
      });
      setExploreWorkouts(data.workouts || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.warn("Could not load explore feed:", err);
    } finally {
      setLoadingExplore(false);
    }
  }, [searchTerm, selectedMuscle, selectedDifficulty, sortBy, page, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExplore();
    }, 200);
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

  // Filtered official signatures if searching
  const filteredOfficials = useMemo(() => {
    if (!searchTerm && selectedMuscle === "all" && selectedDifficulty === "all") {
      return officialWorkouts;
    }
    return officialWorkouts.filter((w) => {
      const matchSearch =
        !searchTerm ||
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMuscle =
        selectedMuscle === "all" ||
        w.targetMuscleGroup?.toLowerCase() === selectedMuscle.toLowerCase();
      const matchDiff =
        selectedDifficulty === "all" ||
        w.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
      return matchSearch && matchMuscle && matchDiff;
    });
  }, [officialWorkouts, searchTerm, selectedMuscle, selectedDifficulty]);

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
          Discover FitHub Master Signature Splits, crush today's Workout of the Day, or explore community and AI-generated routines.
        </p>

        {/* Mobile & Tablet Section Switcher Tabs */}
        <div className="global-section-tabs">
          <button
            type="button"
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            ⭐ All Highlights
          </button>
          <button
            type="button"
            className={activeTab === "official" ? "active" : ""}
            onClick={() => setActiveTab("official")}
          >
            🛡️ Master Splits ({officialWorkouts.length})
          </button>
          <button
            type="button"
            className={activeTab === "community" ? "active" : ""}
            onClick={() => setActiveTab("community")}
          >
            🌐 Community & AI ({totalCount})
          </button>
          {dailyWOD && (
            <button
              type="button"
              className={activeTab === "wod" ? "active" : ""}
              onClick={() => setActiveTab("wod")}
            >
              ⚡ Today's WOD
            </button>
          )}
        </div>
      </div>

      {/* 🔍 TOP STICKY SEARCH & FILTERS BAR (Instant Access Without Scrolling) */}
      <div className="top-filter-panel">
        <div className="search-bar-wrap">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search all workouts by name, muscle, tags, or equipment..."
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

        <div className="dropdowns-and-sort">
          <select
            value={selectedMuscle}
            onChange={(e) => {
              setSelectedMuscle(e.target.value);
              setPage(1);
            }}
          >
            {MUSCLE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setPage(1);
            }}
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="popular">🔥 Most Popular</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="newest">🕒 Newest First</option>
            <option value="duration_asc">⏱️ Shortest First</option>
            <option value="duration_desc">⏱️ Longest First</option>
          </select>
        </div>
      </div>

      {/* ⭐ Hero Section: Pinned Workout of the Day (WOD) */}
      {(activeTab === "all" || activeTab === "wod") && (
        <>
          {loadingWOD ? (
            <div className="wod-hero-loading">
              <CircularProgress size={32} style={{ color: "#00f0ff" }} />
              <span>Curating today's Workout of the Day...</span>
            </div>
          ) : dailyWOD ? (
            <div className="wod-hero-card">
              <div className="wod-hero-left">
                <div className="wod-top-meta">
                  <span className="wod-ribbon">
                    <StarIcon style={{ fontSize: "0.95rem" }} /> WORKOUT OF THE DAY
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
                    <span>{isWorkoutSaved(dailyWOD) ? "Saved" : "Save to My Workouts"}</span>
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
        </>
      )}

      {/* 🛡️ Section: FitHub Master Signatures */}
      {(activeTab === "all" || activeTab === "official") && officialWorkouts.length > 0 && (
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

            <div className="view-mode-toggle">
              <button
                type="button"
                className={signatureViewMode === "carousel" ? "active" : ""}
                onClick={() => setSignatureViewMode("carousel")}
                title="Swipeable Carousel View"
              >
                <ViewCarouselIcon style={{ fontSize: "1.1rem" }} />
                <span>Swipe Rail</span>
              </button>
              <button
                type="button"
                className={signatureViewMode === "grid" ? "active" : ""}
                onClick={() => setSignatureViewMode("grid")}
                title="Full Grid View"
              >
                <ViewModuleIcon style={{ fontSize: "1.1rem" }} />
                <span>All Cards</span>
              </button>
            </div>
          </div>

          {/* Swipe Rail or Grid depending on viewMode */}
          <div className={`official-cards-container ${signatureViewMode === "carousel" ? "swipe-rail" : "cards-grid"}`}>
            {filteredOfficials.map((workout) => (
              <div
                key={workout._id}
                className="official-workout-card"
                onClick={() => handleViewWorkout(workout._id)}
              >
                <div className="card-top-row">
                  <span className="official-badge">
                    <VerifiedIcon style={{ fontSize: "0.82rem" }} /> Official
                  </span>
                  <span className="muscle-pill capitalize">
                    {workout.targetMuscleGroup?.replace("_", " ")}
                  </span>
                </div>

                <h4 className="card-title">{workout.name}</h4>
                <p className="card-desc">{workout.description}</p>

                <div className="card-meta-row">
                  <span>⏱️ {workout.estimatedDuration || 45}m</span>
                  <span>🏋️ {workout.exerciseCount || workout.exercises?.length || 0} Ex</span>
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
                    <PlayArrowIcon style={{ fontSize: "0.95rem" }} /> Start
                  </button>
                  <button
                    className={`card-clone-btn ${isWorkoutSaved(workout) ? "saved" : ""}`}
                    onClick={(e) => handleCloneWorkout(e, workout)}
                    disabled={cloningId === workout._id}
                    title={isWorkoutSaved(workout) ? "Already in your library" : "Save to My Workouts"}
                  >
                    {cloningId === workout._id ? (
                      <CircularProgress size={13} color="inherit" />
                    ) : isWorkoutSaved(workout) ? (
                      <BookmarkIcon style={{ fontSize: "0.95rem", color: "#00f0ff" }} />
                    ) : (
                      <BookmarkBorderIcon style={{ fontSize: "0.95rem" }} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🌐 Section: Public & Community Explorer */}
      {(activeTab === "all" || activeTab === "community") && (
        <div className="explore-community-section">
          <div className="section-title-row">
            <div className="section-title-left">
              <LayersIcon className="section-badge-icon community" />
              <div>
                <h3 className="section-heading">Public & AI Community Routines</h3>
                <p className="section-subheading">
                  Showing {exploreWorkouts.length} of {totalCount} routines shared by coaches, community, and AI.
                </p>
              </div>
            </div>
          </div>

          {/* Community Workouts Grid */}
          {loadingExplore ? (
            <div className="explore-loading-state">
              <CircularProgress size={36} style={{ color: "#00f0ff" }} />
              <span>Fetching global routines...</span>
            </div>
          ) : exploreWorkouts.length === 0 ? (
            <div className="explore-empty-state">
              <FitnessCenterIcon style={{ fontSize: "3rem", color: "#64748b" }} />
              <h4>No routines found</h4>
              <p>Try searching for a different muscle, tag, or clearing filters.</p>
              <button
                className="reset-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedMuscle("all");
                  setSelectedDifficulty("all");
                  setPage(1);
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="explore-cards-grid">
              {exploreWorkouts.map((workout) => (
                <div
                  key={workout._id}
                  className="explore-workout-card"
                  onClick={() => handleViewWorkout(workout._id)}
                >
                  <div className="card-top-row">
                    <span className="creator-pill">
                      <PersonIcon style={{ fontSize: "0.85rem" }} />
                      <span>{workout.creatorUsername || workout.creator?.username || "Coach"}</span>
                    </span>
                    <span className="difficulty-pill capitalize">{workout.difficulty || "All"}</span>
                  </div>

                  <h4 className="card-title">{workout.name}</h4>
                  <p className="card-desc">{workout.description || "Balanced hypertrophy and strength routine."}</p>

                  <div className="card-meta-row">
                    <span>⏱️ {workout.estimatedDuration || 45} mins</span>
                    <span>🏋️ {workout.exerciseCount || workout.exercises?.length || 0} Exercises</span>
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
                      title={isWorkoutSaved(workout) ? "Saved in your library" : "Save to My Workouts"}
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
          )}

          {/* 📄 NUMBERED RESPONSIVE PAGINATION BAR */}
          {totalPages > 1 && (
            <div className="responsive-pagination-bar">
              <div className="pagination-info">
                <span>
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total)
                </span>
              </div>

              <div className="pagination-buttons">
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <NavigateBeforeIcon />
                  <span>Prev</span>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`page-num-btn ${page === pageNum ? "active" : ""}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <span>Next</span>
                  <NavigateNextIcon />
                </button>
              </div>

              <div className="page-size-selector">
                <span>Per page:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalWorkouts;
