import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TimerIcon from "@mui/icons-material/Timer";
import BarChartIcon from "@mui/icons-material/BarChart";
import BodyMetricsTracker from "./BodyMetricsTracker";
import { useUnitPreference } from "../utils/useUnitPreference";

// UI Primitives
import {
  StatCard,
  Badge,
  Button,
  EmptyState,
} from "./ui";

const ProgressAnalytics = () => {
  const user = useSelector((state) => state.auth.user);
  const { weightUnit } = useUnitPreference();
  const history = useMemo(() => user?.sessionHistory || [], [user?.sessionHistory]);
  const prs = user?.prs || [];
  const streak = user?.streak || 0;

  const [sessionDisplayLimit, setSessionDisplayLimit] = useState(8);

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

  // Generate trailing 6 months activity (even if some months have 0 sessions)
  const monthlyData = useMemo(() => {
    const grouped = {};
    (history || []).forEach((log) => {
      if (!log) return;
      const rawDate = log.date || log.createdAt || log.timestamp;
      if (!rawDate) return;

      let d = new Date(rawDate);
      if (isNaN(d.getTime()) && typeof rawDate === "string" && rawDate.includes("/")) {
        const parts = rawDate.split("/");
        if (parts.length === 3) {
          if (Number(parts[0]) > 12) {
            d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          } else {
            d = new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
          }
        }
      }

      if (isNaN(d.getTime())) return;

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    // Build array for trailing 6 calendar months leading up to today
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;
      const monthName = d.toLocaleString("default", { month: "short" });
      const count = grouped[key] || 0;
      months.push({
        key,
        label: `${monthName} '${String(year).slice(2)}`,
        monthShort: monthName,
        count,
        isCurrent: i === 0,
      });
    }

    const maxVal = Math.max(...months.map((m) => m.count), 4);

    return months.map((m) => ({
      ...m,
      pct: m.count > 0 ? Math.max(Math.round((m.count / maxVal) * 100), 15) : 0,
    }));
  }, [history]);

  // PR level badges
  const getBadgeLevel = (maxWeight) => {
    if (maxWeight >= 300) return { label: "Gold", variant: "warning" };
    if (maxWeight >= 200) return { label: "Silver", variant: "neutral" };
    return { label: "Bronze", variant: "primary" };
  };

  // Best workout (by volume)
  const bestWorkout = useMemo(() => {
    if (!history.length) return null;
    return history.reduce((best, log) =>
      (log.totalVolume || 0) > (best?.totalVolume || 0) ? log : best, null
    );
  }, [history]);

  const reversedHistory = useMemo(() => [...history].reverse(), [history]);
  const displayedHistory = reversedHistory.slice(0, sessionDisplayLimit);

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

      {/* Hero KPI StatCards */}
      <div
        className="analytics-hero-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <StatCard
          icon={<WhatshotIcon style={{ color: "var(--primary)" }} />}
          label="Day Streak"
          value={`${streak} Days`}
        />
        <StatCard
          icon={<FitnessCenterIcon style={{ color: "var(--accent)" }} />}
          label="Sessions Logged"
          value={history.length}
        />
        <StatCard
          icon={<TrendingUpIcon style={{ color: "var(--warning)" }} />}
          label="Total Volume Lifted"
          value={(stats.totalVolume / 1000).toFixed(1)}
          unit={`k ${weightUnit}`}
        />
        <StatCard
          icon={<TimerIcon style={{ color: "var(--info)" }} />}
          label="Active Training Time"
          value={`${stats.totalHours}h ${stats.totalMins}m`}
        />
        <StatCard
          icon={<BarChartIcon style={{ color: "var(--success)" }} />}
          label="Set Completion Rate"
          value={`${stats.completionRate}%`}
        />
      </div>

      <div className="analytics-main-grid">
        {/* Monthly activity bar chart */}
        <div className="analytics-card monthly-chart-card">
          <div className="analytics-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BarChartIcon className="card-icon" />
              <h3>Monthly Activity</h3>
            </div>
            <span className="monthly-total-badge">
              {history.length} {history.length === 1 ? "Session" : "Sessions"}
            </span>
          </div>
          <div className="bar-chart">
            {monthlyData.map(({ key, label, count, pct, isCurrent }) => (
              <div
                className={`bar-group ${isCurrent ? "is-current" : ""}`}
                key={key || label}
                title={`${count} workouts logged in ${label}`}
              >
                <div className="bar-wrapper">
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: `${pct}%` }}>
                      {count > 0 && <span className="bar-value">{count}</span>}
                    </div>
                  </div>
                </div>
                <span className="bar-label">{label}</span>
              </div>
            ))}
          </div>
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
              <Badge variant="neutral" size="sm">{bestWorkout.date}</Badge>
              <div className="best-stats-row" style={{ marginTop: "12px" }}>
                <div className="best-stat">
                  <span className="best-stat-label">Volume</span>
                  <span className="best-stat-value">{(bestWorkout.totalVolume || 0).toLocaleString()} {weightUnit}</span>
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
            <EmptyState
              icon={<EmojiEventsIcon />}
              title="No Best Session Yet"
              description="Log a workout session to see your all-time volume and duration records."
            />
          )}
        </div>

        {/* PR Summary */}
        <div className="analytics-card pr-summary-card">
          <div className="analytics-card-header">
            <FitnessCenterIcon className="card-icon" />
            <h3>Personal Records</h3>
            <Badge variant="accent" size="sm">{prs.length} PRs</Badge>
          </div>
          {prs.length > 0 ? (
            <div className="pr-summary-list">
              {prs.map((pr, i) => {
                const badge = getBadgeLevel(pr.maxWeight);
                const pct = Math.min(100, Math.round((pr.maxWeight / (pr.goalWeight || 1)) * 100));
                return (
                  <div className="pr-summary-item" key={i}>
                    <div className="pr-summary-left">
                      <EmojiEventsIcon className="pr-trophy" style={{ color: "var(--accent)" }} />
                      <div className="pr-info">
                        <span className="pr-exercise">{pr.exercise}</span>
                        <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
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
            <EmptyState
              icon={<FitnessCenterIcon />}
              title="No PRs Recorded Yet"
              description="Add your 1RM personal records in your Profile & Dashboard to track strength targets."
            />
          )}
        </div>

        {/* Set completion trend with pagination */}
        <div className="analytics-card completion-card">
          <div className="analytics-card-header">
            <TrendingUpIcon className="card-icon" />
            <h3>Session History Log ({history.length})</h3>
          </div>
          {history.length > 0 ? (
            <div className="completion-list">
              {displayedHistory.map((log, i) => {
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

              {reversedHistory.length > sessionDisplayLimit && (
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setSessionDisplayLimit((prev) => prev + 10)}
                  style={{ marginTop: "8px" }}
                >
                  Show More Sessions ({reversedHistory.length - sessionDisplayLimit} remaining)
                </Button>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<TrendingUpIcon />}
              title="No Session History"
              description="Complete a workout to track your session completion rates over time."
            />
          )}
        </div>
      </div>

      {/* Body Composition & Weight History Timeline */}
      <BodyMetricsTracker mode="full" />
    </div>
  );
};

export default ProgressAnalytics;
