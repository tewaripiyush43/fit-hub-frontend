import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TimerIcon from "@mui/icons-material/Timer";
import BarChartIcon from "@mui/icons-material/BarChart";

const ProgressAnalytics = () => {
  const user = useSelector((state) => state.auth.user);
  const history = user?.sessionHistory || [];
  const prs = user?.prs || [];
  const streak = user?.streak || 0;

  // Aggregate stats
  const stats = useMemo(() => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalCompleted = 0;
    let timeSecondsSum = 0;

    history.forEach((log) => {
      totalVolume += log.totalVolume || 0;
      totalSets += log.totalSets || 0;
      totalCompleted += log.completedSets || 0;
      if (log.duration && log.duration.includes(":")) {
        const [m, s] = log.duration.split(":").map(Number);
        timeSecondsSum += m * 60 + (s || 0);
      }
    });

    const totalHours = Math.floor(timeSecondsSum / 3600);
    const totalMins = Math.floor((timeSecondsSum % 3600) / 60);
    const completionRate = totalSets > 0 ? Math.round((totalCompleted / totalSets) * 100) : 0;

    return { totalVolume, totalSets, totalCompleted, totalHours, totalMins, completionRate };
  }, [history]);

  // Group workouts by month
  const monthlyData = useMemo(() => {
    const grouped = {};
    history.forEach((log) => {
      if (!log.date) return;
      const parts = log.date.split("/");
      if (parts.length < 2) return;
      const key = `${parts[2] || new Date().getFullYear()}/${parts[0]}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const sorted = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6); // last 6 months

    const maxVal = Math.max(...sorted.map(([, v]) => v), 1);
    return sorted.map(([key, count]) => {
      const [year, month] = key.split("/");
      const monthName = new Date(Number(year), Number(month) - 1).toLocaleString("default", { month: "short" });
      return { label: `${monthName} '${String(year).slice(2)}`, count, pct: Math.round((count / maxVal) * 100) };
    });
  }, [history]);

  // PR level badges
  const getBadgeLevel = (maxWeight) => {
    if (maxWeight >= 300) return { label: "Gold", color: "#ffd700" };
    if (maxWeight >= 200) return { label: "Silver", color: "#c0c0c0" };
    return { label: "Bronze", color: "#cd7f32" };
  };

  // Best workout (by volume)
  const bestWorkout = useMemo(() => {
    if (!history.length) return null;
    return history.reduce((best, log) =>
      (log.totalVolume || 0) > (best?.totalVolume || 0) ? log : best, null
    );
  }, [history]);

  return (
    <div className="progress-analytics-container">
      <div className="analytics-header">
        <h1 className="analytics-title">
          <span>P</span>rogress <span>A</span>nalytics
        </h1>
        <p className="analytics-subtitle">
          A deep look into your fitness journey — every rep, every set, every milestone.
        </p>
      </div>

      {/* Hero stats row */}
      <div className="analytics-hero-stats">
        <div className="hero-stat-card accent">
          <WhatshotIcon className="hero-stat-icon" />
          <div className="hero-stat-body">
            <span className="hero-stat-value">{streak}</span>
            <span className="hero-stat-label">Day Streak</span>
          </div>
        </div>
        <div className="hero-stat-card">
          <FitnessCenterIcon className="hero-stat-icon" />
          <div className="hero-stat-body">
            <span className="hero-stat-value">{history.length}</span>
            <span className="hero-stat-label">Sessions Logged</span>
          </div>
        </div>
        <div className="hero-stat-card">
          <TrendingUpIcon className="hero-stat-icon" />
          <div className="hero-stat-body">
            <span className="hero-stat-value">{(stats.totalVolume / 1000).toFixed(1)}k</span>
            <span className="hero-stat-label">lbs Lifted Total</span>
          </div>
        </div>
        <div className="hero-stat-card">
          <TimerIcon className="hero-stat-icon" />
          <div className="hero-stat-body">
            <span className="hero-stat-value">{stats.totalHours}h {stats.totalMins}m</span>
            <span className="hero-stat-label">Active Time</span>
          </div>
        </div>
        <div className="hero-stat-card">
          <BarChartIcon className="hero-stat-icon" />
          <div className="hero-stat-body">
            <span className="hero-stat-value">{stats.completionRate}%</span>
            <span className="hero-stat-label">Set Completion</span>
          </div>
        </div>
      </div>

      <div className="analytics-main-grid">
        {/* Monthly activity bar chart */}
        <div className="analytics-card monthly-chart-card">
          <div className="analytics-card-header">
            <BarChartIcon className="card-icon" />
            <h3>Monthly Activity</h3>
          </div>
          {monthlyData.length > 0 ? (
            <div className="bar-chart">
              {monthlyData.map(({ label, count, pct }) => (
                <div className="bar-group" key={label}>
                  <div className="bar-wrapper">
                    <div className="bar-fill" style={{ height: `${pct}%` }}>
                      <span className="bar-value">{count}</span>
                    </div>
                  </div>
                  <span className="bar-label">{label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="analytics-empty">
              <p>No sessions logged yet. Start a workout to see your activity chart!</p>
            </div>
          )}
        </div>

        {/* Best workout highlight */}
        <div className="analytics-card best-workout-card">
          <div className="analytics-card-header">
            <EmojiEventsIcon className="card-icon gold" />
            <h3>Personal Best Session</h3>
          </div>
          {bestWorkout ? (
            <div className="best-workout-content">
              <h4 className="best-workout-name">{bestWorkout.workoutName}</h4>
              <span className="best-workout-date">{bestWorkout.date}</span>
              <div className="best-stats-row">
                <div className="best-stat">
                  <span className="best-stat-label">Volume</span>
                  <span className="best-stat-value">{(bestWorkout.totalVolume || 0).toLocaleString()} lbs</span>
                </div>
                <div className="best-stat">
                  <span className="best-stat-label">Duration</span>
                  <span className="best-stat-value">{bestWorkout.duration}</span>
                </div>
                <div className="best-stat">
                  <span className="best-stat-label">Sets</span>
                  <span className="best-stat-value">{bestWorkout.completedSets}/{bestWorkout.totalSets}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="analytics-empty">
              <p>Log a workout session to see your personal best!</p>
            </div>
          )}
        </div>

        {/* PR Summary */}
        <div className="analytics-card pr-summary-card">
          <div className="analytics-card-header">
            <FitnessCenterIcon className="card-icon" />
            <h3>Personal Records</h3>
            <span className="pr-count-badge">{prs.length} PRs</span>
          </div>
          {prs.length > 0 ? (
            <div className="pr-summary-list">
              {prs.map((pr, i) => {
                const badge = getBadgeLevel(pr.maxWeight);
                const pct = Math.min(100, Math.round((pr.maxWeight / (pr.goalWeight || 1)) * 100));
                return (
                  <div className="pr-summary-item" key={i}>
                    <div className="pr-summary-left">
                      <EmojiEventsIcon style={{ color: badge.color }} className="pr-trophy" />
                      <div className="pr-info">
                        <span className="pr-exercise">{pr.exercise}</span>
                        <span className="pr-badge-label" style={{ color: badge.color }}>{badge.label}</span>
                      </div>
                    </div>
                    <div className="pr-summary-right">
                      <div className="pr-weights">
                        <span className="pr-max">{pr.maxWeight} {pr.unit}</span>
                        <span className="pr-sep">→</span>
                        <span className="pr-goal">{pr.goalWeight} {pr.unit} goal</span>
                      </div>
                      <div className="pr-mini-bar">
                        <div className="pr-mini-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="pr-pct">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="analytics-empty">
              <p>No PRs recorded yet. Add your personal records in your Dashboard!</p>
            </div>
          )}
        </div>

        {/* Set completion trend */}
        <div className="analytics-card completion-card">
          <div className="analytics-card-header">
            <TrendingUpIcon className="card-icon" />
            <h3>Recent Sessions</h3>
          </div>
          {history.length > 0 ? (
            <div className="completion-list">
              {history.slice().reverse().slice(0, 8).map((log, i) => {
                const pct = log.totalSets > 0 ? Math.round((log.completedSets / log.totalSets) * 100) : 0;
                return (
                  <div className="completion-row" key={i}>
                    <div className="completion-info">
                      <span className="completion-name">{log.workoutName}</span>
                      <span className="completion-date">{log.date}</span>
                    </div>
                    <div className="completion-bar-wrap">
                      <div className="completion-bar-track">
                        <div className="completion-bar-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="completion-pct">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="analytics-empty">
              <p>Complete a workout to track your session completion rates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
