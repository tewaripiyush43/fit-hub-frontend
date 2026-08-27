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

// UI Primitives
import {
  StatCard,
  Button,
  Badge,
  EmptyState,
} from "./ui";

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
          <Button
            variant="accent"
            size="sm"
            iconStart={<BarChartIcon />}
            onClick={() => navigate(`/${user?.username}/analytics`)}
          >
            Analytics & PRs
          </Button>
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

      {/* Quick Stats Grid using StatCard Primitives */}
      <div className="db-stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <StatCard
          icon={<FitnessCenterIcon />}
          label="Total Sessions"
          value={history.length}
        />
        <StatCard
          icon={<TrendingUpIcon />}
          label="Total Volume"
          value={totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume.toLocaleString()}
          unit={weightUnit}
        />
        <StatCard
          icon={<TimerIcon />}
          label="Active Time"
          value={`${totalHours}h ${totalMins}m`}
        />
      </div>

      {/* Quick Action Banner */}
      <div className="db-action-banner">
        <div className="db-action-banner-info">
          <h3>Ready to train today?</h3>
          <p>Launch an active routine or generate a customized workout plan with AI.</p>
        </div>
        <div className="db-action-banner-btns">
          <Button
            variant="accent"
            size="md"
            iconStart={<AutoAwesomeIcon />}
            onClick={() => navigate(`/${user?.username}/myworkouts?ai=true`)}
          >
            AI Generator
          </Button>
          <Button
            variant="primary"
            size="md"
            iconStart={<PlayArrowIcon />}
            onClick={() => navigate(`/${user?.username}/myworkouts`)}
          >
            View Routines
          </Button>
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
                type="button"
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
                <Button variant="danger" size="sm" onClick={handleClearHistory}>
                  Yes, Clear
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : displayedSessions.length > 0 ? (
            <div className="db-session-list">
              {displayedSessions.map((log, i) => {
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
                      <Badge variant="neutral" size="sm">⏱ {log.duration}</Badge>
                      <Badge variant="accent" size="sm">🏋️ {(log.totalVolume || 0).toLocaleString()} {weightUnit}</Badge>
                      <Badge variant="success" size="sm">✅ {log.completedSets}/{log.totalSets}</Badge>
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

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => navigate(`/${user?.username}/history`)}
                style={{ marginTop: "12px" }}
              >
                View Full Workout History & Exercise Logs →
              </Button>
            </div>
          ) : (
            <EmptyState
              icon={<HistoryIcon />}
              title="No Sessions Logged Yet"
              description="Hit 'Start Workout' in any routine to begin tracking volume and personal records."
              action={
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => navigate(`/${user?.username}/myworkouts`)}
                >
                  Browse Routines
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;
