import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePRs } from "../api/userApi";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const UserProfileSmallCard = ({ hideHeader }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const defaultPRs = [
    { exercise: "Deadlift", maxWeight: 300, goalWeight: 400, unit: "lbs" },
    { exercise: "Bench Press", maxWeight: 225, goalWeight: 300, unit: "lbs" },
    { exercise: "Squat", maxWeight: 315, goalWeight: 400, unit: "lbs" },
    { exercise: "Overhead Press", maxWeight: 135, goalWeight: 185, unit: "lbs" },
  ];

  const prs = user?.prs && user.prs.length > 0 ? user.prs : defaultPRs;

  const [editIndex, setEditIndex] = useState(null);
  const [editMaxWeight, setEditMaxWeight] = useState("");
  const [editGoalWeight, setEditGoalWeight] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [newMaxWeight, setNewMaxWeight] = useState("");
  const [newGoalWeight, setNewGoalWeight] = useState("");
  const [newUnit, setNewUnit] = useState("lbs");

  const syncPRsToDb = async (updatedPRs) => {
    try {
      await updatePRs(dispatch, updatedPRs);
    } catch (error) {
      console.error("Failed to update PRs in DB:", error);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditMaxWeight(prs[index].maxWeight);
    setEditGoalWeight(prs[index].goalWeight || prs[index].maxWeight * 1.25);
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
    if (!newExercise.trim()) return;
    if (prs.length >= 6) return;

    const newPR = {
      exercise: newExercise.trim(),
      maxWeight: Number(newMaxWeight) || 0,
      goalWeight: Number(newGoalWeight) || 0,
      unit: newUnit,
    };

    const updated = [...prs, newPR];
    await syncPRsToDb(updated);

    setNewExercise("");
    setNewMaxWeight("");
    setNewGoalWeight("");
    setNewUnit("lbs");
    setShowAddForm(false);
  };

  const handleDeletePR = async (indexToDelete) => {
    const updated = prs.filter((_, idx) => idx !== indexToDelete);
    await syncPRsToDb(updated);
  };

  const getBadgeColor = (maxWeight) => {
    if (maxWeight >= 300) return "#ffd700"; // Gold
    if (maxWeight >= 200) return "#c0c0c0"; // Silver
    return "#cd7f32"; // Bronze
  };

  return (
    <div className="user-pr-card-premium">
      {!hideHeader && (
        <div className="card-header-premium">
          <h2 className="title">
            <EmojiEventsIcon className="header-icon" /> Fitness Achievements & PRs
          </h2>
          <p className="subtitle">Track your personal records and watch your progress soar!</p>
        </div>
      )}

      <div className="pr-grid-premium">
        {prs.map((pr, index) => {
          const progressPercent = Math.min(
            100,
            Math.round((pr.maxWeight / (pr.goalWeight || 1)) * 100)
          );
          const badgeColor = getBadgeColor(pr.maxWeight);

          return (
            <div className="pr-card-item" key={index}>
              <div className="pr-card-header">
                <div className="exercise-info">
                  <FitnessCenterIcon className="exercise-icon" />
                  <h3>{pr.exercise}</h3>
                </div>
                <div className="trophy-badge" style={{ color: badgeColor }} title="Achievement Badge">
                  <EmojiEventsIcon />
                </div>
              </div>

              {editIndex === index ? (
                <div className="pr-edit-container">
                  <div className="input-group">
                    <label>Current Max ({pr.unit})</label>
                    <input
                      type="number"
                      value={editMaxWeight}
                      onChange={(e) => setEditMaxWeight(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Goal Max ({pr.unit})</label>
                    <input
                      type="number"
                      value={editGoalWeight}
                      onChange={(e) => setEditGoalWeight(e.target.value)}
                    />
                  </div>
                  <div className="edit-actions-row">
                    <button className="save-pr-btn" onClick={() => handleSaveClick(index)}>
                      <SaveIcon fontSize="small" /> Save
                    </button>
                    <button className="cancel-pr-btn" onClick={() => setEditIndex(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pr-display-container">
                  <div className="weight-display-row">
                    <div className="weight-block">
                      <span className="weight-label">Max Record</span>
                      <span className="weight-value">
                        {pr.maxWeight} <span className="unit">{pr.unit}</span>
                      </span>
                    </div>
                    <div className="weight-block align-right">
                      <span className="weight-label">Target Goal</span>
                      <span className="weight-value goal">
                        {pr.goalWeight} <span className="unit">{pr.unit}</span>
                      </span>
                    </div>
                  </div>

                  <div className="progress-bar-container">
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="progress-label-row">
                      <span>Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                  </div>

                  <div className="pr-actions-row">
                    <button className="edit-pr-btn" onClick={() => handleEditClick(index)}>
                      <EditIcon fontSize="small" /> Edit
                    </button>
                    <button className="delete-pr-btn" onClick={() => handleDeletePR(index)}>
                      <DeleteIcon fontSize="small" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {prs.length < 6 && (
          <div className="pr-card-item add-card">
            {showAddForm ? (
              <form onSubmit={handleAddPR} className="pr-add-form">
                <div className="input-group">
                  <label>Exercise Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Leg Press"
                    value={newExercise}
                    onChange={(e) => setNewExercise(e.target.value)}
                  />
                </div>
                <div className="input-row-flex">
                  <div className="input-group half">
                    <label>Max Weight</label>
                    <input
                      type="number"
                      placeholder="Current Max"
                      value={newMaxWeight}
                      onChange={(e) => setNewMaxWeight(e.target.value)}
                    />
                  </div>
                  <div className="input-group half">
                    <label>Goal Weight</label>
                    <input
                      type="number"
                      placeholder="Goal Max"
                      value={newGoalWeight}
                      onChange={(e) => setNewGoalWeight(e.target.value)}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Unit</label>
                  <select value={newUnit} onChange={(e) => setNewUnit(e.target.value)}>
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="add-submit-btn">Add PR</button>
                  <button type="button" className="add-cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="add-placeholder-content" onClick={() => setShowAddForm(true)}>
                <AddIcon className="add-icon" />
                <span className="add-text">Add New Record</span>
                <span className="slots-text">({6 - prs.length} slots left)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileSmallCard;
