import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RemoveTwoToneIcon from "@mui/icons-material/RemoveTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useDispatch, useSelector } from "react-redux";
import { errorPopUp, successPopUp, infoPopUp, actionPopUp } from "../helpers/errorPopUp";
import { addToFavorites as addFavoriteService, removeFromFavorites as removeFavoriteService } from "../api/userApi";

import {
  addWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
} from "../api/workoutApi";

// UI Primitives
import { Badge } from "./ui";

const ExerciseCard = ({
  exerciseData,
  animation = false,
  removeBtn = false,
  className = "",
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const moreOptionsRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [newWorkoutInput, setNewWorkoutInput] = useState("");
  const [takingInput, setTakingInput] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [isCreating, setIsCreating] = useState(false);

  const { _id, bodyPart, target, gifUrl, name } = exerciseData || {};

  const bodyPartPage = (e) => {
    e.stopPropagation();
    navigate(`/exercises/${bodyPart}`);
  };

  const targetMusclePage = (e) => {
    e.stopPropagation();
    navigate(`/exercises/${target}`);
  };

  const exercisePage = () => {
    navigate(`/exercise/${_id}`);
  };

  async function addToFavorites(e) {
    e.stopPropagation();
    try {
      await addFavoriteService(dispatch, _id);
      setIsFavorite(true);
      successPopUp(`Added ${name} to favorites`);
    } catch (err) {
      errorPopUp("Something went wrong. Please try again later.");
    }
  }

  async function removeFromFavorites(e) {
    e.stopPropagation();
    try {
      await removeFavoriteService(dispatch, _id);
      setIsFavorite(false);
      infoPopUp(`Removed ${name} from favorites`);
    } catch (err) {
      errorPopUp("Something went wrong. Please try again later.");
    }
  }

  useEffect(() => {
    if (
      user?.favoriteExercises?.some(
        (favoriteExercise) => (typeof favoriteExercise === "string" ? favoriteExercise : favoriteExercise._id) === _id
      )
    ) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
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
  }, [_id, user?.favoriteExercises]);

  const handleCreateWorkoutClick = async (e) => {
    e.stopPropagation();

    if (!takingInput) {
      setTakingInput(true);
      return;
    }

    if (isCreating) return;

    const trimmedName = newWorkoutInput.trim();
    if (!trimmedName) {
      errorPopUp("Workout name cannot be empty");
      return;
    }

    setIsCreating(true);
    try {
      const createdId = await addWorkout(dispatch, trimmedName, _id);

      setTakingInput(false);
      setNewWorkoutInput("");
      setShowMore(false);
      actionPopUp({
        message: `Created "${trimmedName}" & added ${name}!`,
        actionLabel: `Open ${trimmedName} →`,
        onAction: () => {
          if (createdId) {
            navigate(`/${user?.username}/myworkouts?workout=${createdId}`);
          } else {
            navigate(`/${user?.username}/myworkouts`);
          }
        },
      });
    } catch (error) {
      errorPopUp("Something went wrong. Please try again later.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      onClick={exercisePage}
      className={`exercise-card ${animation ? "animation" : ""} ${showMore ? "active-dropdown" : ""} ${className}`}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter") exercisePage();
      }}
    >
      <div className="exercise-card-img-wrapper">
        <img
          src={gifUrl}
          alt={name}
          loading="lazy"
          draggable="false"
        />
      </div>

      {isLoggedIn && (
        <div className="exercise-card-icon-container" ref={moreOptionsRef}>
          <div className="exercise-card-icon-group">
            {isFavorite ? (
              <button
                type="button"
                className="exercise-card-btn-pill exercise-card-favorite-icon favorite-active"
                onClick={removeFromFavorites}
                aria-label="Remove from favorites"
                title="Remove from favorites"
              >
                <FavoriteIcon style={{ color: "var(--danger)", fontSize: "1rem" }} />
              </button>
            ) : (
              <button
                type="button"
                className="exercise-card-btn-pill exercise-card-favorite-icon"
                onClick={addToFavorites}
                aria-label="Add to favorites"
                title="Add to favorites"
              >
                <FavoriteBorderIcon style={{ fontSize: "1rem" }} />
              </button>
            )}

            {!removeBtn ? (
              <button
                type="button"
                className="exercise-card-btn-pill exercise-card-more-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMore(!showMore);
                }}
                aria-label="Add to routine"
                title="Add to custom workout routine"
              >
                <AddTwoToneIcon style={{ fontSize: "1.1rem" }} />
              </button>
            ) : (
              <button
                type="button"
                className="exercise-card-btn-pill exercise-card-delete-icon"
                onClick={(e) =>
                  removeExerciseFromWorkout(
                    dispatch,
                    user.workouts[0]._id,
                    _id
                  )
                }
                aria-label="Remove exercise from routine"
                title="Remove exercise from routine"
              >
                <DeleteTwoToneIcon style={{ fontSize: "1rem" }} />
              </button>
            )}
          </div>

          {showMore && (
            <div className="exercise-card-more-options" onClick={(e) => e.stopPropagation()}>
              <ul className="exercise-card-more-options-list">
                <p className="exercise-card-more-options-label">Add To Routine</p>
                {user?.workouts?.map((workout) => {
                  const exerciseCount = workout.exercises?.length || 0;
                  const isFull = exerciseCount >= 10;
                  return (
                    <li
                      key={workout._id}
                      onClick={async (e) => {
                        e.preventDefault();
                        if (isFull) {
                          errorPopUp("Workout is full! (Max 10 exercises)");
                          return;
                        }
                        const exists = workout.exercises?.some((ex) => {
                          const exId = typeof ex === "string" ? ex : ex?._id;
                          return exId === _id;
                        });
                        if (exists) {
                          infoPopUp("Exercise already exists in this workout");
                          setShowMore(false);
                          return;
                        }
                        setShowMore(false);
                        const success = await addExerciseToWorkout(
                          dispatch,
                          workout._id,
                          _id
                        );
                        if (success) {
                          actionPopUp({
                            message: `Added ${name} to ${workout.name}!`,
                            actionLabel: `Open ${workout.name} →`,
                            onAction: () => {
                              navigate(`/${user?.username}/myworkouts?workout=${workout._id}`);
                            },
                          });
                        } else {
                          errorPopUp(`Failed to add ${name} to ${workout.name}`);
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
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                              handleCreateWorkoutClick(e);
                            }
                          }}
                          autoFocus
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
                  View All Workouts
                </p>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="exercise-card-body">
        <div className="card-info" style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Badge
            variant="accent"
            size="sm"
            style={{ cursor: "pointer", textTransform: "capitalize" }}
            onClick={bodyPartPage}
          >
            {bodyPart}
          </Badge>
          <Badge
            variant="primary"
            size="sm"
            style={{ cursor: "pointer", textTransform: "capitalize" }}
            onClick={targetMusclePage}
          >
            {target}
          </Badge>
        </div>
        <p className="exercise-name">{name}</p>
      </div>
    </div>
  );
};

ExerciseCard.propTypes = {
  exerciseData: PropTypes.object.isRequired,
  animation: PropTypes.bool,
  removeBtn: PropTypes.bool,
  className: PropTypes.string,
};

export default ExerciseCard;
