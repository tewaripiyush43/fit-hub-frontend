import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const WorkoutsSmallComponent = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const user = useSelector((state) => state.auth.user);
  // console.log(user);

  return (
    <div className="workouts-small-component-container">
      <h2 className="workouts-small-component-header">My Workouts</h2>
      <ul className="wsc-list">
        {user?.workouts
          ?.map((workout) => (
            <li key={workout?._id} className="wsc-item">
              {workout?.name}
            </li>
          ))
          .slice(0, 3)}
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
