import React from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CalculateIcon from "@mui/icons-material/Calculate";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import "../styles/_gymModals.scss";

const GymSessionLegendModal = ({ open, onClose }) => {
  if (!open) return null;

  return createPortal(
    <div className="gym-modal-backdrop" onClick={onClose}>
      <div className="gym-modal-card legend-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gym-modal-header">
          <div className="header-left">
            <div className="header-icon-wrap plate">
              <HelpOutlineIcon />
            </div>
            <div>
              <h2 className="gym-modal-title">Gym Tools & Set Types Guide</h2>
              <p className="gym-modal-subtitle">
                Everything you need to know for smooth and effective workout tracking
              </p>
            </div>
          </div>
          <button className="gym-modal-close-btn" onClick={onClose} title="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="gym-modal-body">
          {/* Section 1: Set Types (N, W, D, F) */}
          <div className="legend-section">
            <h3 className="legend-section-title">
              🏷️ Set Type Badges (Click badge on any row to cycle)
            </h3>
            <div className="set-tags-legend-grid">
              <div className="set-tag-card">
                <div className="tag-header">
                  <span className="set-tag-badge tag-n">N</span>
                  <span className="tag-name">Normal Working Set</span>
                </div>
                <p className="tag-desc">
                  Your primary working sets performed with your target training weight to drive hypertrophy and strength.
                </p>
              </div>

              <div className="set-tag-card">
                <div className="tag-header">
                  <span className="set-tag-badge tag-w">W</span>
                  <span className="tag-name">Warm-up Set</span>
                </div>
                <p className="tag-desc">
                  Lightweight preparatory sets (e.g. 50–75% load) to lubricate joints and groove technique before heavy loads.
                </p>
              </div>

              <div className="set-tag-card">
                <div className="tag-header">
                  <span className="set-tag-badge tag-d">D</span>
                  <span className="tag-name">Drop Set</span>
                </div>
                <p className="tag-desc">
                  Performed immediately after your main set by dropping the weight ~25% with zero rest to push muscle fibers to fatigue.
                </p>
              </div>

              <div className="set-tag-card">
                <div className="tag-header">
                  <span className="set-tag-badge tag-f">F</span>
                  <span className="tag-name">Failure Set</span>
                </div>
                <p className="tag-desc">
                  Pushed to true concentric muscular failure (0 RIR / Reps in Reserve) where no further clean reps can be completed.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: In-Session Tools */}
          <div className="legend-section">
            <h3 className="legend-section-title">
              🛠️ In-Session Training Tools
            </h3>
            <div className="tools-legend-list">
              <div className="tool-legend-item">
                <div className="tool-icon-pill">
                  <CalculateIcon /> Plates
                </div>
                <div className="tool-text">
                  <strong>Barbell Plate Calculator:</strong> Tap on any exercise to see exact plate breakdowns per sleeve for 20kg or 45lb bars.
                </div>
              </div>

              <div className="tool-legend-item">
                <div className="tool-icon-pill">
                  <SwapHorizIcon /> Swap
                </div>
                <div className="tool-text">
                  <strong>1-Tap Exercise Swap:</strong> Machine occupied? Swap to an alternative exercise targeting the exact same muscle group instantly.
                </div>
              </div>

              <div className="tool-legend-item">
                <div className="tool-icon-pill">
                  <TrendingUpIcon /> Ghost Stats
                </div>
                <div className="tool-text">
                  <strong>Previous Session Reference:</strong> Displays your last logged weight & reps (e.g. <em>Last: 80 kg × 10</em>) to ensure progressive overload.
                </div>
              </div>

              <div className="tool-legend-item">
                <div className="tool-icon-pill">
                  <HourglassEmptyIcon /> Rest Timer
                </div>
                <div className="tool-text">
                  <strong>Auto Rest Timer HUD:</strong> Automatically starts countdown upon completing a set, with dual-tone audio chime alerts when rest ends.
                </div>
              </div>

              <div className="tool-legend-item">
                <div className="tool-icon-pill">
                  <NoteAltIcon /> Notes
                </div>
                <div className="tool-text">
                  <strong>Pin & Seat Notes:</strong> Save machine seat height (e.g. <em>Pin #4, wide grip</em>) for instant recall on your next gym session.
                </div>
              </div>

              <div className="tool-legend-item">
                <div className="tool-icon-pill">
                  <WhatshotIcon /> Warmup & Cooldown
                </div>
                <div className="tool-text">
                  <strong>Dynamic Warmup & Static Cooldown:</strong> Targeted mobility before lifting and timed static stretches after your workout to optimize recovery.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="gym-modal-footer">
          <button className="primary-modal-btn" onClick={onClose}>
            Got It, Let's Lift!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GymSessionLegendModal;
