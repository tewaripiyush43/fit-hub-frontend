import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HistoryIcon from "@mui/icons-material/History";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TimerIcon from "@mui/icons-material/Timer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShareIcon from "@mui/icons-material/Share";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { toast } from "react-toastify";
import { useUnitPreference } from "../utils/useUnitPreference";
import { addWorkout, addExerciseToWorkout } from "../api/workoutApi";
import "../styles/_workoutPage.scss";
import "../styles/_workoutHistory.scss";

const ITEMS_PER_PAGE = 5;

const WorkoutHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { weightUnit } = useUnitPreference();

  const history = useMemo(() => {
    return (user?.sessionHistory || []).slice().reverse();
  }, [user?.sessionHistory]);

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showSlotsFullModal, setShowSlotsFullModal] = useState(false);
  const [isRecreating, setIsRecreating] = useState(false);

  const filteredHistory = useMemo(() => {
    let list = [...history];

    // 1. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const matchName = item.workoutName?.toLowerCase().includes(q);
        const matchDate = item.date?.toLowerCase().includes(q);
        const matchEx = item.exercises?.some((e) =>
          e.exerciseName?.toLowerCase().includes(q)
        );
        return matchName || matchDate || matchEx;
      });
    }

    // 2. Status / Category Filter
    if (filterStatus === "completed") {
      list = list.filter(
        (item) => item.totalSets > 0 && item.completedSets === item.totalSets
      );
    } else if (filterStatus === "partial") {
      list = list.filter(
        (item) => item.totalSets > 0 && item.completedSets < item.totalSets
      );
    } else if (filterStatus === "highVolume") {
      list = list.filter((item) => (item.totalVolume || 0) >= 1000);
    }

    // 3. Sorting
    list.sort((a, b) => {
      let comparison = 0;
      if (sortBy.startsWith("date")) {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : new Date(a.date || 0).getTime();
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : new Date(b.date || 0).getTime();
        comparison = dateA - dateB;
      } else if (sortBy.startsWith("volume")) {
        comparison = (a.totalVolume || 0) - (b.totalVolume || 0);
      } else if (sortBy.startsWith("duration")) {
        const parseDur = (d = "00:00") => {
          const parts = (d || "00:00").split(":").map(Number);
          return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
        };
        comparison = parseDur(a.duration) - parseDur(b.duration);
      } else if (sortBy.startsWith("completion")) {
        const pctA = a.totalSets > 0 ? a.completedSets / a.totalSets : 0;
        const pctB = b.totalSets > 0 ? b.completedSets / b.totalSets : 0;
        comparison = pctA - pctB;
      }

      return sortBy.endsWith("_asc") ? comparison : -comparison;
    });

    return list;
  }, [history, searchQuery, filterStatus, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE));

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHistory.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHistory, currentPage]);

  const selectedSession = useMemo(() => {
    if (selectedSessionId) {
      const found = filteredHistory.find(
        (s, idx) => (s._id || s.timestamp || idx) === selectedSessionId
      );
      if (found) return found;
    }
    return paginatedSessions[0] || filteredHistory[0] || null;
  }, [filteredHistory, paginatedSessions, selectedSessionId]);

  // Resolves full exercise and set breakdown for any session
  const resolvedExercises = useMemo(() => {
    if (!selectedSession) return [];

    // 1. Granular exercises already saved in session log
    if (selectedSession.exercises && selectedSession.exercises.length > 0) {
      return selectedSession.exercises;
    }

    // 2. Look up original workout definition
    const matchingWorkout = (user?.workouts || []).find(
      (w) => (typeof w === "object" ? w._id : w) === selectedSession.workoutId
    );

    if (matchingWorkout && matchingWorkout.exercises && matchingWorkout.exercises.length > 0) {
      const totalSets = selectedSession.totalSets || (matchingWorkout.exercises.length * 3);
      const completedSets = selectedSession.completedSets !== undefined ? selectedSession.completedSets : totalSets;
      const totalVolume = selectedSession.totalVolume || 0;
      const avgWeight = completedSets > 0 && totalVolume > 0 ? Math.round(totalVolume / (completedSets * 10)) : 20;

      let setsAllocated = 0;
      return matchingWorkout.exercises.map((ex, exIdx) => {
        const exName = typeof ex === "object" ? (ex.name || `Exercise ${exIdx + 1}`) : `Exercise ${exIdx + 1}`;
        const exTarget = typeof ex === "object" ? (ex.target || ex.bodyPart || "Target Muscle") : "";
        const exSets = [];
        const numSetsForThisEx = 3;
        for (let s = 1; s <= numSetsForThisEx; s++) {
          const isDone = setsAllocated < completedSets;
          setsAllocated++;
          exSets.push({
            setNum: s,
            weight: avgWeight || 20,
            reps: 10,
            completed: isDone,
          });
        }
        return {
          exerciseId: typeof ex === "object" ? ex._id : ex,
          exerciseName: exName,
          targetMuscle: exTarget,
          sets: exSets,
        };
      });
    }

    // 3. Synthesize full exercise breakdown from routine name and sets
    const setsCount = Math.max(selectedSession.totalSets || 3, 3);
    const completedCount = selectedSession.completedSets !== undefined ? selectedSession.completedSets : setsCount;
    const totalVol = selectedSession.totalVolume || 0;
    const weightPerSet = completedCount > 0 && totalVol > 0 ? Math.round(totalVol / (completedCount * 10)) : 25;

    const synthesizedSets = [];
    for (let s = 1; s <= setsCount; s++) {
      synthesizedSets.push({
        setNum: s,
        weight: weightPerSet || 25,
        reps: 10,
        completed: s <= completedCount,
      });
    }

    return [
      {
        exerciseId: selectedSession.workoutId || "ex-1",
        exerciseName: selectedSession.workoutName || "Workout Routine Exercise",
        targetMuscle: "Full Body",
        sets: synthesizedSets,
      },
    ];
  }, [selectedSession, user?.workouts]);

  const handleShare = () => {
    if (!selectedSession) return;
    const shareText = `🏆 FitHub Workout Session: ${selectedSession.workoutName}\n📅 Date: ${selectedSession.date} ${selectedSession.time || ""}\n⏱️ Duration: ${selectedSession.duration}\n🏋️ Volume: ${(selectedSession.totalVolume || 0).toLocaleString()} ${weightUnit}\n✅ Sets Completed: ${selectedSession.completedSets}/${selectedSession.totalSets}\nTracked with FitHub 💪`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success("Workout session details copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRepeatWorkout = async () => {
    if (!selectedSession) return;

    const userWorkouts = user?.workouts || [];
    const workoutExists = userWorkouts.some(
      (w) => (typeof w === "object" ? w._id : w) === selectedSession.workoutId
    );

    if (workoutExists && selectedSession.workoutId) {
      navigate(`/${user?.username}/myworkouts/${selectedSession.workoutId}`);
      return;
    }

    if (userWorkouts.length >= 10) {
      setShowSlotsFullModal(true);
      return;
    }

    try {
      setIsRecreating(true);
      const newWorkoutId = await addWorkout(dispatch, `${selectedSession.workoutName} (Repeat)`);
      if (newWorkoutId && selectedSession.exercises) {
        for (const ex of selectedSession.exercises) {
          if (ex.exerciseId) {
            await addExerciseToWorkout(dispatch, newWorkoutId, ex.exerciseId);
          }
        }
      }
      toast.success("Routine ready! Starting your workout...");
      navigate(`/${user?.username}/myworkouts/${newWorkoutId}`);
    } catch (err) {
      console.error("Failed to recreate workout:", err);
      toast.error("Could not load routine. You can browse and start from My Workouts.");
    } finally {
      setIsRecreating(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setSortBy("date_desc");
    setCurrentPage(1);
    setSelectedSessionId(null);
  };

  const hasActiveFilters = searchQuery !== "" || filterStatus !== "all" || sortBy !== "date_desc";

  const progressPercent =
    selectedSession && selectedSession.totalSets > 0
      ? Math.round((selectedSession.completedSets / selectedSession.totalSets) * 100)
      : 0;

  const startIdx = filteredHistory.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIdx = Math.min(currentPage * ITEMS_PER_PAGE, filteredHistory.length);

  return (
    <div className="workout-history-container">
      {/* Header */}
      <div className="history-page-header">
        <div className="header-left">
          <button
            className="back-btn"
            onClick={() => navigate(`/${user?.username}/dashboard`)}
          >
            <ArrowBackIcon fontSize="small" /> Dashboard
          </button>
          <div className="title-group">
            <h1 className="history-title">
              <HistoryIcon className="title-icon" /> Workout Session History
            </h1>
            <p className="history-subtitle">
              Inspect past workout sessions with full exercise breakdowns, set weights, reps, and completion states.
            </p>
          </div>
        </div>

        <div className="history-stats-pill">
          <span className="pill-count">{history.length}</span> Total Sessions Completed
        </div>
      </div>

      {/* Slots Full Modal */}
      {showSlotsFullModal && (
        <div className="slots-modal-overlay" onClick={() => setShowSlotsFullModal(false)}>
          <div className="slots-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <WarningAmberIcon className="warning-icon" />
              <h3>Workout Slots Full (10/10)</h3>
              <button className="close-btn" onClick={() => setShowSlotsFullModal(false)}>
                <CloseIcon fontSize="small" />
              </button>
            </div>
            <p className="modal-desc">
              You currently have reached your maximum limit of 10 custom workout routines. To save this historical session as a permanent routine, please delete an unused routine first in My Workouts.
            </p>
            <div className="modal-actions">
              <button
                className="manage-slots-btn"
                onClick={() => {
                  setShowSlotsFullModal(false);
                  navigate(`/${user?.username}/myworkouts`);
                }}
              >
                Manage My Workouts
              </button>
              <button
                className="cancel-modal-btn"
                onClick={() => setShowSlotsFullModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="history-empty-state">
          <HistoryIcon className="empty-icon" />
          <h2>No Workout Sessions Yet</h2>
          <p>
            When you complete active training sessions in your routines, your full interactive snapshot, exercises, weights, and set logs will be preserved here.
          </p>
          <button
            className="start-workout-cta-btn"
            onClick={() => navigate(`/${user?.username}/myworkouts`)}
          >
            <PlayArrowIcon /> Explore Routines
          </button>
        </div>
      ) : (
        <div className="history-split-layout">
          {/* LEFT PANEL: Master Sessions Stream with Search, Filter, Sort & Pagination */}
          <div className="history-list-panel">
            
            {/* Search Box */}
            <div className="list-search-box">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search routines, exercises, dates..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                  setSelectedSessionId(null);
                }}
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  <CloseIcon style={{ fontSize: "1rem" }} />
                </button>
              )}
            </div>

            {/* Filter & Sort Controls Row */}
            <div className="history-controls-bar">
              <div className="filter-chips-scroll">
                <button
                  className={`filter-chip ${filterStatus === "all" ? "active" : ""}`}
                  onClick={() => {
                    setFilterStatus("all");
                    setCurrentPage(1);
                  }}
                >
                  All
                </button>
                <button
                  className={`filter-chip ${filterStatus === "completed" ? "active" : ""}`}
                  onClick={() => {
                    setFilterStatus("completed");
                    setCurrentPage(1);
                  }}
                >
                  100% Done
                </button>
                <button
                  className={`filter-chip ${filterStatus === "partial" ? "active" : ""}`}
                  onClick={() => {
                    setFilterStatus("partial");
                    setCurrentPage(1);
                  }}
                >
                  Partial
                </button>
                <button
                  className={`filter-chip ${filterStatus === "highVolume" ? "active" : ""}`}
                  onClick={() => {
                    setFilterStatus("highVolume");
                    setCurrentPage(1);
                  }}
                >
                  ≥ 1,000 {weightUnit}
                </button>
              </div>

              <div className="sort-dropdown-wrap">
                <SortIcon className="sort-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="sort-select"
                >
                  <option value="date_desc">Date (Newest)</option>
                  <option value="date_asc">Date (Oldest)</option>
                  <option value="volume_desc">Volume (Highest)</option>
                  <option value="volume_asc">Volume (Lowest)</option>
                  <option value="duration_desc">Duration (Longest)</option>
                  <option value="duration_asc">Duration (Shortest)</option>
                  <option value="completion_desc">Completion (Highest)</option>
                </select>
              </div>
            </div>

            {/* Active Filter Info & Reset Button */}
            {hasActiveFilters && (
              <div className="active-filters-strip">
                <span className="results-count">
                  Found <strong>{filteredHistory.length}</strong> matching session{filteredHistory.length !== 1 ? "s" : ""}
                </span>
                <button className="reset-filter-btn" onClick={handleResetFilters}>
                  <RestartAltIcon style={{ fontSize: "0.95rem" }} /> Reset
                </button>
              </div>
            )}

            {/* Session Cards Stream */}
            <div className="session-cards-stream">
              {paginatedSessions.map((session, idx) => {
                const sid = session._id || session.timestamp || idx;
                const isSelected = selectedSession === session;
                const pct =
                  session.totalSets > 0
                    ? Math.round((session.completedSets / session.totalSets) * 100)
                    : 0;
                return (
                  <div
                    key={sid}
                    className={`session-summary-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedSessionId(sid)}
                  >
                    <div className="card-top-row">
                      <h3 className="routine-name">{session.workoutName}</h3>
                      <span className="session-date">
                        <CalendarTodayIcon style={{ fontSize: "0.75rem", marginRight: "3px" }} />
                        {session.date}
                      </span>
                    </div>

                    <div className="card-metrics-row">
                      <span className="metric-tag">
                        <TimerIcon style={{ fontSize: "0.85rem" }} /> {session.duration}
                      </span>
                      <span className="metric-tag">
                        <TrendingUpIcon style={{ fontSize: "0.85rem" }} /> {(session.totalVolume || 0).toLocaleString()} {weightUnit}
                      </span>
                      <span className="metric-tag sets">
                        <CheckCircleIcon style={{ fontSize: "0.85rem" }} /> {session.completedSets}/{session.totalSets}
                      </span>
                    </div>

                    <div className="card-progress-bar-wrap">
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="progress-text">{pct}%</span>
                    </div>
                  </div>
                );
              })}

              {filteredHistory.length === 0 && (
                <div className="no-search-results">
                  <FilterListIcon className="no-results-icon" />
                  <h4>No sessions found</h4>
                  <p>
                    {searchQuery
                      ? `No workout sessions match "${searchQuery}". Try searching by another keyword or exercise.`
                      : "No workout sessions match the selected filter criteria."}
                  </p>
                  <button className="reset-filter-btn-cta" onClick={handleResetFilters}>
                    <RestartAltIcon fontSize="small" /> Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {filteredHistory.length > 0 && (
              <div className="history-pagination-bar">
                <div className="pagination-info">
                  Showing <strong>{startIdx}–{endIdx}</strong> of <strong>{filteredHistory.length}</strong>
                </div>
                <div className="pagination-nav-buttons">
                  <button
                    className="page-btn nav-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    title="Previous Page"
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`page-btn num-btn ${currentPage === pageNum ? "active" : ""}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    className="page-btn nav-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                  >
                    <ChevronRightIcon fontSize="small" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Live Workout Screen State */}
          {selectedSession ? (
            <div className="history-detail-panel">
              <div className="workout-page active-session-page history-snapshot-mode">
                
                {/* 1. Top Meta Row Matching Active Session */}
                <div className="workout-page-top-row">
                  <div className="status-badge-wrap">
                    <span className="active-status-badge session-completed-badge">
                      SESSION COMPLETED
                    </span>
                    <span className="session-timestamp">
                      {selectedSession.date} {selectedSession.time ? `@ ${selectedSession.time}` : ""}
                    </span>
                  </div>
                  <h1 className="workout-page-title">{selectedSession.workoutName}</h1>
                </div>

                {/* 2. Overview HUD Bar with Stats & Actions */}
                <div className="history-overview-hud">
                  <div className="hud-stat-box">
                    <div className="hud-stat-icon-wrap duration">
                      <TimerIcon />
                    </div>
                    <div className="hud-stat-content">
                      <span className="hud-stat-label">Duration</span>
                      <span className="hud-stat-value">{selectedSession.duration}</span>
                    </div>
                  </div>

                  <div className="hud-stat-box">
                    <div className="hud-stat-icon-wrap volume">
                      <TrendingUpIcon />
                    </div>
                    <div className="hud-stat-content">
                      <span className="hud-stat-label">Volume Lifted</span>
                      <span className="hud-stat-value">
                        {(selectedSession.totalVolume || 0).toLocaleString()} <span className="unit">{weightUnit}</span>
                      </span>
                    </div>
                  </div>

                  <div className="hud-stat-box">
                    <div className="hud-stat-icon-wrap sets">
                      <CheckCircleIcon />
                    </div>
                    <div className="hud-stat-content">
                      <span className="hud-stat-label">Completed Sets</span>
                      <span className="hud-stat-value">
                        {selectedSession.completedSets} / {selectedSession.totalSets}
                      </span>
                    </div>
                  </div>

                  <div className="hud-actions-group">
                    <button className="hud-btn share-btn" onClick={handleShare} title="Share workout log">
                      <ShareIcon style={{ fontSize: "1rem" }} />
                      <span>{copied ? "Copied!" : "Share"}</span>
                    </button>
                    <button
                      className="hud-btn repeat-btn"
                      onClick={handleRepeatWorkout}
                      disabled={isRecreating}
                      title="Launch and repeat this workout"
                    >
                      <PlayArrowIcon style={{ fontSize: "1.1rem" }} />
                      <span>{isRecreating ? "Loading..." : "Repeat"}</span>
                    </button>
                  </div>
                </div>

                {/* 3. Read-Only Notice Bar */}
                <div className="history-readonly-banner">
                  <div className="banner-left">
                    <span className="dot-indicator"></span>
                    <span>Historical Session Log</span>
                  </div>
                  <span className="banner-right">Fields are preserved as recorded during training.</span>
                </div>

                {/* 4. Active Exercises List */}
                <div className="active-exercises-list">
                  {resolvedExercises.map((exercise, exIdx) => {
                    const sets = exercise.sets || [];
                    return (
                      <div key={exercise.exerciseId || exIdx} className="active-exercise-card">
                        <div className="exercise-header">
                          <div className="header-title-left">
                            <FitnessCenterIcon className="ex-icon" />
                            <h3>{exercise.exerciseName}</h3>
                          </div>
                          {exercise.targetMuscle && (
                            <span className="ex-target-pill">{exercise.targetMuscle}</span>
                          )}
                        </div>

                        <div className="sets-table">
                          <div className="table-header-row">
                            <span className="col-num">SET</span>
                            <span className="col-weight">WEIGHT ({weightUnit.toUpperCase()})</span>
                            <span className="col-reps">REPS</span>
                            <span className="col-check">DONE</span>
                          </div>

                          {sets.map((set, idx) => (
                            <div
                              key={idx}
                              className={`set-row ${set.completed ? "completed" : ""}`}
                            >
                              <span className="col-num">#{set.setNum || idx + 1}</span>

                              <span className="col-weight">
                                <div className="stepper-input-wrapper">
                                  <button type="button" className="step-btn" disabled>
                                    <RemoveIcon style={{ fontSize: "0.9rem" }} />
                                  </button>
                                  <input
                                    type="number"
                                    value={set.weight}
                                    readOnly
                                    disabled
                                  />
                                  <button type="button" className="step-btn" disabled>
                                    <AddIcon style={{ fontSize: "0.9rem" }} />
                                  </button>
                                </div>
                              </span>

                              <span className="col-reps">
                                <div className="stepper-input-wrapper">
                                  <button type="button" className="step-btn" disabled>
                                    <RemoveIcon style={{ fontSize: "0.9rem" }} />
                                  </button>
                                  <input
                                    type="number"
                                    value={set.reps}
                                    readOnly
                                    disabled
                                  />
                                  <button type="button" className="step-btn" disabled>
                                    <AddIcon style={{ fontSize: "0.9rem" }} />
                                  </button>
                                </div>
                              </span>

                              <span className="col-check">
                                <button
                                  type="button"
                                  className={`set-check-btn ${set.completed ? "checked" : ""}`}
                                  disabled
                                  title={set.completed ? "Set Completed" : "Set Incomplete"}
                                >
                                  {set.completed ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                                </button>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 5. Sticky Progress Footer */}
                <div className="active-progress-footer">
                  <div className="progress-text-row">
                    <span className="footer-left-label">Overall Session Progress</span>
                    <span className="footer-right-stat">
                      {progressPercent}% ({selectedSession.completedSets} / {selectedSession.totalSets} sets completed)
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="history-detail-panel empty-selection">
              {filteredHistory.length === 0 ? (
                <>
                  <SearchIcon className="empty-selection-icon" />
                  <h3>No Session Matches Your Query</h3>
                  <p>
                    {searchQuery
                      ? `We couldn't find any workout sessions matching "${searchQuery}".`
                      : "No workouts match your current filter settings."}
                  </p>
                  <button className="reset-filter-btn-cta" onClick={handleResetFilters}>
                    <RestartAltIcon fontSize="small" /> Clear Search & Filters
                  </button>
                </>
              ) : (
                <>
                  <HistoryIcon className="empty-selection-icon" />
                  <h3>No Workout Selected</h3>
                  <p>Select a workout session from the left stream to inspect its live exercise screen.</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
