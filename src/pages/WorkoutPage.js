import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWorkout, deleteWorkout } from "../api/workoutapi";
import ExerciseCard from "../components/ExerciseCard";
import { workoutActions } from "../store";
import EditIcon from "@mui/icons-material/Edit";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import ConfirmationPopup from "../components/ConfirmationPopUp";

const WorkoutPage = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { username, page, name, id } = useParams();
  const dispatch = useDispatch();
  const workoutData = useSelector((state) => state.workout.workoutData);
  const user = useSelector((state) => state.auth.user);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [workoutState, setWorkoutState] = useState({
    name: "",
    description: "",
    exercises: [],
  });

  useEffect(() => {
    fetchWorkout(dispatch, id, REACT_APP_BASE_URL);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setWorkoutState((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  return (
    <div className="workout-page">
      {showConfirmation && (
        <ConfirmationPopup
          onClose={() => setShowConfirmation(false)}
          textContent="workout"
          onDelete={() => {
            deleteWorkout(dispatch, id, REACT_APP_BASE_URL);
            setShowConfirmation(false);
            navigate(`/${username}/myworkouts`);
          }}
        />
      )}
      <p
        name="name"
        onInput={(e) => handleChange(e)}
        contentEditable={editMode}
        className="workout-page-title"
      >
        {workoutData?.name}
      </p>
      <div className="workout-page-edit-icon-container">
        <DeleteTwoToneIcon
          onClick={() => {
            setShowConfirmation(true);
          }}
          title="Delete Workout"
          className="workout-page-delete-icon"
        />
        {editMode ? (
          <button
            onClick={() => {
              setEditMode((prev) => !prev);
              dispatch(
                workoutActions.updateWorkout(
                  dispatch,
                  id,
                  workoutState,
                  REACT_APP_BASE_URL
                )
              );
            }}
            title="Save Info"
            className="workout-page-save-info-btn"
          >
            Save
          </button>
        ) : (
          <EditIcon
            onClick={() => setEditMode((prev) => !prev)}
            title="Edit Profile"
            className="workout-page-edit-icon"
          />
        )}
      </div>
      <div className="workout-page-description">
        <p
          contentEditable={editMode}
          name="description"
          onInput={(e) => handleChange(e)}
          className="workout-page-content"
        >
          These exercises are amazing.
        </p>
      </div>
      <div className="workout-page-exercises-container">
        {workoutData?.exercises?.map((exercise) => (
          <ExerciseCard
            animation={true}
            removeBtn={true}
            exerciseData={exercise}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkoutPage;
