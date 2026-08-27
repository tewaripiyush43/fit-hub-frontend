import React from "react";
import PropTypes from "prop-types";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
};

const FloatingRestIsland = ({
  isRestActive,
  isRestPaused,
  restTimeLeft,
  restDuration,
  onAdjustRestTime,
  onTogglePause,
  onSkipRest,
}) => {
  if (!isRestActive || restTimeLeft <= 0) return null;

  const progressPercent = Math.max(
    0,
    Math.min(100, (restTimeLeft / (restDuration || 60)) * 100)
  );

  return (
    <div className="floating-rest-island" role="region" aria-label="Rest Timer Floating HUD">
      <div className="island-left">
        <HourglassEmptyIcon className={`hourglass-spin ${!isRestPaused ? "active" : ""}`} />
        <div className="island-text-group">
          <span className="island-label">{isRestPaused ? "REST PAUSED" : "REST MODE ACTIVE"}</span>
          <span className="island-time">{formatTime(restTimeLeft)}</span>
        </div>
      </div>

      <div className="island-progress-track">
        <div
          className="island-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="island-actions">
        <button
          type="button"
          className="island-adjust-btn"
          onClick={() => onAdjustRestTime(15)}
          title="Add 15 seconds"
          aria-label="Add 15 seconds to rest timer"
        >
          +15s
        </button>
        <button
          type="button"
          className="island-pause-btn"
          onClick={onTogglePause}
          title={isRestPaused ? "Resume Rest" : "Pause Rest"}
          aria-label={isRestPaused ? "Resume Rest Timer" : "Pause Rest Timer"}
        >
          {isRestPaused ? (
            <PlayArrowIcon style={{ fontSize: "1.1rem" }} />
          ) : (
            <PauseIcon style={{ fontSize: "1.1rem" }} />
          )}
        </button>
        <button
          type="button"
          className="island-skip-btn"
          onClick={onSkipRest}
          title="Skip Rest Interval"
          aria-label="Skip Rest"
        >
          <SkipNextIcon style={{ fontSize: "1.1rem" }} />
          <span>Skip</span>
        </button>
      </div>
    </div>
  );
};

FloatingRestIsland.propTypes = {
  isRestActive: PropTypes.bool.isRequired,
  isRestPaused: PropTypes.bool.isRequired,
  restTimeLeft: PropTypes.number.isRequired,
  restDuration: PropTypes.number.isRequired,
  onAdjustRestTime: PropTypes.func.isRequired,
  onTogglePause: PropTypes.func.isRequired,
  onSkipRest: PropTypes.func.isRequired,
};

export default React.memo(FloatingRestIsland);
