import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWorkout, deleteWorkout, updateWorkout } from "../api/workoutapi";
import { workoutActions } from "../store/index";
import ExerciseCard from "../components/ExerciseCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import ConfirmationPopup from "../components/ConfirmationPopUp";

const WorkoutPage = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { username, workoutId } = useParams();
  const [id, name] = workoutId.split("-");
  const dispatch = useDispatch();
  const workoutData = useSelector((state) => state.workout.workoutData);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchWorkout(dispatch, id, REACT_APP_BASE_URL);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(
      workoutActions.setWorkoutData({
        ...workoutData,
        [name]: value,
      })
    );
    if (name === "description" && editMode) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }

  // useEffect(() => {
  //   console.log("Workout data changed:", workoutData);
  // }, [workoutData]);

  useEffect(() => {
    if (editMode) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editMode]);

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
      {editMode ? (
        <input
          name="name"
          value={workoutData?.name}
          onChange={(e) => handleChange(e)}
          className="workout-page-title-input"
        />
      ) : (
        <p className="workout-page-title">{workoutData?.name}</p>
      )}
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
              updateWorkout(dispatch, id, workoutData, REACT_APP_BASE_URL);
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
        {editMode ? (
          <textarea
            name="description"
            ref={textareaRef}
            maxLength={400}
            value={workoutData?.description}
            onChange={(e) => handleChange(e)}
            height="auto"
            className="workout-page-content-input"
          />
        ) : (
          <p className="workout-page-content">{workoutData?.description}</p>
        )}
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
