import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckIcon from "@mui/icons-material/Check";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { findExercisesByBodyPart, findExercisesByMuscle, fetchExercises } from "../api/exerciseApi";
import "../styles/_gymModals.scss";

const ExerciseSwapModal = ({
  open,
  onClose,
  currentExercise,
  onSwapConfirm,
}) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState(null);

  useEffect(() => {
    if (!open || !currentExercise) return;

    const loadAlternatives = async () => {
      setLoading(true);
      try {
        let results = [];
        const target = currentExercise.target || currentExercise.targetMuscle;
        const bodyPart = currentExercise.bodyPart;

        if (target) {
          try {
            results = await findExercisesByMuscle(target);
          } catch (e) {
            results = [];
          }
        }

        if ((!results || results.length < 3) && bodyPart) {
          try {
            const byBp = await findExercisesByBodyPart(bodyPart);
            results = [...(results || []), ...(byBp || [])];
          } catch (e) {
            // ignore
          }
        }

        if (!results || results.length === 0) {
          const fallback = await fetchExercises(currentExercise.name?.split(" ")[0] || "press", 1);
          results = fallback || [];
        }

        // Filter out current exercise and duplicates
        const unique = [];
        const seenIds = new Set([currentExercise._id]);

        (results || []).forEach((item) => {
          if (item && item._id && !seenIds.has(item._id)) {
            seenIds.add(item._id);
            unique.push(item);
          }
        });

        setAlternatives(unique.slice(0, 8));
      } catch (err) {
        console.error("Failed to load alternatives:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAlternatives();
  }, [open, currentExercise]);

  if (!open || !currentExercise) return null;

  return createPortal(
    <div className="gym-modal-backdrop" onClick={onClose}>
      <div className="gym-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gym-modal-header">
          <div className="header-left">
            <div className="header-icon-wrap warmup">
              <SwapHorizIcon />
            </div>
            <div>
              <h2 className="gym-modal-title">Swap / Substitute Exercise</h2>
              <p className="gym-modal-subtitle">
                Equipment busy? Pick an alternative for <strong>{currentExercise.name}</strong>
              </p>
            </div>
          </div>
          <button className="gym-modal-close-btn" onClick={onClose} title="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="gym-modal-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              Finding best matching alternatives...
            </div>
          ) : alternatives.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              No instant alternatives found. You can add another exercise from My Workouts.
            </div>
          ) : (
            <div className="alternatives-list-grid">
              {alternatives.map((alt) => {
                const isSelected = selectedAlternative?._id === alt._id;
                return (
                  <div
                    key={alt._id}
                    className={`alternative-exercise-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedAlternative(alt)}
                  >
                    <div className="alt-card-left">
                      {alt.gifUrl ? (
                        <img src={alt.gifUrl} alt={alt.name} className="alt-thumb-gif" />
                      ) : (
                        <div className="alt-thumb-placeholder">
                          <FitnessCenterIcon />
                        </div>
                      )}
                      <div className="alt-info">
                        <h4 className="alt-name">{alt.name}</h4>
                        <div className="alt-meta-tags">
                          <span className="alt-tag target">{alt.target || alt.bodyPart}</span>
                          {alt.equipment && (
                            <span className="alt-tag equip">{alt.equipment}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button className={`alt-select-btn ${isSelected ? "active" : ""}`} type="button">
                      {isSelected ? <CheckIcon fontSize="small" /> : "Select"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="gym-modal-footer">
          <button className="secondary-modal-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary-modal-btn"
            disabled={!selectedAlternative}
            onClick={() => {
              if (selectedAlternative && onSwapConfirm) {
                onSwapConfirm(currentExercise._id, selectedAlternative);
                onClose();
              }
            }}
          >
            <SwapHorizIcon /> Confirm Swap
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ExerciseSwapModal;
