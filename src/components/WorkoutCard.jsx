import React from "react";
import { useNavigate } from "react-router-dom";

const getShortDescription = (description) => {
  if (!description) return "Add a description";
  const listStartIndex = description.indexOf("*");
  let intro = description;
  if (listStartIndex !== -1) {
    intro = description.substring(0, listStartIndex).trim();
  }
  if (intro.length < 10) {
    intro = description;
  }
  if (intro.length > 180) {
    return intro.substring(0, 177) + "...";
  }
  return intro;
};

const WorkoutCard = ({ workout, index }) => {
  const navigate = useNavigate();
  const workoutId = typeof workout === "string" ? workout : workout?._id;
  const workoutName = typeof workout === "string" ? "Workout" : (workout?.name || "Untitled Workout");
  const workoutDesc = typeof workout === "string" ? "" : (workout?.description || "");
  const exerciseCount = typeof workout === "string" ? 0 : (workout?.exercises?.length || 0);

  return (
    <div className="workout-card">
      <h2 className="workout-card-title">{workoutName}</h2>
      <div className="workout-card-content">
        <p className="workout-card-description">
          {getShortDescription(workoutDesc)}
        </p>
        <div className="workout-card-btn-container">
          <p className="workout-card-exercises">
            Exercises: <span>{exerciseCount}</span>
          </p>
          <button
            onClick={() => navigate(`${workoutId}-${workoutName}`)}
            className="workout-card-btn"
          >
            View Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
