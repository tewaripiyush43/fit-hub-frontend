import React from "react";
import PropTypes from "prop-types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ActiveSetRow = ({
  exerciseId,
  setIndex,
  set,
  weightUnit,
  weightStep,
  onAdjustValue,
  onActiveSetChange,
  onToggleSetTag,
  onToggleSetCompleted,
}) => {
  const tag = set.tag || "N";

  return (
    <div className={`set-row ${set.completed ? "completed" : ""}`}>
      {/* Set Number, Tag & PR Badge */}
      <span className="col-num">
        <span className="set-num-text">#{set.setNum}</span>
        <button
          type="button"
          className={`set-tag-badge tag-${tag.toLowerCase()}`}
          onClick={() => onToggleSetTag(exerciseId, setIndex)}
          title={`Set Tag: ${
            tag === "N"
              ? "Normal"
              : tag === "W"
              ? "Warmup"
              : tag === "D"
              ? "Drop Set"
              : "Failure"
          } (Click to cycle)`}
          disabled={set.completed}
          aria-label={`Cycle set tag currently ${tag}`}
        >
          {tag}
        </button>
        {set.isPR && (
          <span className="pr-celebration-badge" title="All-Time Personal Record!">
            🏆 PR
          </span>
        )}
      </span>

      {/* Weight Stepper Control */}
      <span className="col-weight">
        <div className="stepper-input-wrapper">
          <button
            type="button"
            className="step-btn"
            onClick={() => onAdjustValue(exerciseId, setIndex, "weight", -weightStep)}
            disabled={set.completed}
            aria-label={`Decrease weight by ${weightStep} ${weightUnit}`}
          >
            <RemoveIcon style={{ fontSize: "0.9rem" }} />
          </button>
          <input
            type="number"
            value={set.weight}
            onChange={(e) => onActiveSetChange(exerciseId, setIndex, "weight", e.target.value)}
            disabled={set.completed}
            aria-label={`Weight in ${weightUnit}`}
          />
          <button
            type="button"
            className="step-btn"
            onClick={() => onAdjustValue(exerciseId, setIndex, "weight", weightStep)}
            disabled={set.completed}
            aria-label={`Increase weight by ${weightStep} ${weightUnit}`}
          >
            <AddIcon style={{ fontSize: "0.9rem" }} />
          </button>
        </div>
      </span>

      {/* Reps Stepper Control */}
      <span className="col-reps">
        <div className="stepper-input-wrapper">
          <button
            type="button"
            className="step-btn"
            onClick={() => onAdjustValue(exerciseId, setIndex, "reps", -1)}
            disabled={set.completed}
            aria-label="Decrease reps by 1"
          >
            <RemoveIcon style={{ fontSize: "0.9rem" }} />
          </button>
          <input
            type="number"
            value={set.reps}
            onChange={(e) => onActiveSetChange(exerciseId, setIndex, "reps", e.target.value)}
            disabled={set.completed}
            aria-label="Reps completed"
          />
          <button
            type="button"
            className="step-btn"
            onClick={() => onAdjustValue(exerciseId, setIndex, "reps", 1)}
            disabled={set.completed}
            aria-label="Increase reps by 1"
          >
            <AddIcon style={{ fontSize: "0.9rem" }} />
          </button>
        </div>
      </span>

      {/* 44px+ Touch Completion Button */}
      <span className="col-check">
        <button
          type="button"
          className={`set-check-btn ${set.completed ? "checked" : ""}`}
          onClick={() => onToggleSetCompleted(exerciseId, setIndex)}
          title={set.completed ? "Mark Set Incomplete" : "Complete Set & Start Rest"}
          aria-label={set.completed ? "Mark Set Incomplete" : "Complete Set and Start Rest Timer"}
        >
          {set.completed ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
        </button>
      </span>
    </div>
  );
};

ActiveSetRow.propTypes = {
  exerciseId: PropTypes.string.isRequired,
  setIndex: PropTypes.number.isRequired,
  set: PropTypes.shape({
    setNum: PropTypes.number.isRequired,
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tag: PropTypes.string,
    completed: PropTypes.bool,
    isPR: PropTypes.bool,
  }).isRequired,
  weightUnit: PropTypes.string.isRequired,
  weightStep: PropTypes.number.isRequired,
  onAdjustValue: PropTypes.func.isRequired,
  onActiveSetChange: PropTypes.func.isRequired,
  onToggleSetTag: PropTypes.func.isRequired,
  onToggleSetCompleted: PropTypes.func.isRequired,
};

export default React.memo(ActiveSetRow);
