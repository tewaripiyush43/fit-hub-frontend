import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import { quotes } from "../constants/quotes";
import { addWorkout, addExerciseToWorkout } from "../api/workoutapi";
import DetailSection from "../components/DetailsSection";
import { errorPopUp } from "../helpers/errorPopUp";

import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RemoveTwoToneIcon from "@mui/icons-material/RemoveTwoTone";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ExercisePage = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // State
  const [exercise, setexercise] = useState("");
  const [exercisesForBodyPart, setExercisesForBodyPart] = useState([]);
  const [exercisesForMuscle, setExercisesForMuscle] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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
    { id: "roast", label: "Roast Me" },
    { id: "intelligence", label: "AI Trainer" },
    { id: "challenge", label: "Challenge" }
  ];

  const shuffleQuote = (category) => {
    let filtered = quotes;
    if (category !== "all") {
      filtered = quotes.filter((q) => q.category === category);
    }
    if (filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      setSelectedQuote(filtered[randomIndex]);
    }
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const findExercise = async () => {
    try {
      const res = await axios.get(`${REACT_APP_BASE_URL}/exercise/findex/${id}`);
      setexercise(res.data);
      setCompletedSteps({}); // Reset steps when exercise changes
      findExercisesByBodyPart(res.data.bodyPart);
      findExercisesByMuscle(res.data.target);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const findExercisesByBodyPart = async (bodyPart) => {
    try {
      const res = await axios.get(`${REACT_APP_BASE_URL}/exercise/exercises/bodyParts/${bodyPart}`);
      setExercisesForBodyPart(res.data);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const findExercisesByMuscle = async (muscle) => {
    try {
      const res = await axios.get(`${REACT_APP_BASE_URL}/exercise/exercises/${muscle}`);
      setExercisesForMuscle(res.data);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (errorMessage.length > 0) {
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  useEffect(() => {
    findExercise();
  }, [id]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    shuffleQuote("all");
  }, []);

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
      await addWorkout(
        dispatch,
        trimmedName,
        REACT_APP_BASE_URL
      );

      setTakingInput(false);
      setNewWorkoutInput("");
      toast.success(`Workout "${trimmedName}" created successfully!`);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="exercise-page">
      {/* Interactive Quote Panel */}
      <div className="exercise-page-header-container">
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

      {/* Dual Card Grid Layout */}
      <div className="exercise-detail-grid">
        {/* Left Column: Visual Card */}
        <div className="exercise-visual-card">
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
        </div>

        {/* Right Column: Info & Details Card */}
        <div className="exercise-info-card">
          <div className="info-card-header">
            <h1 className="exercise-name-title">{exercise?.name}</h1>

            {/* Add to Workout Dropdown */}
            {isLoggedIn && (
              <div className="add-to-workout-container" ref={dropdownRef}>
                <button
                  className="add-to-workout-trigger-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <AddTwoToneIcon style={{ fontSize: "1.1rem" }} />
                  <span>Add to Workout</span>
                  <ArrowDropDownIcon style={{ fontSize: "1.2rem", marginLeft: "2px" }} />
                </button>
                {showDropdown && (
                  <div className="add-to-workout-dropdown-menu">
                    <p className="dropdown-menu-title">Add to Routine</p>
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
                                  id,
                                  REACT_APP_BASE_URL
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
                      View Workouts
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Badges/Chips */}
          <div className="badge-pills-row">
            <div className="badge-pill target">
              <span className="badge-label">Target Muscle</span>
              <span className="badge-value">{exercise?.target}</span>
            </div>
            {exercise?.equipment && (
              <div className="badge-pill equipment">
                <span className="badge-label">Equipment</span>
                <span className="badge-value">{exercise.equipment}</span>
              </div>
            )}
            <div className="badge-pill bodypart">
              <span className="badge-label">Body Part</span>
              <span className="badge-value">{exercise?.bodyPart}</span>
            </div>
          </div>

          {/* Secondary Muscles */}
          {exercise?.secondaryMuscles?.length > 0 && (
            <div className="secondary-muscles-section">
              <span className="section-label">Secondary Muscles Targeted:</span>
              <div className="secondary-muscles-list">
                {exercise.secondaryMuscles.map((muscle, idx) => (
                  <span key={idx} className="secondary-muscle-tag">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}

          <hr className="info-divider" />

          {/* Stepper Interactive Instructions */}
          <div className="instructions-section">
            <h3 className="instructions-title">Step-by-Step Walkthrough</h3>
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
        </div>
      </div>

      {/* Similar / Related Exercises Section */}
      <div className="related-exercises-section">
        <DetailSection ex={exercise} data={exercisesForMuscle} type="muscle" />
        <DetailSection ex={exercise} data={exercisesForBodyPart} type="bodyPart" />
      </div>
    </div>
  );
};

export default ExercisePage;
