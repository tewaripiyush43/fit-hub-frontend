import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addWorkout } from "../api/workoutapi";
const MyWorkouts = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="my-workouts-container">
      <p className="my-workouts-title">
        <span>M</span>y <span>W</span>orkouts
      </p>
      <div className="my-workout-cards-container">
        {user?.workouts?.map((workout) => {
          return (
            <div key={workout?._id} className="workout-card">
              <h2 className="workout-card-title">{workout?.name}</h2>
              <div className="workout-card-content">
                <p className="workout-card-description">
                  I will do this exercises on Monday I will do this exercises on
                  Monday I will do this exercises on Monday I will do this
                  exercises on Monday I will do this exercises on Monday I will
                </p>
                <div className="workout-card-btn-container">
                  <p className="workout-card-exercises">
                    Exercises: <span>{workout?.exercises?.length}</span>
                  </p>
                  <button
                    onClick={() =>
                      navigate(`${workout?._id}-${workout?.name}}`)
                    }
                    className="workout-card-btn"
                  >
                    View Workout
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {user?.workouts?.length < 7 && (
          <div
            onClick={() =>
              addWorkout(dispatch, "Untitled Workout", REACT_APP_BASE_URL)
            }
            className="create-new-workout-card"
          >
            <div className="create-new-workout-card-icon">+ &nbsp;</div>
            <p className="create-new-workout-card-text">Create New Workout</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorkouts;
