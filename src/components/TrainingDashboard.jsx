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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { clearSessionHistory } from "../api/userApi";
import UserProfileSmallCard from "./UserProfileSmallCard";
import MuscleRecoveryHeatmap from "./MuscleRecoveryHeatmap";
import { useUnitPreference } from "../utils/useUnitPreference";

const TrainingDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { weightUnit } = useUnitPreference();

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

  const reversedHistory = [...history].reverse();
  const displayedSessions = reversedHistory.slice(0, 3);

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
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="db-analytics-btn"
            onClick={() => navigate(`/${user?.username}/analytics`)}
          >
            <BarChartIcon /> Analytics
          </button>
        </div>
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
            <span className="db-stat-chip-lbl">Sessions Logged</span>
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
            <span className="db-stat-chip-lbl">{weightUnit} Lifted</span>
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

      {/* Quick Action Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(0, 114, 255, 0.05) 100%)",
          border: "1px solid rgba(0, 240, 255, 0.2)",
          borderRadius: "18px",
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: "800", color: "#fff" }}>
            Ready to train today?
          </h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
            Launch an active routine or generate a customized workout plan with AI.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate(`/${user?.username}/myworkouts?ai=true`)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              background: "rgba(0, 240, 255, 0.12)",
              border: "1px solid rgba(0, 240, 255, 0.3)",
              color: "#00f0ff",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <AutoAwesomeIcon style={{ fontSize: "1rem" }} /> AI Generator
          </button>
          <button
            onClick={() => navigate(`/${user?.username}/myworkouts`)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)",
              border: "none",
              color: "#050811",
              fontSize: "0.85rem",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0, 240, 255, 0.3)",
              transition: "all 0.2s ease",
            }}
          >
            <PlayArrowIcon style={{ fontSize: "1.1rem" }} /> View Routines
          </button>
        </div>
      </div>

      {/* Muscle Fatigue & Recovery Heatmap Widget */}
      <div style={{ marginBottom: "24px" }}>
        <MuscleRecoveryHeatmap />
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
              <h2>Recent Sessions ({history.length})</h2>
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
          ) : displayedSessions.length > 0 ? (
            <div className="db-session-list">
              {reversedHistory.slice(0, 3).map((log, i) => {
                const pct =
                  log.totalSets > 0
                    ? Math.round((log.completedSets / log.totalSets) * 100)
                    : 0;
                return (
                  <div
                    key={i}
                    className="db-session-item interactive"
                    onClick={() => navigate(`/${user?.username}/history`)}
                    title="Click to view full workout breakdown"
                  >
                    <div className="db-session-top">
                      <span className="db-session-name">{log.workoutName}</span>
                      <span className="db-session-date">{log.date}</span>
                    </div>
                    <div className="db-session-stats">
                      <span>⏱ {log.duration}</span>
                      <span>🏋️ {(log.totalVolume || 0).toLocaleString()} {weightUnit}</span>
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

              <button
                className="db-view-all-btn"
                onClick={() => navigate(`/${user?.username}/history`)}
                style={{
                  marginTop: "8px",
                  background: "rgba(0, 240, 255, 0.08)",
                  border: "1px solid rgba(0, 240, 255, 0.25)",
                  color: "#00f0ff",
                  fontWeight: "800",
                  padding: "11px 16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                View All Workout History & Exercise Logs &rarr;
              </button>
            </div>
          ) : (
            <div className="db-empty-state">
              <HistoryIcon className="db-empty-icon" />
              <p>No sessions logged yet.</p>
              <span>
                Hit "Start Workout" in any routine to begin tracking.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;
