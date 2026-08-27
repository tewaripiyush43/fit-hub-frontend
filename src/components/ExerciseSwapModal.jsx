import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchSubstitutions } from "../api/exerciseApi";
import { toast } from "../helpers/errorPopUp";
import "../styles/_gymModals.scss";

const ExerciseSwapModal = ({
  open,
  onClose,
  currentExercise,
  onSwapConfirm,
  onSelectSubstitute,
}) => {
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Load alternatives when modal opens
  useEffect(() => {
    if (!open || !currentExercise) return;

    const loadSubstitutes = async () => {
      setLoading(true);
      try {
        const target = currentExercise.target || currentExercise.bodyPart || "";
        const data = await fetchSubstitutions(currentExercise._id || currentExercise.id, target);
        setSubstitutes(data || []);
      } catch (err) {
        console.error("Failed to load substitutions:", err);
        toast.error("Could not load exercise alternatives.");
      } finally {
        setLoading(false);
      }
    };

    loadSubstitutes();
  }, [open, currentExercise]);

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

  if (!open) return null;

  const handleConfirmSwap = () => {
    if (!selectedExercise) {
      toast.info("Please select an alternative exercise first.");
      return;
    }
    const oldId = currentExercise?._id || currentExercise?.id;
    if (onSwapConfirm) {
      onSwapConfirm(oldId, selectedExercise);
    } else if (onSelectSubstitute) {
      onSelectSubstitute(selectedExercise);
    }
    onClose();
  };

  return createPortal(
    <div
      className="gym-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-swap-title"
    >
      <div className="gym-modal-card swap-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gym-modal-header">
          <div className="header-left">
            <div className="header-icon-wrap swap">
              <SwapHorizIcon />
            </div>
            <div>
              <h2 id="exercise-swap-title" className="gym-modal-title">Swap Exercise</h2>
              <p className="gym-modal-subtitle">
                Substitute <strong>{currentExercise?.name}</strong> with a biomechanically equivalent exercise
              </p>
            </div>
          </div>
          <button className="gym-modal-close-btn" onClick={onClose} title="Close" aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="gym-modal-body">
          {loading ? (
            <div className="swap-loading-state">
              <CircularProgress size={32} style={{ color: "#00f0ff" }} />
              <p>Finding biomechanically matched exercises...</p>
            </div>
          ) : substitutes.length === 0 ? (
            <div className="swap-empty-state">
              <FitnessCenterIcon style={{ fontSize: "2.5rem", color: "rgba(255, 255, 255, 0.2)" }} />
              <p>No direct alternatives found for this target muscle group.</p>
            </div>
          ) : (
            <div className="swap-options-list">
              {substitutes.map((ex) => {
                const isSelected = selectedExercise?._id === ex._id || selectedExercise?.id === ex.id;
                return (
                  <div
                    key={ex._id || ex.id}
                    className={`swap-option-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedExercise(ex)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedExercise(ex);
                      }
                    }}
                  >
                    <div className="swap-card-left">
                      {ex.gifUrl ? (
                        <img
                          src={ex.gifUrl}
                          alt={ex.name}
                          className="swap-gif"
                          loading="lazy"
                        />
                      ) : (
                        <div className="swap-placeholder-icon">
                          <FitnessCenterIcon />
                        </div>
                      )}
                    </div>
                    <div className="swap-card-info">
                      <div className="swap-name-row">
                        <span className="swap-name">{ex.name}</span>
                        {isSelected && <CheckCircleIcon className="selected-check" />}
                      </div>
                      <div className="swap-tags">
                        <span className="sub-tag target-tag">{ex.target}</span>
                        <span className="sub-tag equip-tag">{ex.equipment}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="gym-modal-footer swap-footer">
          <button type="button" className="btn-secondary-action" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary-action"
            onClick={handleConfirmSwap}
            disabled={!selectedExercise}
          >
            <SwapHorizIcon style={{ fontSize: "1.1rem" }} />
            <span>Confirm Swap</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ExerciseSwapModal;
