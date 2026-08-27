import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StarIcon from "@mui/icons-material/Star";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { toast } from "../helpers/errorPopUp";

import { addWorkout, generateAIWorkout } from "../api/workoutApi";
import { portalActions } from "../store/index";
import WorkoutCard from "./WorkoutCard";
import GlobalWorkouts from "./GlobalWorkouts";
import { useUnitPreference } from "../utils/useUnitPreference";

// UI Primitives
import {
  Button,
  Badge,
  EmptyState,
} from "./ui";

const MyWorkouts = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { weightUnit, heightUnit } = useUnitPreference();

  const [activeView, setActiveView] = useState("my_workouts");
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGoal, setAiGoal] = useState("General");
  const [aiExerciseCount, setAiExerciseCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Connecting to Gemini...");

  const hasBiometrics = Boolean(user?.age && user?.weight && user?.height);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!isLoggedIn || params.get("tab") === "explore") {
      setActiveView("explore");
    } else {
      setActiveView("my_workouts");
    }
    if (params.get("ai") === "true") {
      if (!isLoggedIn) {
        dispatch(portalActions.setPortalOpen());
        toast.info("Please sign up or log in to use the AI Workout Generator!");
      } else {
        setShowAIModal(true);
      }
    } else {
      setShowAIModal(false);
    }
  }, [location.search, isLoggedIn, dispatch]);

  useEffect(() => {
    let interval;
    if (isGenerating) {
      const messages = [
        "Connecting to Gemini...",
        "Analyzing your fitness profile...",
        "Structuring custom workout plan...",
        "Mapping exercises to database...",
        "Saving custom routine...",
      ];
      let idx = 0;
      setLoadingMessage(messages[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % messages.length;
        setLoadingMessage(messages[idx]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleCreateNewRoutine = async () => {
    if (!isLoggedIn) {
      dispatch(portalActions.setPortalOpen());
      toast.info("Please log in or sign up to create and save routines!");
      return;
    }
    try {
      const workoutNumber = (user?.workouts?.length || 0) + 1;
      const workoutName = `Custom Routine #${workoutNumber}`;
      const workoutId = await addWorkout(dispatch, workoutName);
      if (workoutId) {
        toast.success(`Created "${workoutName}"!`);
        navigate(`${workoutId}-${workoutName.replace(/\s+/g, "-")}`);
      }
    } catch (err) {
      toast.error("Failed to create workout");
    }
  };

  const handleGenerateAIWorkout = async () => {
    if (!isLoggedIn) {
      setShowAIModal(false);
      dispatch(portalActions.setPortalOpen());
      toast.info("Please sign up or log in to use the AI Workout Generator!");
      return;
    }
    try {
      setIsGenerating(true);
      const payload = {
        prompt: aiPrompt,
        goal: aiGoal,
        exerciseCount: aiExerciseCount,
        weight: user?.weight ? Number(user.weight) : undefined,
        height: user?.height ? Number(user.height) : undefined,
        age: user?.age ? Number(user.age) : undefined,
      };
      const result = await generateAIWorkout(dispatch, payload, REACT_APP_BASE_URL);
      setIsGenerating(false);
      setShowAIModal(false);
      setAiPrompt("");
      setAiGoal("General");
      setAiExerciseCount(5);
      if (result && result.workoutId) {
        navigate(`${result.workoutId}-${result.workoutName}`);
      }
    } catch (error) {
      console.error("AI Workout Generation failed:", error);
      setIsGenerating(false);
    }
  };

  const isRoutineLimitReached = (user?.workouts?.length || 0) >= 7;

  return (
    <div className="my-workouts-container">
      {/* Top Hub Navigation Switcher */}
      <div className="workouts-hub-tab-bar">
        <button
          className={`hub-tab-btn ${activeView === "explore" ? "active" : ""}`}
          onClick={() => {
            setActiveView("explore");
            navigate(user?.username ? `/${user.username}/myworkouts?tab=explore` : "/workouts?tab=explore");
          }}
        >
          <StarIcon className="gold-star-icon" />
          <span>Explore Routines</span>
        </button>

        <button
          className={`hub-tab-btn ${activeView === "my_workouts" ? "active" : ""}`}
          onClick={() => {
            if (!isLoggedIn) {
              dispatch(portalActions.setPortalOpen());
              toast.info("Please log in or sign up to create and save personal routines!");
              return;
            }
            setActiveView("my_workouts");
            navigate(`/${user?.username}/myworkouts`);
          }}
        >
          <BookmarkBorderIcon />
          <span>My Routines ({user?.workouts?.length || 0})</span>
          {!isLoggedIn && <LockOutlinedIcon style={{ fontSize: "0.85rem", opacity: 0.7, marginLeft: "3px" }} />}
        </button>
      </div>

      {activeView === "explore" ? (
        <GlobalWorkouts />
      ) : (
        <>
          <p className="my-workouts-title">
            <span>M</span>y <span>W</span>orkouts
          </p>

          {/* Premium AI Workout Generator Hero Banner */}
          <div className="ai-workout-hero-banner">
            <div className="ai-workout-banner-left">
              <div className="ai-workout-banner-badge">
                <AutoAwesomeIcon className="ai-workout-sparkle-icon" />
                <span>AI Powered</span>
              </div>
              <h3 className="ai-workout-banner-title">
                Generate custom routines in seconds
              </h3>
              <p className="ai-workout-banner-desc">
                Get a tailored plan built by Gemini AI, customized to your biometric stats, target muscle areas, and training style.
              </p>
            </div>
            <div className="ai-workout-banner-right">
              {isRoutineLimitReached ? (
                <div className="ai-workout-banner-limit">
                  <Badge variant="warning" size="md">
                    Routine Limit Reached (7/7)
                  </Badge>
                  <p className="ai-workout-banner-limit-desc" style={{ marginTop: "4px" }}>
                    Delete an existing workout to generate a new AI routine.
                  </p>
                </div>
              ) : (
                <Button
                  variant="accent"
                  size="md"
                  iconStart={<AutoAwesomeIcon />}
                  onClick={() => {
                    if (!isLoggedIn) {
                      dispatch(portalActions.setPortalOpen());
                      toast.info("Please sign up or log in to use the AI Workout Generator!");
                      return;
                    }
                    setShowAIModal(true);
                  }}
                >
                  Generate AI Routine
                </Button>
              )}
            </div>
          </div>

          <div className="my-workouts-action-bar">
            <div className="my-workouts-count-badge">
              <FitnessCenterIcon style={{ fontSize: "1.1rem", color: "var(--accent)" }} />
              <span>
                {user?.workouts?.length || 0} / 7 Routines
              </span>
            </div>

            <Button
              variant="primary"
              size="md"
              iconStart={<AddIcon />}
              disabled={isRoutineLimitReached}
              onClick={handleCreateNewRoutine}
            >
              Create Routine
            </Button>
          </div>

          {/* Routines Grid or Empty State */}
          {user?.workouts && user.workouts.length > 0 ? (
            <div className="my-workouts-grid">
              {user.workouts.map((elem) => (
                <WorkoutCard key={elem._id} workout={elem} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FitnessCenterIcon />}
              title="No Custom Routines Yet"
              description="Start your fitness journey by creating a personalized routine or use our AI Generator to build an optimal plan."
              action={
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Button variant="primary" size="md" iconStart={<AddIcon />} onClick={handleCreateNewRoutine}>
                    Create Custom Routine
                  </Button>
                  <Button
                    variant="accent"
                    size="md"
                    iconStart={<AutoAwesomeIcon />}
                    onClick={() => {
                      if (!isLoggedIn) {
                        dispatch(portalActions.setPortalOpen());
                        toast.info("Please sign up or log in to use the AI Workout Generator!");
                        return;
                      }
                      setShowAIModal(true);
                    }}
                  >
                    Generate with AI
                  </Button>
                </div>
              }
            />
          )}
        </>
      )}

      {showAIModal && (
        <div
          className="ai-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isGenerating) {
              setShowAIModal(false);
              setAiPrompt("");
              setAiGoal("General");
              navigate(location.pathname, { replace: true });
            }
          }}
        >
          {!isGenerating ? (
            <div className="ai-modal-content">
              <div className="ai-modal-header">
                <h2 className="ai-modal-title">
                  <AutoAwesomeIcon style={{ color: "var(--accent)" }} /> Generate <span className="title-highlight">AI Workout</span>
                </h2>
                <p className="ai-modal-subtitle">
                  Describe your training goals and routine preferences. Gemini will design an optimal routine mapped directly to our exercise database.
                </p>
              </div>

              <div className="ai-modal-body">
                {/* Dynamic Biometrics Health & Advisory Notice */}
                {!hasBiometrics ? (
                  <div className="ai-modal-warning-notice missing-biometrics">
                    <div className="warning-notice-header">
                      <InfoOutlinedIcon style={{ fontSize: "1rem", color: "#fde047" }} />
                      <span>Profile Metrics Notice</span>
                    </div>
                    <p>
                      Your age, weight, and height are not provided in your profile, so this routine will be generated with general assumptions. Please add them in your{" "}
                      <span
                        className="notice-settings-link"
                        onClick={() => {
                          setShowAIModal(false);
                          navigate(`/${user?.username}/settings`);
                        }}
                      >
                        Profile Settings
                      </span>{" "}
                      so we can provide more accurate, personalized workouts.
                    </p>
                  </div>
                ) : (
                  <div className="ai-modal-warning-notice biometrics-ready">
                    <div className="warning-notice-header">
                      <AutoAwesomeIcon style={{ fontSize: "0.95rem", color: "var(--accent, #00e5ff)" }} />
                      <span>Personalized Biometrics Active</span>
                    </div>
                    <p>
                      Calibrating routine to your profile metrics ({user.age} yrs • {user.weight} {weightUnit} • {user.height} {heightUnit}).
                    </p>
                  </div>
                )}

                <div className="ai-input-group">
                  <label className="ai-label" htmlFor="ai-workout-prompt">Custom Workout Prompt (Optional)</label>
                  <textarea
                    id="ai-workout-prompt"
                    className="ai-textarea"
                    rows="3"
                    placeholder="e.g., High intensity chest and triceps focus with dumbbells only, 45 minutes duration..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>

                <div className="ai-input-group">
                  <label className="ai-label" htmlFor="ai-goal-select">Primary Training Goal</label>
                  <div className="ai-select-wrapper">
                    <select
                      id="ai-goal-select"
                      className="ai-select-dropdown"
                      value={aiGoal}
                      onChange={(e) => setAiGoal(e.target.value)}
                    >
                      <option value="General">General Fitness & Full-Body Conditioning</option>
                      <option value="Muscle Gain (Hypertrophy)">Muscle Gain (Hypertrophy Focus)</option>
                      <option value="Strength">Strength & Powerlifting</option>
                      <option value="Fat Loss / HIIT">Fat Loss / HIIT & Conditioning</option>
                      <option value="Endurance">Cardiovascular & Muscular Endurance</option>
                      <option value="Athletic Performance">Functional Athletic Performance</option>
                    </select>
                  </div>
                </div>

                <div className="ai-input-group">
                  <label className="ai-label" htmlFor="ai-count-select">Target Number of Exercises</label>
                  <div className="ai-select-wrapper">
                    <select
                      id="ai-count-select"
                      className="ai-select-dropdown"
                      value={aiExerciseCount}
                      onChange={(e) => setAiExerciseCount(Number(e.target.value))}
                    >
                      <option value={3}>3 Exercises (Quick / Express Session)</option>
                      <option value={4}>4 Exercises (Targeted Focus)</option>
                      <option value={5}>5 Exercises (Balanced Standard Split)</option>
                      <option value={6}>6 Exercises (Full Comprehensive Workout)</option>
                      <option value={7}>7 Exercises (High Volume Hypertrophy)</option>
                      <option value={8}>8 Exercises (Elite High-Intensity Split)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ai-modal-footer">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setShowAIModal(false);
                    navigate(location.pathname, { replace: true });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  size="md"
                  iconStart={<AutoAwesomeIcon />}
                  onClick={handleGenerateAIWorkout}
                >
                  Generate Routine
                </Button>
              </div>
            </div>
          ) : (
            <div className="ai-modal-content loading-state">
              <div className="ai-generating-spinner">
                <div className="spinner-inner">
                  <AutoAwesomeIcon className="spinning-sparkle" />
                </div>
              </div>
              <h3 className="ai-loading-title">Crafting Your Custom Routine</h3>
              <p className="ai-loading-desc">{loadingMessage}</p>
              <div className="ai-loading-bar-wrapper">
                <div className="ai-loading-bar-fill"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyWorkouts;
