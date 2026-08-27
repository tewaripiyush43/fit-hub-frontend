import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const WorkoutsSmallComponent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const username = user?.username;

  return (
    <div className="workouts-small-component-container">
      <div className="wsc-header-row">
        <div className="wsc-title-group">
          <FitnessCenterIcon className="wsc-icon" />
          <h2 className="workouts-small-component-header">My Workouts</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/${username}/myworkouts`)}
          className="wsc-view-all-link"
        >
          <span>View All</span>
          <ArrowForwardIcon style={{ fontSize: "0.85rem" }} />
        </button>
      </div>

      <ul className="wsc-list">
        {user?.workouts
          ?.slice(0, 3)
          ?.map((workout, index) => (
            <li
              key={typeof workout === "string" ? workout : (workout?._id || workout?.name || index)}
              className="wsc-item"
              onClick={() => navigate(`/${username}/myworkouts`)}
            >
              <span className="wsc-item-name">
                {typeof workout === "string" ? workout : (workout?.name || "Untitled Workout")}
              </span>
              <ArrowForwardIcon className="wsc-item-arrow" style={{ fontSize: "0.85rem" }} />
            </li>
          ))}
      </ul>
      {(!user?.workouts || user?.workouts?.length === 0) && (
        <p className="wsc-no-workouts">No workouts created yet</p>
      )}

      <button
        type="button"
        onClick={() => navigate(`/${username}/myworkouts`)}
        className="wsc-btn"
      >
        Open Routine Library
      </button>
    </div>
  );
};

export default WorkoutsSmallComponent;
