import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import HistoryIcon from "@mui/icons-material/History";
import TimerIcon from "@mui/icons-material/Timer";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { clearSessionHistory } from "../api/userApi";
import UserProfileSmallCard from "./UserProfileSmallCard";

const TrainingDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const history = user?.sessionHistory || [];
  const streak = user?.streak || 0;

  // Aggregate stats
  let totalVolume = 0;
  let timeSecondsSum = 0;
  history.forEach((log) => {
    totalVolume += log.totalVolume || 0;
    if (log.duration && log.duration.includes(":")) {
      const [m, s] = log.duration.split(":").map(Number);
      timeSecondsSum += m * 60 + (s || 0);
    }
  });

  const totalHours = Math.floor(timeSecondsSum / 3600);
  const totalMins = Math.floor((timeSecondsSum % 3600) / 60);

  const handleClearHistory = async () => {
    try {
      await clearSessionHistory(dispatch);
      setShowClearConfirm(false);
    } catch (error) {
      console.error("Failed to clear session history:", error);
    }
  };

  const getStreakMessage = (count) => {
    if (count === 0) return "Start your first workout to ignite your streak!";
    if (count < 3) return "Great start! Keep the momentum going.";
    if (count < 7) return "You're on a roll! Don't break the chain.";
    if (count < 14) return "Incredible dedication — you're unstoppable!";
    return "Absolute beast mode. Legendary discipline!";
  };

  const recentSessions = history.slice().reverse().slice(0, 5);

  return (
    <div className="db-container">
      {/* Header */}
      <div className="db-header">
        <div className="db-header-text">
          <h1 className="db-title">
            <span>Training</span> Dashboard
          </h1>
          <p className="db-subtitle">Track your progress. Crush your goals.</p>
        </div>
        <button
          className="db-analytics-btn"
          onClick={() => navigate(`/${user?.username}/analytics`)}
        >
          <BarChartIcon /> Analytics
        </button>
      </div>

      {/* Streak Hero */}
      <div className={`db-streak-hero ${streak > 0 ? "active" : ""}`}>
        <div className="db-streak-left">
          <div className={`db-fire-ring ${streak > 0 ? "lit" : ""}`}>
            <WhatshotIcon className="db-fire-icon" />
          </div>
          <div className="db-streak-info">
            <span className="db-streak-number">{streak}</span>
            <span className="db-streak-label">Day Streak</span>
          </div>
        </div>
        <p className="db-streak-msg">{getStreakMessage(streak)}</p>
      </div>

      {/* Quick Stats Row */}
      <div className="db-stats-row">
        <div className="db-stat-chip">
          <FitnessCenterIcon className="db-stat-chip-icon blue" />
          <div className="db-stat-chip-body">
            <span className="db-stat-chip-val">{history.length}</span>
            <span className="db-stat-chip-lbl">Sessions</span>
          </div>
        </div>
        <div className="db-stat-chip">
          <TrendingUpIcon className="db-stat-chip-icon orange" />
          <div className="db-stat-chip-body">
            <span className="db-stat-chip-val">
              {totalVolume >= 1000
                ? `${(totalVolume / 1000).toFixed(1)}k`
                : totalVolume.toLocaleString()}
            </span>
            <span className="db-stat-chip-lbl">lbs Lifted</span>
          </div>
        </div>
        <div className="db-stat-chip">
          <TimerIcon className="db-stat-chip-icon green" />
          <div className="db-stat-chip-body">
            <span className="db-stat-chip-val">
              {totalHours}h {totalMins}m
            </span>
            <span className="db-stat-chip-lbl">Active Time</span>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: PRs + History */}
      <div className="db-main-grid">
        {/* Achievements / PRs */}
        <div className="db-card db-card-prs">
          <div className="db-card-head">
            <div className="db-card-head-left">
              <EmojiEventsIcon className="db-card-head-icon gold" />
              <h2>Achievements & PRs</h2>
            </div>
          </div>
          <UserProfileSmallCard hideHeader={true} />
        </div>

        {/* Recent Sessions */}
        <div className="db-card db-card-history">
          <div className="db-card-head">
            <div className="db-card-head-left">
              <HistoryIcon className="db-card-head-icon" />
              <h2>Recent Sessions</h2>
            </div>
            {history.length > 0 && !showClearConfirm && (
              <button
                className="db-reset-btn"
                onClick={() => setShowClearConfirm(true)}
              >
                <DeleteIcon fontSize="small" /> Reset
              </button>
            )}
          </div>

          {showClearConfirm ? (
            <div className="db-confirm-box">
              <p>Clear your entire workout history? This cannot be undone.</p>
              <div className="db-confirm-actions">
                <button className="db-confirm-yes" onClick={handleClearHistory}>
                  Yes, Clear
                </button>
                <button
                  className="db-confirm-no"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : recentSessions.length > 0 ? (
            <div className="db-session-list">
              {recentSessions.map((log, i) => {
                const pct =
                  log.totalSets > 0
                    ? Math.round((log.completedSets / log.totalSets) * 100)
                    : 0;
                return (
                  <div key={i} className="db-session-item">
                    <div className="db-session-top">
                      <span className="db-session-name">{log.workoutName}</span>
                      <span className="db-session-date">{log.date}</span>
                    </div>
                    <div className="db-session-stats">
                      <span>⏱ {log.duration}</span>
                      <span>🏋️ {(log.totalVolume || 0).toLocaleString()} lbs</span>
                      <span>✅ {log.completedSets}/{log.totalSets}</span>
                    </div>
                    <div className="db-session-bar-wrap">
                      <div className="db-session-bar-track">
                        <div
                          className="db-session-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="db-session-pct">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="db-empty-state">
              <HistoryIcon className="db-empty-icon" />
              <p>No sessions logged yet.</p>
              <span>
                Hit "Start Active Session" in any routine to begin tracking.
              </span>
            </div>
          )}

          {history.length > 5 && (
            <button
              className="db-view-all-btn"
              onClick={() => navigate(`/${user?.username}/analytics`)}
            >
              View Full Analytics <ArrowForwardIcon fontSize="small" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;
