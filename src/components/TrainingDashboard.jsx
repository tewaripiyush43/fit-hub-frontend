import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import HistoryIcon from "@mui/icons-material/History";
import TimerIcon from "@mui/icons-material/Timer";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { authActions } from "../store/index.js";

const TrainingDashboard = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Achievements State
  const [editIndex, setEditIndex] = useState(null);
  const [editMaxWeight, setEditMaxWeight] = useState("");
  const [editGoalWeight, setEditGoalWeight] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [newMaxWeight, setNewMaxWeight] = useState("");
  const [newGoalWeight, setNewGoalWeight] = useState("");
  const [newUnit, setNewUnit] = useState("lbs");

  const history = user?.sessionHistory || [];
  const streak = user?.streak || 0;

  const defaultPRs = [
    { exercise: "Deadlift", maxWeight: 300, goalWeight: 400, unit: "lbs" },
    { exercise: "Bench Press", maxWeight: 225, goalWeight: 300, unit: "lbs" },
    { exercise: "Squat", maxWeight: 315, goalWeight: 400, unit: "lbs" },
    { exercise: "Overhead Press", maxWeight: 135, goalWeight: 185, unit: "lbs" },
  ];
  const prs = user?.prs && user.prs.length > 0 ? user.prs : defaultPRs;

  // Aggregate stats
  let totalVolume = 0;
  let timeSecondsSum = 0;
  history.forEach((log) => {
    totalVolume += log.totalVolume || 0;
    if (log.duration && log.duration.includes(":")) {
      const [m, s] = log.duration.split(":").map(Number);
      timeSecondsSum += (m * 60) + (s || 0);
    }
  });

  const totalHours = Math.floor(timeSecondsSum / 3600);
  const totalMins = Math.floor((timeSecondsSum % 3600) / 60);
  const totalTime = `${totalHours}h ${totalMins}m`;

  const handleClearHistory = async () => {
    try {
      const accessToken = localStorage.accessToken;
      const res = await axios.post(
        `${REACT_APP_BASE_URL}/user/clear-session-history`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.status === 200) {
        dispatch(authActions.setUser(res.data));
      }
      setShowClearConfirm(false);
    } catch (error) {
      console.error("Failed to clear session history:", error);
    }
  };

  // PR handlers
  const syncPRsToDb = async (updatedPRs) => {
    try {
      const accessToken = localStorage.accessToken;
      const res = await axios.put(
        `${REACT_APP_BASE_URL}/user/update-prs`,
        { prs: updatedPRs },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.status === 200) {
        dispatch(authActions.setUser(res.data));
      }
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

  const handleDeletePR = async (indexToDelete) => {
    const updated = prs.filter((_, idx) => idx !== indexToDelete);
    await syncPRsToDb(updated);
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

  const getBadgeColor = (maxWeight) => {
    if (maxWeight >= 300) return "#ffd700"; // Gold
    if (maxWeight >= 200) return "#c0c0c0"; // Silver
    return "#cd7f32"; // Bronze
  };

  const getMotivationalQuote = (streakCount) => {
    if (streakCount === 0) return "Consistency is key. Complete an active workout session today to start your streak!";
    if (streakCount < 3) return "Great start! Keep moving to build a solid habit.";
    if (streakCount < 5) return "You're on a roll! The habit is forming. Don't stop now!";
    if (streakCount < 7) return "Incredible dedication! You are becoming a force to be reckoned with.";
    return "Absolute beast mode! You've unlocked true discipline. Keep it up!";
  };

  return (
    <div className="workout-dashboard-section">
      <h2 className="dashboard-title">
        <span>T</span>raining <span>D</span>ashboard
      </h2>

      {/* Top Banner: Streak & Stats Card */}
      <div className="dashboard-header-container">
        <div className="dashboard-card streak-stats-card full-width">
          <div className="streak-stats-row-flex">
            <div className="streak-header-block">
              <div className={`streak-badge-container ${streak > 0 ? "has-streak" : ""}`}>
                <WhatshotIcon className="streak-fire-icon" />
              </div>
              <div className="streak-info">
                <h3>{streak} Day Streak</h3>
                <p className="streak-subtitle">
                  {streak > 0 
                    ? "Keep the flame burning!" 
                    : "Complete a logged workout to start!"}
                </p>
              </div>
            </div>

            <div className="stats-vertical-divider"></div>

            <div className="stats-row-grid">
              <div className="stat-item-horizontal">
                <div className="stat-icon-wrapper blue">
                  <FitnessCenterIcon className="stat-icon" />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Total Workouts</span>
                  <span className="stat-value">{history.length}</span>
                </div>
              </div>
              
              <div className="stat-item-horizontal">
                <div className="stat-icon-wrapper orange">
                  <WhatshotIcon className="stat-icon" />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Volume Lifted</span>
                  <span className="stat-value">
                    {totalVolume.toLocaleString()} <span className="unit">lbs</span>
                  </span>
                </div>
              </div>
              
              <div className="stat-item-horizontal">
                <div className="stat-icon-wrapper green">
                  <TimerIcon className="stat-icon" />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Active Time</span>
                  <span className="stat-value">{totalTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-divider"></div>
          <p className="dashboard-motivational-quote">
            "{getMotivationalQuote(streak)}"
          </p>
        </div>
      </div>

      {/* Grid: Achievements & Recent Logs */}
      <div className="dashboard-grid">
        {/* Left Card: Achievements & PRs */}
        <div className="dashboard-card achievements-card-column">
          <div className="card-header-row">
            <h3>
              <EmojiEventsIcon className="header-icon" /> Achievements & PRs
            </h3>
            <span className="slots-badge">{6 - prs.length} slots left</span>
          </div>

          <div className="dashboard-prs-subgrid">
            {prs.map((pr, index) => {
              const progressPercent = Math.min(
                100,
                Math.round((pr.maxWeight / (pr.goalWeight || 1)) * 100)
              );
              const badgeColor = getBadgeColor(pr.maxWeight);

              return (
                <div className="pr-subcard-item" key={index}>
                  <div className="pr-card-header">
                    <div className="exercise-info">
                      <FitnessCenterIcon className="exercise-icon" />
                      <h4>{pr.exercise}</h4>
                    </div>
                    <div className="trophy-badge" style={{ color: badgeColor }} title="Achievement Badge">
                      <EmojiEventsIcon fontSize="small" />
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
                          <span className="weight-label">Max</span>
                          <span className="weight-value">
                            {pr.maxWeight} <span className="unit">{pr.unit}</span>
                          </span>
                        </div>
                        <div className="weight-block align-right">
                          <span className="weight-label">Goal</span>
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
              <div className="pr-subcard-item add-card">
                {showAddForm ? (
                  <form onSubmit={handleAddPR} className="pr-add-form">
                    <div className="input-group">
                      <label>Exercise</label>
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
                        <label>Max</label>
                        <input
                          type="number"
                          placeholder="Max"
                          value={newMaxWeight}
                          onChange={(e) => setNewMaxWeight(e.target.value)}
                        />
                      </div>
                      <div className="input-group half">
                        <label>Goal</label>
                        <input
                          type="number"
                          placeholder="Goal"
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
                    <span className="add-text">Add Record</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Recent Sessions History */}
        <div className="dashboard-card history-logs-card">
          <div className="card-header-row">
            <h3>
              <HistoryIcon className="header-icon" /> Recent Sessions
            </h3>
            {history.length > 0 && !showClearConfirm && (
              <button
                className="reset-history-trigger-btn"
                onClick={() => setShowClearConfirm(true)}
              >
                <DeleteIcon fontSize="small" /> Reset
              </button>
            )}
          </div>

          {showClearConfirm ? (
            <div className="clear-confirm-wrapper">
              <p>Are you sure you want to clear your entire workout history? This cannot be undone.</p>
              <div className="clear-confirm-actions">
                <button className="confirm-btn" onClick={handleClearHistory}>
                  Yes, Clear
                </button>
                <button className="cancel-btn" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="history-logs-list">
              {history.length > 0 ? (
                history.slice().reverse().map((log, index) => (
                  <div key={index} className="history-log-item">
                    <div className="log-main-info">
                      <h4 className="log-workout-name">{log.workoutName}</h4>
                      <span className="log-date">{log.date}</span>
                    </div>
                    <div className="log-stats-row">
                      <span className="log-stat">⏱️ {log.duration}</span>
                      <span className="log-stat">🏋️ {log.totalVolume.toLocaleString()} lbs</span>
                      <span className="log-stat">✅ {log.completedSets}/{log.totalSets} sets</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-history">
                  <p>No workout sessions logged yet.</p>
                  <p className="empty-subtext">
                    Click "Start Active Session" inside any routine to log your workouts and build your streak!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;
