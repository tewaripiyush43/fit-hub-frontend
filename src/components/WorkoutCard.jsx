import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Badge } from "./ui";

const getShortDescription = (description) => {
  if (!description) return "Tap to view exercises, track sets, and start your workout session.";
  const listStartIndex = description.indexOf("*");
  let intro = description;
  if (listStartIndex !== -1) {
    intro = description.substring(0, listStartIndex).trim();
  }
  if (intro.length < 10) {
    intro = description;
  }
  if (intro.length > 160) {
    return intro.substring(0, 157) + "...";
  }
  return intro;
};

const WorkoutCard = ({ workout }) => {
  const navigate = useNavigate();
  const workoutId = typeof workout === "string" ? workout : workout?._id;
  const workoutName = typeof workout === "string" ? "Workout" : (workout?.name || "Untitled Workout");
  const workoutDesc = typeof workout === "string" ? "" : (workout?.description || "");
  const exerciseCount = typeof workout === "string" ? 0 : (workout?.exercises?.length || 0);

  const handleCardClick = () => {
    navigate(`${workoutId}-${workoutName.replace(/\s+/g, "-")}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className="workout-card clickable-workout-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View workout: ${workoutName}`}
    >
      <div className="workout-card-header-bar">
        <h2 className="workout-card-title">{workoutName}</h2>
      </div>

      <div className="workout-card-content">
        <p className="workout-card-description">
          {getShortDescription(workoutDesc)}
        </p>

        <div className="workout-card-btn-container">
          <div className="workout-card-exercises" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FitnessCenterIcon className="ex-icon" style={{ fontSize: "1rem" }} />
            <Badge variant="accent" size="sm">
              {exerciseCount} {exerciseCount === 1 ? "Exercise" : "Exercises"}
            </Badge>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="workout-card-btn"
          >
            <span>Open Routine</span>
            <ArrowForwardIcon style={{ fontSize: "0.85rem" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

WorkoutCard.propTypes = {
  workout: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default WorkoutCard;
