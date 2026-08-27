import React from "react";
import PropTypes from "prop-types";
import TimerIcon from "@mui/icons-material/Timer";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckIcon from "@mui/icons-material/Check";

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
};

const WorkoutSessionHeader = ({
  seconds,
  onOpenLegendModal,
  onFinishWorkout,
  onRequestCancel,
}) => {
  return (
    <div className="workout-page-header" role="banner">
      <div className="active-timer-section">
        <TimerIcon className="timer-icon" />
        <span className="active-timer-display" aria-label={`Workout elapsed time ${formatTime(seconds)}`}>
          {formatTime(seconds)}
        </span>
      </div>

      <div className="active-header-actions">
        <button
          className="gym-guide-trigger-btn"
          type="button"
          onClick={onOpenLegendModal}
          title="Learn what Set Types (N, W, D, F) and Gym Tools mean"
          aria-label="Open Gym Session Legend"
        >
          <HelpOutlineIcon style={{ fontSize: "1.05rem" }} />
          <span>Guide</span>
        </button>

        <button
          type="button"
          className="finish-workout-btn"
          onClick={onFinishWorkout}
          title="Complete and save workout session"
          aria-label="Finish Workout"
        >
          <CheckIcon style={{ fontSize: "1.1rem" }} />
          <span>Finish</span>
        </button>

        <button
          type="button"
          className="cancel-workout-btn"
          onClick={onRequestCancel}
          title="Discard active workout session"
          aria-label="Cancel Workout"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

WorkoutSessionHeader.propTypes = {
  seconds: PropTypes.number.isRequired,
  onOpenLegendModal: PropTypes.func.isRequired,
  onFinishWorkout: PropTypes.func.isRequired,
  onRequestCancel: PropTypes.func.isRequired,
};

export default React.memo(WorkoutSessionHeader);
