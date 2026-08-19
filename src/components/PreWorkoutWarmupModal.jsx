import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TimerIcon from "@mui/icons-material/Timer";
import CalculateIcon from "@mui/icons-material/Calculate";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import {
  WARMUP_ROUTINES_BY_MUSCLE,
  getDominantMuscleGroup,
  calculateWarmupPyramid,
} from "../utils/gymExperienceUtils";
import "../styles/_gymModals.scss";

const PreWorkoutWarmupModal = ({
  open,
  onClose,
  routineName,
  exercises = [],
  weightUnit = "kg",
  onWarmupFinished,
}) => {
  const [activeTab, setActiveTab] = useState("stretches"); // 'stretches' | 'pyramid'
  const [completedSteps, setCompletedSteps] = useState({});
  const [expandedInstructions, setExpandedInstructions] = useState({});
  const [workingWeight, setWorkingWeight] = useState(60);

  const dominantMuscle = getDominantMuscleGroup(exercises);
  const warmupList =
    WARMUP_ROUTINES_BY_MUSCLE[dominantMuscle] || WARMUP_ROUTINES_BY_MUSCLE.default;

  // Derive initial working weight from first exercise
  useEffect(() => {
    if (exercises && exercises.length > 0 && exercises[0].sets && exercises[0].sets[0]) {
      setWorkingWeight(exercises[0].sets[0].weight || 60);
    }
  }, [exercises]);

  if (!open) return null;

  const toggleStep = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleInstructions = (e, idx) => {
    e.stopPropagation();
    setExpandedInstructions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const isAllDone = completedCount === warmupList.length;

  const pyramidSteps = calculateWarmupPyramid(
    Number(workingWeight) || 60,
    weightUnit === "lbs" ? 45 : 20
  );

  return createPortal(
    <div className="gym-modal-backdrop" onClick={onClose}>
      <div className="gym-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gym-modal-header">
          <div className="header-left">
            <div className="header-icon-wrap warmup">
              <WhatshotIcon />
            </div>
            <div>
              <h2 className="gym-modal-title">Pre-Workout Warm-Up & Mobility</h2>
              <p className="gym-modal-subtitle">
                Targeted for <strong>{routineName}</strong> ({dominantMuscle.toUpperCase()} Split)
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
            className={`gym-modal-tab ${activeTab === "stretches" ? "active" : ""}`}
            onClick={() => setActiveTab("stretches")}
          >
            <TimerIcon style={{ fontSize: "1rem" }} />
            <span>Dynamic Mobility ({warmupList.length} Steps)</span>
          </button>
          <button
            className={`gym-modal-tab ${activeTab === "pyramid" ? "active" : ""}`}
            onClick={() => setActiveTab("pyramid")}
          >
            <CalculateIcon style={{ fontSize: "1rem" }} />
            <span>Warm-up Sets Pyramid</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="gym-modal-body">
          {activeTab === "stretches" ? (
            <div className="warmup-stretches-container">
              <div className="warmup-progress-banner">
                <span>
                  Warm-Up Progress: <strong>{completedCount} / {warmupList.length} completed</strong>
                </span>
                <span className="warmup-pill-muscle">{dominantMuscle.toUpperCase()} ACTIVATION</span>
              </div>

              <div className="warmup-steps-list">
                {warmupList.map((step, idx) => {
                  const done = Boolean(completedSteps[idx]);
                  const isExpanded = Boolean(expandedInstructions[idx]);
                  return (
                    <div
                      key={idx}
                      className={`warmup-step-card ${done ? "done" : ""}`}
                      onClick={() => toggleStep(idx)}
                    >
                      <div className="step-main-row">
                        <button className="step-check-circle" type="button">
                          {done ? (
                            <CheckCircleIcon style={{ color: "#00e676" }} />
                          ) : (
                            <RadioButtonUncheckedIcon style={{ color: "#64748b" }} />
                          )}
                        </button>
                        <div className="step-info">
                          <div className="step-top-row">
                            <h4 className="step-name">{step.name}</h4>
                            <span className="step-badge">{step.duration} • {step.reps}</span>
                          </div>
                          <p className="step-target">🎯 Target: {step.target}</p>
                        </div>
                        <button
                          className="step-expand-instructions-btn"
                          onClick={(e) => toggleInstructions(e, idx)}
                          title="View step-by-step instructions"
                          type="button"
                        >
                          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </button>
                      </div>

                      {/* Expandable Technique & Step-by-Step Instructions */}
                      {isExpanded && (
                        <div className="step-expanded-instructions-pane" onClick={(e) => e.stopPropagation()}>
                          <div className="instructions-list">
                            <h5 className="instructions-title">📋 Step-by-Step Execution:</h5>
                            <ol>
                              {step.instructions?.map((inst, iIdx) => (
                                <li key={iIdx}>{inst}</li>
                              ))}
                            </ol>
                          </div>
                          {step.cue && (
                            <div className="instructions-pro-tip">
                              <TipsAndUpdatesIcon style={{ fontSize: "1rem", color: "#ff9800" }} />
                              <span><strong>Pro Form Cue:</strong> {step.cue}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="warmup-pyramid-container">
              <div className="pyramid-input-box">
                <label>Target Working Set Weight ({weightUnit}):</label>
                <div className="pyramid-input-wrap">
                  <input
                    type="number"
                    value={workingWeight}
                    onChange={(e) => setWorkingWeight(e.target.value)}
                    min={weightUnit === "lbs" ? 45 : 20}
                    step={2.5}
                  />
                  <span className="unit-label">{weightUnit}</span>
                </div>
              </div>

              <p className="pyramid-desc">
                Progressive neuromuscular potentiation sequence before your first heavy working set:
              </p>

              <div className="pyramid-steps-grid">
                {pyramidSteps.map((s, idx) => (
                  <div key={idx} className="pyramid-step-card">
                    <div className="pyramid-step-num">Step {s.step}</div>
                    <div className="pyramid-step-main">
                      <div className="pyramid-percent">{s.percent}</div>
                      <div className="pyramid-weight">
                        {s.weight} {weightUnit}
                      </div>
                      <div className="pyramid-reps">{s.reps} reps</div>
                    </div>
                    <div className="pyramid-cue">{s.cue}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="gym-modal-footer">
          <button className="secondary-modal-btn" onClick={onClose}>
            Skip Warm-up
          </button>
          <button
            className="primary-modal-btn"
            onClick={() => {
              if (onWarmupFinished) onWarmupFinished();
              onClose();
            }}
          >
            <PlayArrowIcon />
            <span>{isAllDone ? "Warm-up Done! Start Lifting" : "Ready to Train"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PreWorkoutWarmupModal;
