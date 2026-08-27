import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SpaIcon from "@mui/icons-material/Spa";
import ShareIcon from "@mui/icons-material/Share";

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
};

const getEarnedBadge = (volume) => {
  if (volume >= 15000) return "👑 Titan of the Gym (15k+ Volume)";
  if (volume >= 10000) return "🔥 Iron Behemoth (10k+ Volume)";
  if (volume >= 5000) return "⚡ Heavy Lifter (5k+ Volume)";
  if (volume >= 2000) return "💪 Consistent Grinder (2k+ Volume)";
  return "🌱 Dedicated Starter";
};

const WorkoutSummaryModal = ({
  open,
  seconds,
  totalVolume,
  completedSets,
  totalSets,
  weightUnit,
  aiCoachDebrief,
  loadingAICoach,
  summaryCopied,
  onGetAICoachDebrief,
  onLaunchCooldown,
  onShareSummary,
  onCloseSummary,
}) => {
  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseSummary();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCloseSummary]);

  if (!open) return null;

  return createPortal(
    <div className="active-summary-overlay" role="dialog" aria-modal="true" aria-label="Workout Completed Summary">
      <div className="active-summary-modal">
        <div className="modal-header">
          <EmojiEventsIcon className="trophy-gold" />
          <h2>Workout Completed!</h2>
          <p>Outstanding effort! Here is your training session breakdown:</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Duration</span>
            <span className="stat-value">{formatTime(seconds)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Volume Lifted</span>
            <span className="stat-value">
              {totalVolume.toLocaleString()}{" "}
              <span className="stat-unit">{weightUnit}</span>
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Sets Completed</span>
            <span className="stat-value">
              {completedSets} / {totalSets}
            </span>
          </div>
        </div>

        <div className="badge-unlock-section">
          <span className="badge-label">Earned Achievement</span>
          <span className="badge-name">{getEarnedBadge(totalVolume)}</span>
        </div>

        {/* 1-Tap AI Performance Coach Debrief */}
        <div className="summary-ai-coach-section">
          {!aiCoachDebrief ? (
            <button
              type="button"
              className="ai-coach-trigger-btn"
              onClick={onGetAICoachDebrief}
              disabled={loadingAICoach}
            >
              <AutoAwesomeIcon style={{ color: "var(--accent, #00f0ff)", fontSize: "1.1rem" }} />
              <span>{loadingAICoach ? "Coach is analyzing session..." : "🤖 1-Tap AI Coach Debrief"}</span>
            </button>
          ) : (
            <div className="ai-coach-debrief-card">
              <div className="debrief-card-header">
                <AutoAwesomeIcon style={{ color: "var(--accent, #00f0ff)", fontSize: "1.1rem" }} />
                <strong>FitHub AI Coach Debrief</strong>
              </div>
              <p className="debrief-card-text">{aiCoachDebrief}</p>
            </div>
          )}
        </div>

        <div className="summary-actions-row">
          <button
            type="button"
            className="cooldown-launch-btn"
            onClick={onLaunchCooldown}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #00e676 0%, #00f0ff 100%)",
              color: "#050811",
              fontWeight: 900,
              fontSize: "0.92rem",
              border: "none",
              padding: "10px 18px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <SpaIcon style={{ fontSize: "1.1rem" }} /> Cooldown & Stretch
          </button>
          <button
            type="button"
            className="share-summary-btn"
            onClick={onShareSummary}
          >
            <ShareIcon style={{ fontSize: "1.1rem" }} />
            <span>{summaryCopied ? "Copied!" : "Share"}</span>
          </button>
          <button
            type="button"
            className="finish-dismiss-btn"
            onClick={onCloseSummary}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

WorkoutSummaryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  seconds: PropTypes.number.isRequired,
  totalVolume: PropTypes.number.isRequired,
  completedSets: PropTypes.number.isRequired,
  totalSets: PropTypes.number.isRequired,
  weightUnit: PropTypes.string.isRequired,
  aiCoachDebrief: PropTypes.string,
  loadingAICoach: PropTypes.bool,
  summaryCopied: PropTypes.bool,
  onGetAICoachDebrief: PropTypes.func.isRequired,
  onLaunchCooldown: PropTypes.func.isRequired,
  onShareSummary: PropTypes.func.isRequired,
  onCloseSummary: PropTypes.func.isRequired,
};

export default React.memo(WorkoutSummaryModal);
