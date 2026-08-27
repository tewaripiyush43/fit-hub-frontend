import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { quotes } from "../constants/quotes";
import { addWorkout, addExerciseToWorkout } from "../api/workoutApi";
import {
  findExerciseById as findExerciseByIdApi,
  findExercisesByBodyPart as findExercisesByBodyPartApi,
  findExercisesByMuscle as findExercisesByMuscleApi,
} from "../api/exerciseApi";
import DetailSection from "../components/DetailsSection";
import { errorPopUp, toast } from "../helpers/errorPopUp";
import { updateSEO } from "../utils/seoHelper";

// UI Primitives
import {
  Badge,
  Button,
  Card,
  Skeleton,
  ErrorState,
} from "../components/ui";

import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RemoveTwoToneIcon from "@mui/icons-material/RemoveTwoTone";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ExercisePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // State
  const [exercise, setExercise] = useState(null);
  const [exercisesForBodyPart, setExercisesForBodyPart] = useState([]);
  const [exercisesForMuscle, setExercisesForMuscle] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Quote State
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [activeQuoteCategory, setActiveQuoteCategory] = useState("all");

  // Interactive Instructions state
  const [completedSteps, setCompletedSteps] = useState({});

  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const [newWorkoutInput, setNewWorkoutInput] = useState("");
  const [takingInput, setTakingInput] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef(null);

  // Redux Auth
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const quoteCategories = [
    { id: "all", label: "All Vibes" },
    { id: "discipline", label: "Discipline" },
    { id: "motivation", label: "Motivation" },
    { id: "intelligence", label: "AI Trainer" },
  ];

  const shuffleQuote = useCallback((category) => {
    let filtered = quotes;
    if (category !== "all") {
      filtered = quotes.filter((q) => q.category === category);
    }
    if (filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      setSelectedQuote(filtered[randomIndex]);
    }
  }, []);

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const findExercise = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await findExerciseByIdApi(id);
      if (!data) {
        setFetchError("Exercise details not found.");
        return;
      }
      setExercise(data);
      setCompletedSteps({});
      if (data.bodyPart) {
        findExercisesByBodyPartApi(data.bodyPart).then((res) => setExercisesForBodyPart(res || []));
      }
      if (data.target) {
        findExercisesByMuscleApi(data.target).then((res) => setExercisesForMuscle(res || []));
      }
    } catch (err) {
      setFetchError("Failed to fetch exercise data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (errorMessage.length > 0) {
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  useEffect(() => {
    findExercise();
  }, [id, findExercise]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    shuffleQuote("all");
  }, [shuffleQuote]);

  useEffect(() => {
    if (exercise?.name) {
      const formattedName = exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1);
      const exerciseTitle = `${formattedName} - Form Guide & Muscle Target | FitHub`;
      const exerciseDesc = `Master ${exercise.name} with step-by-step form execution. Targets ${exercise.target || "muscles"} using ${exercise.equipment || "standard gym equipment"}. View animated GIF demonstration and similar exercises.`;
      const keywords = `${exercise.name}, ${exercise.target}, ${exercise.bodyPart}, ${exercise.equipment}, gym form guide, workout GIF, bodybuilding exercise`;
      updateSEO({
        title: exerciseTitle,
        description: exerciseDesc,
        pathname: `/exercise/${id}`,
        image: exercise.gifUrl || undefined,
        keywords,
      });
    }
  }, [exercise, id]);

  // Dropdown click outside listener
  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setTakingInput(false);
        setNewWorkoutInput("");
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleCreateWorkoutClick = async (e) => {
    e.stopPropagation();

    if (!takingInput) {
      setTakingInput(true);
      return;
    }

    if (isCreating) return;

    const trimmedName = newWorkoutInput.trim();
    if (!trimmedName) {
      toast.error("Workout name cannot be empty");
      return;
    }

    setIsCreating(true);
    try {
      await addWorkout(dispatch, trimmedName, id);

      setTakingInput(false);
      setNewWorkoutInput("");
      setShowDropdown(false);
      toast.success(`Created "${trimmedName}" and added ${exercise?.name || "exercise"}!`);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsCreating(false);
    }
  };

  if (fetchError && !loading) {
    return (
      <div className="exercise-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <ErrorState
          title="Exercise Not Found"
          message={fetchError}
          onRetry={findExercise}
          retryText="Retry Loading"
        />
      </div>
    );
  }

  return (
    <div className="exercise-page">
      {/* Back Button */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 16px" }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          iconStart={<ArrowBackIcon />}
        >
          Back
        </Button>
      </div>

      {loading ? (
        <div className="exercise-detail-grid" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Skeleton variant="card" height={420} borderRadius="24px" />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="text" height={24} width="40%" />
            <Skeleton variant="card" height={260} borderRadius="16px" />
          </div>
        </div>
      ) : (
        <>
          {/* Dual Card Grid Layout (Mobile-first responsive) */}
          <div className="exercise-detail-grid">
            {/* Left Column: Visual Card */}
            <Card variant="default" className="exercise-visual-card">
              <div className="gif-badge">
                <FitnessCenterIcon style={{ fontSize: "1rem" }} />
                <span>Demonstration</span>
              </div>
              <div className="gif-image-wrapper">
                {exercise?.gifUrl ? (
                  <img
                    className="gif-img"
                    src={exercise.gifUrl}
                    alt={exercise.name || "Exercise Demonstration"}
                  />
                ) : (
                  <div className="gif-placeholder">No animation available</div>
                )}
              </div>
            </Card>

            {/* Right Column: Info & Details Card */}
            <Card variant="default" className="exercise-info-card">
              <div className="info-card-header">
                <div>
                  <h1 className="exercise-name-title">{exercise?.name}</h1>
                  {/* Badges/Chips */}
                  <div className="badge-pills-row" style={{ marginTop: "12px" }}>
                    <Badge variant="accent" size="md">
                      Target: {exercise?.target}
                    </Badge>
                    {exercise?.equipment && (
                      <Badge variant="info" size="md">
                        Equipment: {exercise.equipment}
                      </Badge>
                    )}
                    <Badge variant="primary" size="md">
                      Body Part: {exercise?.bodyPart}
                    </Badge>
                  </div>
                </div>

                {/* Add to Workout Dropdown */}
                {isLoggedIn && (
                  <div className="add-to-workout-container" ref={dropdownRef}>
                    <button
                      className="add-to-workout-trigger-btn"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <AddTwoToneIcon style={{ fontSize: "1.1rem" }} />
                      <span>Add to Routine</span>
                      <ArrowDropDownIcon style={{ fontSize: "1.2rem", marginLeft: "2px" }} />
                    </button>
                    {showDropdown && (
                      <div className="add-to-workout-dropdown-menu">
                        <p className="dropdown-menu-title">Select Routine</p>
                        <hr className="dropdown-menu-divider" />
                        {user?.workouts?.length > 0 ? (
                          <ul className="dropdown-menu-list">
                            {user.workouts.map((workout) => {
                              const exerciseCount = workout.exercises?.length || 0;
                              const isFull = exerciseCount >= 10;
                              const exists = workout.exercises?.some((ex) => {
                                const exId = typeof ex === "string" ? ex : ex?._id;
                                return exId === id;
                              });
                              return (
                                <li
                                  key={workout._id}
                                  className={`dropdown-menu-item ${isFull ? "disabled" : ""} ${exists ? "exists" : ""}`}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (isFull) {
                                      toast.error("This workout is full! (Max 10)");
                                      return;
                                    }
                                    if (exists) {
                                      toast.info("Exercise already in this workout!");
                                      setShowDropdown(false);
                                      return;
                                    }
                                    setShowDropdown(false);
                                    const success = await addExerciseToWorkout(
                                      dispatch,
                                      workout._id,
                                      id
                                    );
                                    if (success) {
                                      toast.success(`Added ${exercise.name} to ${workout.name}!`);
                                    } else {
                                      toast.error("Failed to add to workout.");
                                    }
                                  }}
                                >
                                  <span className="workout-name">{workout.name}</span>
                                  <span className="workout-count">({exerciseCount}/10)</span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <div className="dropdown-empty-state">
                            <p>No custom workouts found.</p>
                          </div>
                        )}

                        {/* Inline Create Workout */}
                        {user?.workouts?.length < 7 && (
                          <div className="dropdown-create-section">
                            {!takingInput ? (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTakingInput(true);
                                }}
                                className="dropdown-create-btn-row"
                              >
                                <AddTwoToneIcon style={{ fontSize: "1rem" }} />
                                <span>Create Workout</span>
                              </div>
                            ) : (
                              <div className="dropdown-create-input-row" onClick={(e) => e.stopPropagation()}>
                                <input
                                  className="dropdown-create-input-field"
                                  type="text"
                                  placeholder="Workout Name"
                                  value={newWorkoutInput}
                                  onChange={(e) => setNewWorkoutInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleCreateWorkoutClick(e);
                                    }
                                  }}
                                  autoFocus
                                />
                                <div className="dropdown-action-icons">
                                  <AddTwoToneIcon
                                    className="add-icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCreateWorkoutClick(e);
                                    }}
                                  />
                                  <RemoveTwoToneIcon
                                    className="remove-icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTakingInput(false);
                                      setNewWorkoutInput("");
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div
                          className="dropdown-view-all-row"
                          onClick={() => {
                            setShowDropdown(false);
                            navigate(`/${user.username}/myworkouts`);
                          }}
                        >
                          View All Routines
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Secondary Muscles */}
              {exercise?.secondaryMuscles?.length > 0 && (
                <div className="secondary-muscles-section">
                  <span className="section-label">Secondary Muscles Targeted:</span>
                  <div className="secondary-muscles-list">
                    {exercise.secondaryMuscles.map((muscle, idx) => (
                      <Badge key={idx} variant="neutral" size="sm">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <hr className="info-divider" />

              {/* Stepper Interactive Instructions */}
              <div className="instructions-section">
                <h3 className="instructions-title">Step-by-Step Execution</h3>
                <ul className="instructions-checklist">
                  {exercise?.instructions?.map((instruction, index) => {
                    const isCompleted = !!completedSteps[index];
                    return (
                      <li
                        key={index}
                        className={`instruction-step-item ${isCompleted ? "completed" : ""}`}
                        onClick={() => toggleStep(index)}
                      >
                        <button className="step-checkbox" aria-label={`Mark step ${index + 1}`}>
                          {isCompleted ? (
                            <CheckCircleIcon className="check-icon active" />
                          ) : (
                            <CheckCircleOutlineIcon className="check-icon" />
                          )}
                        </button>
                        <span className="step-text">
                          <strong className="step-number">{index + 1}.</strong> {instruction}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Card>
          </div>

          {/* Interactive Quote Panel (Secondary) */}
          <div className="exercise-page-header-container" style={{ marginTop: "40px" }}>
            <div className="exercise-page-quote-panel">
              <div className="quote-panel-header">
                <div className="quote-category-tabs">
                  {quoteCategories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`quote-tab-btn ${activeQuoteCategory === cat.id ? "active" : ""}`}
                      onClick={() => {
                        setActiveQuoteCategory(cat.id);
                        shuffleQuote(cat.id);
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <button
                  className="quote-shuffle-btn"
                  onClick={() => shuffleQuote(activeQuoteCategory)}
                  title="Get another quote"
                >
                  <AutorenewIcon style={{ fontSize: "1.1rem" }} />
                  <span>Shuffle</span>
                </button>
              </div>
              <div className="quote-body">
                <FormatQuoteOutlinedIcon className="quote-bg-icon start" />
                <p className="quote-text-content">
                  {selectedQuote ? selectedQuote.quote : "Once you are exercising regularly, the hardest thing is to stop it."}
                </p>
                <FormatQuoteOutlinedIcon className="quote-bg-icon end" />
              </div>
            </div>
          </div>

          {/* Similar / Related Exercises Section */}
          <div className="related-exercises-section">
            <DetailSection ex={exercise} data={exercisesForMuscle} type="muscle" />
            <DetailSection ex={exercise} data={exercisesForBodyPart} type="bodyPart" />
          </div>
        </>
      )}
    </div>
  );
};

export default ExercisePage;
