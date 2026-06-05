import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RemoveTwoToneIcon from "@mui/icons-material/RemoveTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/index.js";
import axios from "axios";
import { errorPopUp } from "../helpers/errorPopUp.js";
import { toast } from "react-toastify";

import {
  addWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
} from "../api/workoutApi";

const ExerciseCard = ({
  exerciseData,
  animation = false,
  removeBtn = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  // const favoriteIcon = useRef();
  const moreOptionsRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [newWorkoutInput, setNewWorkoutInput] = useState("");
  const [takingInput, setTakingInput] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const workoutData = useSelector((state) => state.workout.workoutData);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { _id, bodyPart, target, gifUrl, name } = exerciseData;
  // console.log(exerciseData);

  useEffect(() => {
    if (errorMessage.length > 0) {
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  const bodyPartPage = () => {
    navigate(`/exercises/${bodyPart}`);
  };

  const targetMusclePage = () => {
    navigate(`/exercises/${target}`);
  };

  const exercisePage = () => {
    navigate(`/exercise/${_id}`);
  };

  async function addToFavorites(e) {
    e.stopPropagation();

    try {
      const accessToken = localStorage.accessToken;
      if (!accessToken) throw new Error("Access token not found");

      const response = await axios.put(
        `${REACT_APP_BASE_URL}/user/addToFavorites/${_id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { data, status } = response;
      if (data?.error?.status === 401) {
        window.location.reload();
        throw new Error("Unauthorized");
      }
      // console.log(response);
      // console.log(data, status);
      if (status === 201) {
        dispatch(authActions.setUser(data.user));
        setIsFavorite(true);
      }
    } catch (err) {
      // console.log(err);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  }

  async function removeFromFavorites(e) {
    e.stopPropagation();

    try {
      const accessToken = localStorage.accessToken;
      if (!accessToken) throw new Error("Access token not found");

      const response = await axios.put(
        `${REACT_APP_BASE_URL}/user/removeFromFavorites/${_id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { data, status } = response;
      if (data?.error?.status === 401) {
        window.location.reload();
        throw new Error("Unauthorized");
      }
      // console.log(response);
      // console.log(data, status);
      if (status === 201) {
        dispatch(authActions.setUser(data.user));
        setIsFavorite(false);
      }
    } catch (err) {
      // console.log(err);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  }

  useEffect(() => {
    if (
      user?.favoriteExercises?.some(
        (favoriteExercise) => favoriteExercise._id === _id
      )
    ) {
      setIsFavorite(true);
    }

    const handleClickOutside = (event) => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(event.target)
      ) {
        setShowMore(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowMore(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleCreateWorkoutClick = async (e) => {
    e.stopPropagation();

    if (!takingInput) {
      setTakingInput(true);
      return;
    }

    if (isCreating) return;

    const trimmedName = newWorkoutInput.trim();
    if (!trimmedName) {
      setErrorMessage("Workout name cannot be empty");
      return;
    }

    setIsCreating(true);
    try {
      const workoutId = await addWorkout(
        dispatch,
        trimmedName,
        REACT_APP_BASE_URL
      );

      setTakingInput(false);
      setNewWorkoutInput("");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className={
        "exercise-card " +
        (animation ? "animation " : "") +
        (showMore ? "active-dropdown" : "")
      }
    >
      <div className="exercise-card-img-wrapper">
        <img onClick={exercisePage} src={gifUrl} alt="error" />
      </div>
      {isLoggedIn && animation && (
        <div className="exercise-card-icon-container" ref={moreOptionsRef}>
          <div>
            {isFavorite ? (
              <FavoriteIcon
                title="remove from favorites"
                onClick={(e) => removeFromFavorites(e)}
                className="exercise-card-favorite-icon active-favorite"
              />
            ) : (
              <FavoriteBorderIcon
                title="add to favorites"
                onClick={(e) => addToFavorites(e)}
                className="exercise-card-favorite-icon"
              />
            )}
            <AddTwoToneIcon
              title="add to workout"
              onClick={() => setShowMore(!showMore)}
              className="exercise-card-more-icon"
            />
            {removeBtn && (
              <DeleteTwoToneIcon
                title="delete exercise"
                onClick={() =>
                  removeExerciseFromWorkout(
                    dispatch,
                    workoutData._id,
                    _id,
                    REACT_APP_BASE_URL
                  )
                }
                className="exercise-card-favorite-icon"
              />
            )}
          </div>
          {showMore && (
            <div className="exercise-card-more-options">
              <ul className="exercise-card-more-options-list">
                <p className="exercise-card-more-options-label">Add To</p>
                {user?.workouts?.map((workout) => {
                  const exerciseCount = workout.exercises?.length || 0;
                  const isFull = exerciseCount >= 10;
                  return (
                    <li
                      key={workout._id}
                      onClick={async (e) => {
                        e.preventDefault();
                        if (isFull) {
                          setErrorMessage("Workout is full! (Max 10 exercises)");
                          return;
                        }
                        const exists = workout.exercises?.some((ex) => {
                          const exId = typeof ex === "string" ? ex : ex?._id;
                          return exId === _id;
                        });
                        if (exists) {
                          toast.info("Exercise already exists in this workout");
                          setShowMore(false);
                          return;
                        }
                        setShowMore(false);
                        const success = await addExerciseToWorkout(
                          dispatch,
                          workout._id,
                          _id,
                          REACT_APP_BASE_URL
                        );
                        if (success) {
                          toast.success(`Added ${name} to ${workout.name}!`);
                        } else {
                          toast.error(`Failed to add ${name} to ${workout.name}`);
                        }
                      }}
                      className={`exercise-card-more-options-list-item ${isFull ? "workout-full" : ""}`}
                    >
                      {workout.name} ({exerciseCount}/10)
                    </li>
                  );
                })}
                {user?.workouts?.length < 7 && (
                  <div>
                    {!takingInput ? (
                      <p
                        onClick={(e) => handleCreateWorkoutClick(e)}
                        className="exercise-card-create-workout-btn exercise-card-more-options-list-item"
                      >
                        <AddTwoToneIcon />
                        <span>Create Workout</span>
                      </p>
                    ) : (
                      <div className="exercise-card-create-workout-btn exercise-card-more-options-list-item">
                        <input
                          className="exercise-card-create-workout-input-field"
                          type="text"
                          placeholder="Workout Name"
                          value={newWorkoutInput}
                          onChange={(e) => setNewWorkoutInput(e.target.value)}
                        />
                        <div className="add-icon">
                          <AddTwoToneIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateWorkoutClick(e);
                            }}
                          />
                        </div>
                        <div className="remove-icon">
                          <RemoveTwoToneIcon
                            onClick={() => setTakingInput(false)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <p
                  onClick={() => {
                    navigate(`/${user.username}/myworkouts`);
                  }}
                  className="exercise-card-create-workout-btn exercise-card-more-options-list-item"
                >
                  View Workouts
                </p>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="exercise-card-body">
        <div className="card-info">
          <button onClick={bodyPartPage} className="exercise-button">
            {bodyPart}
          </button>
          <button onClick={targetMusclePage} className="exercise-button">
            {target}
          </button>
        </div>
        <p className="exercise-name">{name}</p>
      </div>
    </div>
  );
};

export default ExerciseCard;
