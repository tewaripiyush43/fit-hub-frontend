import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpaIcon from "@mui/icons-material/Spa";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import ShareIcon from "@mui/icons-material/Share";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import {
  COOLDOWN_STRETCHES_BY_MUSCLE,
  getDominantMuscleGroup,
  playRestTimerChime,
} from "../utils/gymExperienceUtils";
import "../styles/_gymModals.scss";

const PostWorkoutCooldownModal = ({
  open,
  onClose,
  onBackToSummary,
  routineName,
  duration = "00:00",
  totalVolume = 0,
  completedSets = 0,
  weightUnit = "kg",
  exercises = [],
  onShare,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stretch"); // 'stretch' | 'nutrition'
  const dominantMuscle = getDominantMuscleGroup(exercises);
  const stretches =
    COOLDOWN_STRETCHES_BY_MUSCLE[dominantMuscle] || COOLDOWN_STRETCHES_BY_MUSCLE.default;

  const [currentStretchIdx, setCurrentStretchIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stretches[0]?.duration || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [completedStretches, setCompletedStretches] = useState({});
  const timerRef = useRef(null);

  // Recommended Post-Workout Nutrition calculation
  const recommendedProtein = Math.max(25, Math.min(45, Math.round(25 + (totalVolume / 1000) * 2)));
  const recommendedWater = Math.max(500, Math.min(1200, Math.round(500 + (totalVolume / 500) * 50)));

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (stretches[currentStretchIdx]) {
      setTimeLeft(stretches[currentStretchIdx].duration);
    }
  }, [currentStretchIdx, stretches]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playRestTimerChime();
      setCompletedStretches((prev) => ({ ...prev, [currentStretchIdx]: true }));
      setIsRunning(false);
      if (currentStretchIdx < stretches.length - 1) {
        setTimeout(() => {
          setCurrentStretchIdx((prev) => prev + 1);
          setIsRunning(true);
        }, 1200);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, currentStretchIdx, stretches.length]);

  if (!open) return null;

  const currentStretch = stretches[currentStretchIdx] || stretches[0];
  const progressPercent = Math.round(
    ((currentStretch.duration - timeLeft) / currentStretch.duration) * 100
  );

  const handleNextStretch = () => {
    setCompletedStretches((prev) => ({ ...prev, [currentStretchIdx]: true }));
    if (currentStretchIdx < stretches.length - 1) {
      setCurrentStretchIdx((prev) => prev + 1);
      setIsRunning(true);
    }
  };

  return createPortal(
    <div className="gym-modal-backdrop" onClick={onClose}>
      <div className="gym-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gym-modal-header">
          <div className="header-left">
            <div className="header-icon-wrap cooldown">
              <SpaIcon />
            </div>
            <div>
              <h2 className="gym-modal-title">Workout Finished! Cooldown & Recovery</h2>
              <p className="gym-modal-subtitle">
                {routineName} • ⏱️ {duration} • 🏋️ {(totalVolume || 0).toLocaleString()} {weightUnit}
              </p>
            </div>
          </div>
          <button className="gym-modal-close-btn" onClick={onClose} title="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="gym-modal-tabs">
          <button
            className={`gym-modal-tab ${activeTab === "stretch" ? "active" : ""}`}
            onClick={() => setActiveTab("stretch")}
          >
            <SpaIcon style={{ fontSize: "1rem" }} />
            <span>Guided Stretches ({stretches.length} Moves)</span>
          </button>
          <button
            className={`gym-modal-tab ${activeTab === "nutrition" ? "active" : ""}`}
            onClick={() => setActiveTab("nutrition")}
          >
            <RestaurantIcon style={{ fontSize: "1rem" }} />
            <span>Nutrition & Protein Match</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="gym-modal-body">
          {activeTab === "stretch" ? (
            <div className="cooldown-stretch-container">
              {/* Active Timer Box */}
              <div className="stretch-timer-card">
                <div className="stretch-number-indicator">
                  Stretch {currentStretchIdx + 1} of {stretches.length}
                </div>
                <h3 className="active-stretch-name">{currentStretch.name}</h3>
                <div className="stretch-target-pill">🎯 {currentStretch.target}</div>

                <div className="stretch-countdown-circle">
                  <div className="countdown-number">{timeLeft}s</div>
                  <div className="countdown-label">HOLD STRETCH</div>
                </div>

                {/* Step-by-Step Instructions */}
                {currentStretch.instructions && (
                  <div className="stretch-instructions-box">
                    <h5>📋 Instructions:</h5>
                    <ol>
                      {currentStretch.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {currentStretch.cue && (
                  <div className="stretch-cue-box">
                    <TipsAndUpdatesIcon style={{ fontSize: "1rem", color: "#00e676" }} />
                    <span><strong>Form Cue:</strong> {currentStretch.cue}</span>
                  </div>
                )}

                {/* Controls */}
                <div className="stretch-controls-row">
                  <button
                    className={`stretch-play-btn ${isRunning ? "running" : ""}`}
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
                    <span>{isRunning ? "Pause" : "Start Timer"}</span>
                  </button>

                  <button
                    className="stretch-skip-btn"
                    onClick={handleNextStretch}
                    disabled={currentStretchIdx === stretches.length - 1}
                  >
                    <SkipNextIcon />
                    <span>Next Move</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="stretch-progress-track">
                  <div
                    className="stretch-progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stretch list overview */}
              <div className="all-stretches-list">
                {stretches.map((s, sIdx) => {
                  const isDone = Boolean(completedStretches[sIdx]);
                  const isCurrent = sIdx === currentStretchIdx;
                  return (
                    <div
                      key={sIdx}
                      className={`mini-stretch-item ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}`}
                      onClick={() => {
                        setCurrentStretchIdx(sIdx);
                        setIsRunning(false);
                      }}
                    >
                      <div className="mini-item-left">
                        {isDone ? (
                          <CheckCircleIcon style={{ color: "#00e676", fontSize: "1.1rem" }} />
                        ) : (
                          <span className="mini-num">#{sIdx + 1}</span>
                        )}
                        <span className="mini-name">{s.name}</span>
                      </div>
                      <span className="mini-duration">{s.duration}s</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="cooldown-nutrition-container">
              <div className="nutrition-summary-card">
                <div className="nutrition-stat-grid">
                  <div className="nutrition-stat-box protein">
                    <RestaurantIcon className="nutri-icon" />
                    <div className="nutri-val">
                      {recommendedProtein}g <span className="nutri-unit">Protein</span>
                    </div>
                    <div className="nutri-lbl">Recommended post-workout target</div>
                  </div>

                  <div className="nutrition-stat-box water">
                    <LocalDrinkIcon className="nutri-icon" />
                    <div className="nutri-val">
                      {recommendedWater}ml <span className="nutri-unit">Water</span>
                    </div>
                    <div className="nutri-lbl">Hydration replenishment goal</div>
                  </div>
                </div>

                <div className="nutrition-guide-callout">
                  <h4>🥩 Anabolic Recovery Window</h4>
                  <p>
                    Within 45 minutes of finishing high-intensity resistance training, consume <strong>{recommendedProtein}g of fast-digesting protein</strong> (Whey, Eggs, Chicken, or Tofu) combined with complex carbs to maximize muscle protein synthesis and glycogen restoration.
                  </p>
                </div>

                <button
                  className="explore-recipes-cta-btn"
                  onClick={() => {
                    onClose();
                    navigate("/recipes");
                  }}
                >
                  <RestaurantIcon /> Explore High-Protein Recipes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="gym-modal-footer">
          {onBackToSummary && (
            <button className="secondary-modal-btn" onClick={onBackToSummary}>
              <EmojiEventsIcon fontSize="small" /> Summary
            </button>
          )}
          {onShare && (
            <button className="secondary-modal-btn" onClick={onShare}>
              <ShareIcon fontSize="small" /> Share Log
            </button>
          )}
          <button className="primary-modal-btn" onClick={onClose}>
            Finish & Return to Dashboard
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PostWorkoutCooldownModal;
