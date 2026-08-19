import React, { useState } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {
  calculatePlates,
  PLATE_COLORS_KG,
  PLATE_COLORS_LBS,
} from "../utils/gymExperienceUtils";
import "../styles/_gymModals.scss";

const PlateCalculatorModal = ({
  open,
  onClose,
  initialWeight = 60,
  unit = "kg",
}) => {
  const [targetWeight, setTargetWeight] = useState(initialWeight || 60);
  const [currentUnit, setCurrentUnit] = useState(unit || "kg");
  const [barWeight, setBarWeight] = useState(currentUnit === "lbs" ? 45 : 20);

  if (!open) return null;

  const handleUnitToggle = (newUnit) => {
    setCurrentUnit(newUnit);
    setBarWeight(newUnit === "lbs" ? 45 : 20);
    if (newUnit === "lbs" && currentUnit === "kg") {
      setTargetWeight(Math.round(targetWeight * 2.20462));
    } else if (newUnit === "kg" && currentUnit === "lbs") {
      setTargetWeight(Math.round(targetWeight / 2.20462));
    }
  };

  const plateCalc = calculatePlates(
    Number(targetWeight) || 0,
    currentUnit,
    Number(barWeight) || (currentUnit === "lbs" ? 45 : 20)
  );

  const plateColors = currentUnit === "lbs" ? PLATE_COLORS_LBS : PLATE_COLORS_KG;

  // Group plate counts per side (e.g. 2 x 20kg, 1 x 5kg)
  const plateCounts = {};
  plateCalc.platesPerSide.forEach((p) => {
    plateCounts[p] = (plateCounts[p] || 0) + 1;
  });

  return createPortal(
    <div className="gym-modal-backdrop" onClick={onClose}>
      <div className="gym-modal-card plate-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gym-modal-header">
          <div className="header-left">
            <div className="header-icon-wrap plate">
              <FitnessCenterIcon />
            </div>
            <div>
              <h2 className="gym-modal-title">Barbell Plate Calculator</h2>
              <p className="gym-modal-subtitle">
                Exact plates to load on each side of the barbell
              </p>
            </div>
          </div>
          <button className="gym-modal-close-btn" onClick={onClose} title="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Input & Unit Row */}
        <div className="plate-input-section">
          <div className="plate-field-group">
            <label>Target Weight</label>
            <div className="weight-stepper-input">
              <button
                type="button"
                className="step-btn"
                onClick={() => setTargetWeight((w) => Math.max(barWeight, Number(w) - (currentUnit === "lbs" ? 5 : 2.5)))}
              >
                −
              </button>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                min={barWeight}
                step={currentUnit === "lbs" ? 5 : 2.5}
              />
              <button
                type="button"
                className="step-btn"
                onClick={() => setTargetWeight((w) => Number(w) + (currentUnit === "lbs" ? 5 : 2.5))}
              >
                +
              </button>
            </div>
          </div>

          <div className="plate-field-group">
            <label>Unit & Bar Weight</label>
            <div className="unit-toggle-group">
              <button
                type="button"
                className={`unit-btn ${currentUnit === "kg" ? "active" : ""}`}
                onClick={() => handleUnitToggle("kg")}
              >
                KG (20kg Bar)
              </button>
              <button
                type="button"
                className={`unit-btn ${currentUnit === "lbs" ? "active" : ""}`}
                onClick={() => handleUnitToggle("lbs")}
              >
                LBS (45lb Bar)
              </button>
            </div>
          </div>
        </div>

        {/* Realistic Centered Olympic Barbell Graphic */}
        <div className="barbell-visualizer-container">
          <div className="barbell-graphic">
            {/* Left Sleeve (Outer Tip -> Lighter Plates -> Heavy Plates -> Inner Collar) */}
            <div className="barbell-sleeve-side left-side">
              <div className="sleeve-outer-cap"></div>
              <div className="sleeve-steel-bar">
                <div className="plates-stack left">
                  {[...plateCalc.platesPerSide].reverse().map((p, idx) => (
                    <div
                      key={idx}
                      className={`plate-disc plate-${String(p).replace(".", "_")}`}
                      style={{
                        backgroundColor: plateColors[p] || "#94a3b8",
                        color: ["#ffffff", "#22c55e", "#eab308"].includes(plateColors[p]) ? "#000" : "#fff",
                      }}
                      title={`${p} ${currentUnit}`}
                    >
                      <span className="plate-text">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sleeve-inner-collar"></div>
            </div>

            {/* Center Shaft with Steel Knurling and Bar Label */}
            <div className="barbell-shaft-center">
              <div className="shaft-knurling left-knurl"></div>
              <div className="shaft-label-badge">
                Bar: {plateCalc.barWeight} {currentUnit}
              </div>
              <div className="shaft-knurling right-knurl"></div>
            </div>

            {/* Right Sleeve (Inner Collar -> Heavy Plates -> Lighter Plates -> Outer Tip) */}
            <div className="barbell-sleeve-side right-side">
              <div className="sleeve-inner-collar"></div>
              <div className="sleeve-steel-bar">
                <div className="plates-stack right">
                  {plateCalc.platesPerSide.map((p, idx) => (
                    <div
                      key={idx}
                      className={`plate-disc plate-${String(p).replace(".", "_")}`}
                      style={{
                        backgroundColor: plateColors[p] || "#94a3b8",
                        color: ["#ffffff", "#22c55e", "#eab308"].includes(plateColors[p]) ? "#000" : "#fff",
                      }}
                      title={`${p} ${currentUnit}`}
                    >
                      <span className="plate-text">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sleeve-outer-cap"></div>
            </div>
          </div>
        </div>

        {/* Plate Breakdown Summary */}
        <div className="plate-summary-card">
          <div className="summary-title-row">
            <h4>Load Per Side: <strong>{plateCalc.perSideWeight} {currentUnit}</strong></h4>
            <span className="total-loaded-badge">Total: {plateCalc.totalWeight} {currentUnit}</span>
          </div>

          {plateCalc.platesPerSide.length === 0 ? (
            <p className="no-plates-note">Just the empty barbell ({plateCalc.barWeight} {currentUnit})</p>
          ) : (
            <div className="plate-chips-list">
              {Object.keys(plateCounts).map((plateWeight) => (
                <div key={plateWeight} className="plate-chip">
                  <span
                    className="chip-color-dot"
                    style={{ backgroundColor: plateColors[plateWeight] || "#00f0ff" }}
                  />
                  <span className="chip-count">{plateCounts[plateWeight]}×</span>
                  <span className="chip-weight">{plateWeight} {currentUnit}</span>
                </div>
              ))}
            </div>
          )}

          {!plateCalc.exact && (
            <div className="plate-remainder-warning">
              ⚠️ Note: Small remainder of {plateCalc.remainder} {currentUnit} cannot be evenly loaded with standard plates.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="gym-modal-footer">
          <button className="primary-modal-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PlateCalculatorModal;
