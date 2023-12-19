import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { authActions } from "../store/index.js";

const WorkoutsSmallComponent = () => {
  const navigate = useNavigate();
  const { username, page } = useParams();
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <div className="workouts-small-component-container">
      <h2 className="workouts-small-component-header">My Workouts</h2>
      <ul className="wsc-list">
        {user?.workouts
          ?.map((workout) => <li className="wsc-item">{workout.name}</li>)
          .slice(0, 3)}
        {/* <li className="wsc-item">Workout 1</li>
        <li className="wsc-item">Workout 2</li>
        <li className="wsc-item">Workout 3</li> */}
      </ul>
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
