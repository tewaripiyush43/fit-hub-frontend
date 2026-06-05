import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { addWorkout, generateAIWorkout } from "../api/workoutApi";
import WorkoutCard from "./WorkoutCard";

const MyWorkouts = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
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
    if (params.get("ai") === "true") {
      setShowAIModal(true);
    } else {
      setShowAIModal(false);
    }
  }, [location.search]);

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
              onClick={() => setShowAIModal(true)}
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
            onClick={() =>
              addWorkout(dispatch, "Untitled Workout", REACT_APP_BASE_URL)
            }
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
                    <label htmlFor="aiWeight">Weight (kg)</label>
                    <input
                      type="number"
                      id="aiWeight"
                      placeholder="e.g. 70"
                      value={aiWeight}
                      onChange={(e) => setAiWeight(e.target.value)}
                    />
                  </div>
                  <div className="form-group half-width">
                    <label htmlFor="aiHeight">Height (cm)</label>
                    <input
                      type="number"
                      id="aiHeight"
                      placeholder="e.g. 175"
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



