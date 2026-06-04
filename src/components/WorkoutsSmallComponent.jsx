import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const WorkoutsSmallComponent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const username = user?.username;

  return (
    <div className="workouts-small-component-container">
      <h2 className="workouts-small-component-header">My Workouts</h2>
      <ul className="wsc-list">
        {user?.workouts
          ?.slice(0, 3)
          ?.map((workout, index) => (
            <li key={typeof workout === "string" ? workout : (workout?._id || workout?.name || index)} className="wsc-item">
              {typeof workout === "string" ? workout : (workout?.name || "Untitled Workout")}
            </li>
          ))}
      </ul>
      {user?.workouts?.length === 0 && (
        <p className="wsc-no-workouts">No Workouts Added</p>
      )}

      <button
        onClick={() => navigate(`/${username}/myworkouts`)}
        className="wsc-btn"
      >
        View All
      </button>
    </div>
  );
};

export default WorkoutsSmallComponent;
