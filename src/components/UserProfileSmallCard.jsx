import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePRs } from "../api/userApi";
import { toast } from "../helpers/errorPopUp";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useUnitPreference } from "../utils/useUnitPreference";

const POPULAR_EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Incline Dumbbell Press",
  "Leg Press",
  "Pull-ups",
  "Romanian Deadlift",
  "Dumbbell Bicep Curl",
];

const UserProfileSmallCard = ({ hideHeader }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { weightUnit, isMetric } = useUnitPreference();

  const prs = user?.prs && Array.isArray(user.prs) ? user.prs : [];

  const [editIndex, setEditIndex] = useState(null);
  const [editMaxWeight, setEditMaxWeight] = useState("");
  const [editGoalWeight, setEditGoalWeight] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [newMaxWeight, setNewMaxWeight] = useState("");
  const [newGoalWeight, setNewGoalWeight] = useState("");
  const [newUnit, setNewUnit] = useState(weightUnit);

  const syncPRsToDb = async (updatedPRs) => {
    try {
      await updatePRs(dispatch, updatedPRs);
      toast.success("Personal records updated!");
    } catch (error) {
      console.error("Failed to update PRs in DB:", error);
      toast.error("Failed to update PRs");
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditMaxWeight(prs[index].maxWeight);
    setEditGoalWeight(prs[index].goalWeight || Math.round(prs[index].maxWeight * 1.25));
  };

  const handleSaveClick = async (index) => {
    const updatedPRs = prs.map((pr, idx) => {
      if (idx === index) {
        return {
          ...pr,
          maxWeight: Number(editMaxWeight) || 0,
          goalWeight: Number(editGoalWeight) || 0,
        };
      }
      return pr;
    });
    await syncPRsToDb(updatedPRs);
    setEditIndex(null);
  };

  const handleAddPR = async (e) => {
    e.preventDefault();
    if (!newExercise.trim()) {
      toast.warn("Please enter or select an exercise name");
      return;
    }
    if (prs.length >= 8) {
      toast.warn("Maximum 8 PR slots allowed");
      return;
    }

    const newPR = {
      exercise: newExercise.trim(),
      maxWeight: Number(newMaxWeight) || 0,
      goalWeight: Number(newGoalWeight) || 0,
      unit: newUnit || weightUnit,
    };

    const updated = [...prs, newPR];
    await syncPRsToDb(updated);

    setNewExercise("");
    setNewMaxWeight("");
    setNewGoalWeight("");
    setNewUnit(weightUnit);
    setShowAddForm(false);
  };

  const handleDeletePR = async (indexToDelete) => {
    const updated = prs.filter((_, idx) => idx !== indexToDelete);
    await syncPRsToDb(updated);
  };

  const handleLevelUpGoal = async (index) => {
    const updatedPRs = prs.map((pr, idx) => {
      if (idx === index) {
        const nextGoal = Math.round(pr.maxWeight * 1.15);
        return {
          ...pr,
          goalWeight: nextGoal,
        };
      }
      return pr;
    });
    await syncPRsToDb(updatedPRs);
    toast.success(`Leveled up target goal for ${prs[index].exercise}!`);
  };

  const getTierInfo = (maxWeight, unit = weightUnit) => {
    const isKg = unit === "kg" || (unit !== "lbs" && isMetric);
    const diamondThreshold = isKg ? 180 : 405;
    const goldThreshold = isKg ? 140 : 300;
    const silverThreshold = isKg ? 90 : 200;

    if (maxWeight >= diamondThreshold) {
      return { tier: "Diamond", color: "#00f0ff", bg: "rgba(0, 240, 255, 0.12)" };
    }
    if (maxWeight >= goldThreshold) {
      return { tier: "Gold", color: "#ffd700", bg: "rgba(255, 215, 0, 0.12)" };
    }
    if (maxWeight >= silverThreshold) {
      return { tier: "Silver", color: "#c0c0c0", bg: "rgba(192, 192, 192, 0.12)" };
    }
    return { tier: "Bronze", color: "#cd7f32", bg: "rgba(205, 127, 50, 0.12)" };
  };

  return (
    <div className="user-pr-card-premium">
      {!hideHeader && (
        <div className="card-header-premium">
          <div className="header-text-group">
            <h2 className="title">
              <EmojiEventsIcon className="header-icon" /> Fitness Achievements & PRs
            </h2>
            <p className="subtitle">Track your personal records and watch your progress soar!</p>
          </div>
          {prs.length < 8 && !showAddForm && (
            <button className="add-pr-header-btn" onClick={() => setShowAddForm(true)}>
              <AddIcon fontSize="small" /> Add Record
            </button>
          )}
        </div>
      )}

      {/* Inline Quick Add Form Modal / Drawer */}
      {showAddForm && (
        <div className="pr-inline-add-card">
          <div className="add-card-header">
            <h4>Add Personal Record</h4>
            <button
              type="button"
              className="add-card-close"
              onClick={() => setShowAddForm(false)}
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>

          <form onSubmit={handleAddPR} className="pr-quick-form">
            <div className="form-row-full">
              <label>Exercise</label>
              <input
                type="text"
                list="popular-exercises"
                required
                placeholder="e.g. Bench Press, Squat, Deadlift"
                value={newExercise}
                onChange={(e) => setNewExercise(e.target.value)}
                autoFocus
              />
              <datalist id="popular-exercises">
                {POPULAR_EXERCISES.map((ex) => (
                  <option key={ex} value={ex} />
                ))}
              </datalist>
            </div>

            <div className="form-row-split">
              <div className="input-group">
                <label>Current Max ({newUnit})</label>
                <input
                  type="number"
                  placeholder="e.g. 225"
                  value={newMaxWeight}
                  onChange={(e) => setNewMaxWeight(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Goal Target ({newUnit})</label>
                <input
                  type="number"
                  placeholder="e.g. 300"
                  value={newGoalWeight}
                  onChange={(e) => setNewGoalWeight(e.target.value)}
                />
              </div>
              <div className="input-group unit-group">
                <label>Unit</label>
                <select value={newUnit} onChange={(e) => setNewUnit(e.target.value)}>
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn-confirm-add">
                <CheckIcon fontSize="small" /> Save Record
              </button>
              <button
                type="button"
                className="btn-cancel-add"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="pr-grid-premium">
        {prs.map((pr, index) => {
          const progressPercent = Math.min(
            100,
            Math.round((pr.maxWeight / (pr.goalWeight || 1)) * 100)
          );
          const tier = getTierInfo(pr.maxWeight, pr.unit);

          return (
            <div className="pr-card-item" key={index}>
              {editIndex === index ? (
                <div className="pr-edit-container">
                  <div className="edit-top-row">
                    <span className="edit-title">Edit: {pr.exercise}</span>
                    <button
                      className="edit-close-x"
                      onClick={() => setEditIndex(null)}
                      title="Cancel"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                  <div className="edit-inputs-row">
                    <div className="input-group">
                      <label>Max ({pr.unit})</label>
                      <input
                        type="number"
                        value={editMaxWeight}
                        onChange={(e) => setEditMaxWeight(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="input-group">
                      <label>Goal ({pr.unit})</label>
                      <input
                        type="number"
                        value={editGoalWeight}
                        onChange={(e) => setEditGoalWeight(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="edit-actions-row">
                    <button
                      className="save-pr-btn"
                      onClick={() => handleSaveClick(index)}
                    >
                      <SaveIcon fontSize="small" /> Save
                    </button>
                    <button
                      className="cancel-pr-btn"
                      onClick={() => setEditIndex(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pr-display-container">
                  {/* Header Row: Exercise + Tier Pill + Hover Action Icons */}
                  <div className="pr-card-header">
                    <div className="exercise-info">
                      <FitnessCenterIcon className="exercise-icon" />
                      <h3 title={pr.exercise}>{pr.exercise}</h3>
                    </div>

                    <div className="pr-header-right">
                      <span
                        className="tier-pill"
                        style={{ color: tier.color, backgroundColor: tier.bg }}
                      >
                        <EmojiEventsIcon style={{ fontSize: "0.85rem" }} />
                        {tier.tier}
                      </span>

                      {/* Permanent Action Buttons */}
                      <div className="card-actions-toolbar">
                        <button
                          className="card-action-btn edit"
                          onClick={() => handleEditClick(index)}
                          title="Edit PR"
                          aria-label={`Edit ${pr.exercise} record`}
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          className="card-action-btn delete"
                          onClick={() => handleDeletePR(index)}
                          title="Delete PR"
                          aria-label={`Delete ${pr.exercise} record`}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Weights Stats Row - Clickable to Edit */}
                  <div
                    className="weight-display-row clickable-stats"
                    onClick={() => handleEditClick(index)}
                    title="Click to edit weights"
                  >
                    <div className="weight-stat-item">
                      <span className="weight-label">Current Max ✎</span>
                      <span className="weight-value">
                        {pr.maxWeight} <span className="unit">{pr.unit}</span>
                      </span>
                    </div>

                    <div className="weight-stat-item align-right">
                      <span className="weight-label">Goal Target ✎</span>
                      <span className="weight-value goal">
                        {pr.goalWeight} <span className="unit">{pr.unit}</span>
                      </span>
                    </div>
                  </div>

                  {/* Glowing Progress Bar */}
                  <div className="progress-bar-container">
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: progressPercent >= 100 ? "#00ffd1" : tier.color,
                          boxShadow: `0 0 10px ${progressPercent >= 100 ? "#00ffd1" : tier.color}80`,
                        }}
                      />
                    </div>
                    <div className="progress-label-row">
                      {progressPercent >= 100 ? (
                        <div className="goal-smashed-row">
                          <span className="goal-smashed-tag">🎉 Goal Smashed!</span>
                          <button
                            className="level-up-goal-btn"
                            onClick={() => handleLevelUpGoal(index)}
                            title="Level up target goal by +15%"
                          >
                            +15% Goal
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="progress-title">Progress to Goal</span>
                          <span className="progress-num" style={{ color: tier.color }}>
                            {progressPercent}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add PR Placeholder Tile */}
        {prs.length < 8 && !showAddForm && (
          <div
            className="pr-card-item add-placeholder-tile"
            onClick={() => setShowAddForm(true)}
          >
            <div className="add-tile-content">
              <div className="add-tile-plus">
                <AddIcon />
              </div>
              <span className="add-tile-text">Add Personal Record</span>
              <span className="add-tile-slots">({8 - prs.length} slots left)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileSmallCard;
