import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StarIcon from "@mui/icons-material/Star";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast } from "react-toastify";

import { addWorkout, generateAIWorkout } from "../api/workoutApi";
import { portalActions } from "../store/index";
import WorkoutCard from "./WorkoutCard";
import GlobalWorkouts from "./GlobalWorkouts";
import { useUnitPreference } from "../utils/useUnitPreference";

const MyWorkouts = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { weightUnit, heightUnit, isMetric } = useUnitPreference();

  const [activeView, setActiveView] = useState("my_workouts");
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGoal, setAiGoal] = useState("General");
  const [aiWeight, setAiWeight] = useState("");
  const [aiHeight, setAiHeight] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Connecting to Gemini...");

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
        "Reviewing your long & short term goals...",
        "Considering your favorite exercises...",
        "Structuring custom workout plan...",
        "Mapping exercises to database...",
        "Saving custom workout..."
      ];
      let idx = 0;
      setLoadingMessage(messages[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % messages.length;
        setLoadingMessage(messages[idx]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

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
        weight: aiWeight ? Number(aiWeight) : undefined,
        height: aiHeight ? Number(aiHeight) : undefined,
      };
      const result = await generateAIWorkout(dispatch, payload, REACT_APP_BASE_URL);
      setIsGenerating(false);
      setShowAIModal(false);
      setAiPrompt("");
      setAiWeight("");
      setAiHeight("");
      setAiGoal("General");
      if (result && result.workoutId) {
        navigate(`${result.workoutId}-${result.workoutName}`);
      }
    } catch (error) {
      console.error("AI Workout Generation failed:", error);
      setIsGenerating(false);
    }
  };

  const isProfileIncomplete = !user?.age || !user?.goals || user?.goals?.length === 0;

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
              {user?.workouts?.length >= 7 ? (
                <div className="ai-workout-banner-limit">
                  <span className="ai-workout-banner-limit-badge">Routine Limit Reached (7/7)</span>
                  <p className="ai-workout-banner-limit-desc">Delete an existing workout to generate a new AI routine.</p>
                </div>
              ) : (
                <button
                  className="ai-workout-banner-btn"
                  onClick={() => {
                    if (!isLoggedIn) {
                      dispatch(portalActions.setPortalOpen());
                      toast.info("Please sign up or log in to use the AI Workout Generator!");
                      return;
                    }
                    setShowAIModal(true);
                  }}
                >
                  <AutoAwesomeIcon />
                  <span>Generate Workout</span>
                </button>
              )}
            </div>
          </div>

          <div className="my-workout-cards-container">
            {user?.workouts?.length < 7 && (
              <div
                onClick={async () => {
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
                }}
                className="create-new-workout-card"
              >
                <div className="create-new-workout-card-icon">+ &nbsp;</div>
                <p className="create-new-workout-card-text">Create New Workout</p>
              </div>
            )}
            {user?.workouts?.map((workout, index) => (
              <WorkoutCard
                key={typeof workout === "string" ? workout : (workout?._id || index)}
                workout={workout}
                index={index}
              />
            ))}
          </div>
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
              setAiWeight("");
              setAiHeight("");
              navigate(location.pathname, { replace: true });
            }
          }}
        >
          {!isGenerating ? (
            <div className="ai-modal-content">
              <div className="ai-modal-header">
                <h2 className="ai-modal-title">
                  <AutoAwesomeIcon style={{ color: "#00b3e6" }} /> Generate <span className="title-highlight">AI Workout</span>
                </h2>
                <p className="ai-modal-subtitle">
                  Gemini AI will design a custom workout based on your fitness goals, age, bio, and favorite exercises.
                </p>
                {isProfileIncomplete && (
                  <p className="ai-modal-warning">
                    ⚠️ Goals/age not set in profile. We'll generate a general plan, but completing your profile will give you a highly customized workout!
                  </p>
                )}
              </div>
              <div className="ai-modal-form">
                <div className="form-row">
                  <div className="form-group half-width">
                    <label htmlFor="aiWeight">Weight ({weightUnit})</label>
                    <input
                      type="number"
                      id="aiWeight"
                      placeholder={`e.g. ${isMetric ? "70" : "155"}`}
                      value={aiWeight}
                      onChange={(e) => setAiWeight(e.target.value)}
                    />
                  </div>
                  <div className="form-group half-width">
                    <label htmlFor="aiHeight">Height ({heightUnit})</label>
                    <input
                      type="number"
                      id="aiHeight"
                      placeholder={`e.g. ${isMetric ? "175" : "69"}`}
                      value={aiHeight}
                      onChange={(e) => setAiHeight(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="aiGoal">Fitness Goal / Style</label>
                  <select
                    id="aiGoal"
                    value={aiGoal}
                    onChange={(e) => setAiGoal(e.target.value)}
                  >
                    <option value="General">General Fitness / Just Chilling</option>
                    <option value="Bodybuilding">Bodybuilding</option>
                    <option value="Aesthetics">Aesthetics</option>
                    <option value="Strength">Strength Training</option>
                    <option value="Endurance">Endurance / Cardio</option>
                    <option value="Weight Loss">Weight Loss / Fat Burn</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="aiPrompt">What is your focus for today?</label>
                  <textarea
                    id="aiPrompt"
                    rows={3}
                    placeholder="e.g. 20-minute bodyweight cardio, focus on upper body strength, dumbbells only, etc."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>
              </div>
              <div className="ai-modal-buttons">
                <button
                  className="ai-btn-cancel"
                  onClick={() => {
                    setShowAIModal(false);
                    setAiPrompt("");
                    setAiGoal("General");
                    setAiWeight("");
                    setAiHeight("");
                    navigate(location.pathname, { replace: true });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="ai-btn-generate"
                  onClick={handleGenerateAIWorkout}
                >
                  Generate
                </button>
              </div>
            </div>
          ) : (
            <div className="ai-loading-content">
              <div className="ai-spinner-container">
                <div className="ai-spinner"></div>
                <div className="ai-spinner-inner"></div>
                <AutoAwesomeIcon className="ai-spinner-sparkle" />
              </div>
              <p className="ai-loading-title">Generating Workout</p>
              <p className="ai-loading-subtitle">{loadingMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyWorkouts;



