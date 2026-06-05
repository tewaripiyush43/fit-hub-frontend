import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { fetchWorkout, deleteWorkout, updateWorkout } from "../api/workoutApi";
import { logWorkoutSession } from "../api/userApi";
import { workoutActions } from "../store/index";
import ExerciseCard from "../components/ExerciseCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import ConfirmationPopup from "../components/ConfirmationPopUp";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const renderFormattedDescription = (text) => {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    if (!cleanLine) {
      return <br key={idx} />;
    }
    const isListItem = cleanLine.startsWith("* ") || cleanLine.startsWith("- ");
    if (isListItem) {
      cleanLine = cleanLine.substring(2).trim();
    }
    const parts = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanLine.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.substring(lastIndex));
    }
    if (isListItem) {
      return (
        <li key={idx} style={{ marginLeft: "25px", marginBottom: "8px", listStyleType: "disc", textAlign: "left" }}>
          {parts}
        </li>
      );
    }
    return (
      <p key={idx} style={{ marginBottom: "12px", textAlign: "left" }}>
        {parts}
      </p>
    );
  });
};

const WORKOUT_DESCRIPTION_MAX_LENGTH = 2500;

const WorkoutPage = () => {
  const navigate = useNavigate();
  const { username, workoutId } = useParams();
  const [id] = workoutId.split("-");
  const dispatch = useDispatch();
  const workoutData = useSelector((state) => state.workout.workoutData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const isOwner = isLoggedIn && workoutData?.createdBy === user?._id;
  const [editMode, setEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const textareaRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleTogglePrivacy = async () => {
    if (!workoutData || !isOwner) return;
    const updatedPrivate = !workoutData.isPrivate;
    
    dispatch(
      workoutActions.setWorkoutData({
        ...workoutData,
        isPrivate: updatedPrivate,
      })
    );
    
    try {
      await updateWorkout(
        dispatch, 
        id, 
        { ...workoutData, isPrivate: updatedPrivate }
      );
    } catch (err) {
      console.error("Failed to update privacy:", err);
      dispatch(
        workoutActions.setWorkoutData({
          ...workoutData,
          isPrivate: !updatedPrivate,
        })
      );
    }
  };

  const handleCopyLink = () => {
    const slug = workoutData?.name ? workoutData.name.replace(/\s+/g, "-") : "";
    const shareUrl = `${window.location.origin}/share/workout/${id}-${slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Active session state variables
  const [activeSession, setActiveSession] = useState(false);
  const [sessionExercises, setSessionExercises] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);
  const [totalSets, setTotalSets] = useState(0);

  const handleStartSession = () => {
    if (!workoutData?.exercises?.length) return;
    const initialSession = {};
    workoutData.exercises.forEach((ex) => {
      initialSession[ex._id] = [
        { setNum: 1, weight: 135, reps: 10, completed: false },
        { setNum: 2, weight: 135, reps: 10, completed: false },
        { setNum: 3, weight: 135, reps: 10, completed: false },
      ];
    });
    setSessionExercises(initialSession);
    setSeconds(0);
    setActiveSession(true);
  };

  useEffect(() => {
    let interval = null;
    if (activeSession && !showSummary) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!activeSession) {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeSession, showSummary]);

  const handleAddActiveSet = (exerciseId) => {
    const currentSets = sessionExercises[exerciseId] || [];
    const lastSet = currentSets[currentSets.length - 1];
    const newSet = {
      setNum: currentSets.length + 1,
      weight: lastSet ? lastSet.weight : 135,
      reps: lastSet ? lastSet.reps : 10,
      completed: false,
    };
    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: [...currentSets, newSet],
    });
  };

  const handleRemoveActiveSet = (exerciseId) => {
    const currentSets = sessionExercises[exerciseId] || [];
    if (currentSets.length <= 1) return;
    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: currentSets.slice(0, currentSets.length - 1),
    });
  };

  const handleToggleSetCompleted = (exerciseId, index) => {
    const currentSets = [...(sessionExercises[exerciseId] || [])];
    currentSets[index] = {
      ...currentSets[index],
      completed: !currentSets[index].completed,
    };
    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: currentSets,
    });
  };

  const handleActiveSetChange = (exerciseId, index, field, value) => {
    const currentSets = [...(sessionExercises[exerciseId] || [])];
    currentSets[index] = {
      ...currentSets[index],
      [field]: Number(value) || 0,
    };
    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: currentSets,
    });
  };

  const handleFinishWorkout = async () => {
    let volumeSum = 0;
    let completedCount = 0;
    let totalCount = 0;
    Object.keys(sessionExercises).forEach((exId) => {
      const sets = sessionExercises[exId] || [];
      totalCount += sets.length;
      sets.forEach((set) => {
        if (set.completed) {
          completedCount += 1;
          volumeSum += set.weight * set.reps;
        }
      });
    });

    setTotalVolume(volumeSum);
    setCompletedSets(completedCount);
    setTotalSets(totalCount);
    setShowSummary(true);

    const logPayload = {
      workoutId: id,
      workoutName: workoutData.name,
      duration: formatTime(seconds),
      totalVolume: volumeSum,
      completedSets: completedCount,
      totalSets: totalCount,
    };

    try {
      await logWorkoutSession(dispatch, logPayload);
    } catch (err) {
      console.error("Failed to log workout session in DB:", err);
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setActiveSession(false);
    navigate(`/${username}/dashboard`);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const getEarnedBadge = (volume) => {
    if (volume >= 12000) return "💪 Hercules Tier (12k+ lbs volume)";
    if (volume >= 7500) return "🔥 Iron Warrior (7.5k+ lbs volume)";
    if (volume >= 3000) return "⚡ Gym Beast (3k+ lbs volume)";
    return "✨ Fitness Champion";
  };

  useEffect(() => {
    fetchWorkout(dispatch, id);
  }, [dispatch, id]);

  useEffect(() => {
    if (!isOwner && editMode) {
      setEditMode(false);
    }
  }, [editMode, isOwner]);

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(
      workoutActions.setWorkoutData({
        ...workoutData,
        [name]: value,
      })
    );
    if (name === "description" && editMode) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }

  // useEffect(() => {
  //   console.log("Workout data changed:", workoutData);
  // }, [workoutData]);

  useEffect(() => {
    if (editMode) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editMode]);

  if (activeSession) {
    let totalSetsCount = 0;
    let completedSetsCount = 0;
    Object.keys(sessionExercises).forEach((exId) => {
      const sets = sessionExercises[exId] || [];
      totalSetsCount += sets.length;
      completedSetsCount += sets.filter((s) => s.completed).length;
    });
    const progressPercent = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

    return (
      <div className="workout-page active-session-page">
        {showSummary && createPortal(
          <div className="active-summary-overlay">
            <div className="active-summary-modal">
              <div className="modal-header">
                <EmojiEventsIcon className="trophy-gold" />
                <h2>Workout Completed!</h2>
                <p>Incredible effort! Here is your training summary:</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{formatTime(seconds)}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Volume Lifted</span>
                  <span className="stat-value">{totalVolume} <span className="stat-unit">lbs</span></span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Sets Completed</span>
                  <span className="stat-value">{completedSets} / {totalSets}</span>
                </div>
              </div>
              <div className="badge-unlock-section">
                <span className="badge-label">Earned Achievement</span>
                <span className="badge-name">{getEarnedBadge(totalVolume)}</span>
              </div>
              <button className="finish-dismiss-btn" onClick={handleCloseSummary}>
                Back to Dashboard
              </button>
            </div>
          </div>,
          document.body
        )}

        <div className="workout-page-header">
          <div className="active-timer-section">
            <TimerIcon className="timer-icon" />
            <span className="active-timer-display">{formatTime(seconds)}</span>
          </div>
          <div className="active-header-actions">
            <button className="finish-workout-btn" onClick={handleFinishWorkout}>
              Finish Workout
            </button>
            <button className="cancel-workout-btn" onClick={() => setActiveSession(false)}>
              Cancel
            </button>
          </div>
        </div>

        <div className="workout-page-meta">
          <span className="active-status-badge">Session In Progress</span>
          <h1 className="workout-page-title">{workoutData?.name}</h1>
        </div>

        <div className="active-exercises-list">
          {workoutData?.exercises?.map((exercise) => {
            const sets = sessionExercises[exercise._id] || [];
            return (
              <div key={exercise._id} className="active-exercise-card">
                <div className="exercise-header">
                  <FitnessCenterIcon className="ex-icon" />
                  <h3>{exercise.name}</h3>
                </div>
                <div className="sets-table">
                  <div className="table-header-row">
                    <span className="col-num">Set</span>
                    <span className="col-weight">Weight (lbs)</span>
                    <span className="col-reps">Reps</span>
                    <span className="col-check">Done</span>
                  </div>
                  {sets.map((set, idx) => (
                    <div key={idx} className={`set-row ${set.completed ? "completed" : ""}`}>
                      <span className="col-num">{set.setNum}</span>
                      <span className="col-weight">
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => handleActiveSetChange(exercise._id, idx, "weight", e.target.value)}
                          disabled={set.completed}
                        />
                      </span>
                      <span className="col-reps">
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleActiveSetChange(exercise._id, idx, "reps", e.target.value)}
                          disabled={set.completed}
                        />
                      </span>
                      <span className="col-check">
                        <button
                          className={`set-check-btn ${set.completed ? "checked" : ""}`}
                          onClick={() => handleToggleSetCompleted(exercise._id, idx)}
                        >
                          {set.completed ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="sets-row-controls">
                  <button className="add-set-btn" onClick={() => handleAddActiveSet(exercise._id)}>
                    <AddTwoToneIcon style={{ fontSize: "1.1rem" }} /> Add Set
                  </button>
                  <button className="remove-set-btn" onClick={() => handleRemoveActiveSet(exercise._id)}>
                    <RemoveIcon style={{ fontSize: "1.1rem" }} /> Remove Set
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="active-progress-footer">
          <div className="progress-text-row">
            <span>Overall Progress</span>
            <span>{progressPercent}% ({completedSetsCount} / {totalSetsCount} sets)</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-page">
      {showConfirmation && (
        <ConfirmationPopup
          onClose={() => setShowConfirmation(false)}
          textContent="workout"
          onDelete={() => {
            deleteWorkout(dispatch, id);
            setShowConfirmation(false);
            navigate(`/${username}/myworkouts`);
          }}
        />
      )}

      <div className="workout-page-header">
        <span className="workout-page-back-btn" onClick={() => navigate(`/${username}/myworkouts`)}>
          &larr; Back to Workouts
        </span>
        <div className="workout-page-actions">
          {isOwner && (
            <>
              <button
                className={`privacy-toggle-btn ${workoutData?.isPrivate ? "private" : "public"}`}
                onClick={handleTogglePrivacy}
                title={workoutData?.isPrivate ? "Make routine Public to share" : "Routine is Public. Click to make Private."}
              >
                {workoutData?.isPrivate ? <LockIcon style={{ fontSize: "1.1rem" }} /> : <PublicIcon style={{ fontSize: "1.1rem" }} />}
                <span>{workoutData?.isPrivate ? "Private" : "Public"}</span>
              </button>
              
              {!workoutData?.isPrivate && (
                <button className="workout-share-btn" onClick={handleCopyLink}>
                  <ContentCopyIcon style={{ fontSize: "1.1rem" }} />
                  <span>{copied ? "Copied!" : "Share Link"}</span>
                </button>
              )}
              
              {workoutData?.exercises?.length > 0 && (
                <button className="start-session-btn" onClick={handleStartSession}>
                  <PlayArrowIcon style={{ fontSize: "1.1rem" }} />
                  <span>Start Workout</span>
                </button>
              )}
            </>
          )}

          {isOwner && (
            <>
              {editMode ? (
                <button
                  onClick={async () => {
                    setEditMode(false);
                    await updateWorkout(dispatch, id, workoutData);
                    // Re-fetch so exercises are always populated (prevents broken GIFs)
                    await fetchWorkout(dispatch, id);
                  }}
                  title="Save Changes"
                  className="workout-page-save-info-btn"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  title="Edit Title/Description"
                  className="workout-page-edit-btn"
                >
                  <EditIcon style={{ fontSize: "1rem" }} /> Edit
                </button>
              )}
              <button
                onClick={() => setShowConfirmation(true)}
                title="Delete Workout"
                className="workout-page-delete-btn"
              >
                <DeleteTwoToneIcon style={{ fontSize: "1rem" }} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="workout-page-meta">
        {editMode ? (
          <input
            name="name"
            value={workoutData?.name}
            onChange={(e) => handleChange(e)}
            className="workout-page-title-input"
            placeholder="Workout Name"
          />
        ) : (
          <h1 className="workout-page-title">{workoutData?.name}</h1>
        )}
        <div className="workout-page-stats-badge">
          <span>{workoutData?.exercises?.length || 0}</span> Exercises Included
        </div>
      </div>

      <div className="workout-page-description">
        <h3 className="description-heading">Overview & Guidelines</h3>
        {editMode ? (
          <>
            <textarea
              name="description"
              ref={textareaRef}
              maxLength={WORKOUT_DESCRIPTION_MAX_LENGTH}
              value={workoutData?.description}
              onChange={(e) => handleChange(e)}
              placeholder="Provide a description or guidelines for this workout..."
              className="workout-page-content-input"
            />
            <div className="workout-description-count">
              {(workoutData?.description || "").length} / {WORKOUT_DESCRIPTION_MAX_LENGTH}
            </div>
          </>
        ) : (
          <div className="workout-page-content">
            {workoutData?.description ? (
              renderFormattedDescription(workoutData?.description)
            ) : (
              <p className="empty-description-placeholder">
                No description provided. Click edit to add guidelines.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="workout-page-exercises-section">
        <div className="exercises-section-header">
          <h2 className="exercises-section-title">Workout Routine</h2>
          <span className="exercises-limit-badge">
            {workoutData?.exercises?.length || 0} / 10 Exercises
          </span>
        </div>
        {workoutData?.exercises?.length > 0 ? (
          <div className="workout-page-exercises-container">
            {workoutData?.exercises?.map((exercise) => (
              <ExerciseCard
                key={exercise._id}
                animation={isOwner}
                removeBtn={isOwner}
                exerciseData={exercise}
              />
            ))}
            {isOwner && workoutData?.exercises?.length < 10 && (
              <div
                className="workout-page-add-exercise-placeholder-card"
                onClick={() => navigate("/exercises/all")}
              >
                <AddTwoToneIcon className="add-placeholder-icon" />
                <span className="add-placeholder-text">Add More Exercises</span>
                <span className="add-placeholder-slots">
                  ({10 - (workoutData?.exercises?.length || 0)} slots available)
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-exercises-state">
            <p>No exercises in this workout routine yet.</p>
            {isOwner && (
              <button className="browse-exercises-btn" onClick={() => navigate("/exercises/all")}>
                Explore & Add Exercises
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;
