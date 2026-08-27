import React from "react";
import { useSelector } from "react-redux";
import UserProfileInfoCard from "./UserProfileInfoCard";
import GoalComponent from "./GoalComponent";
import WorkoutsSmallComponent from "./WorkoutsSmallComponent";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { useUnitPreference } from "../utils/useUnitPreference";

// UI Primitives
import { StatCard } from "./ui";

const calculateFrontendStreak = (sessionHistory = []) => {
  if (!sessionHistory || sessionHistory.length === 0) return 0;
  const uniqueDates = [
    ...new Set(
      sessionHistory
        .map((item) => {
          let dateObj = item.timestamp ? new Date(item.timestamp) : null;
          if (!dateObj || isNaN(dateObj.getTime())) {
            dateObj = new Date(item.date);
          }
          if (isNaN(dateObj.getTime()) && item.date && typeof item.date === "string") {
            const parts = item.date.split(/[/.-]/);
            if (parts.length === 3) {
              if (parts[0].length === 4) {
                dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
              } else if (parts[2].length === 4) {
                dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
              }
            }
          }
          if (!dateObj || isNaN(dateObj.getTime())) return null;
          return dateObj.toDateString();
        })
        .filter(Boolean)
    ),
  ].map((dStr) => new Date(dStr));

  uniqueDates.sort((a, b) => a - b);
  if (uniqueDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let latestDate = new Date(uniqueDates[uniqueDates.length - 1]);
  latestDate.setHours(0, 0, 0, 0);

  let streak = 0;
  if (latestDate >= yesterday) {
    streak = 1;
    let current = latestDate;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      let prev = new Date(uniqueDates[i]);
      prev.setHours(0, 0, 0, 0);
      const diffDays = Math.round((current - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
        current = prev;
      } else if (diffDays > 1) {
        break;
      }
    }
  }
  return streak;
};

const MyProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const { weightUnit } = useUnitPreference();

  const sessionsCount = user?.sessionHistory?.length || 0;
  const computedStreak = calculateFrontendStreak(user?.sessionHistory);
  const streakDays = user?.streak !== undefined && user?.streak > 0 ? user.streak : computedStreak;
  const totalVolume = user?.sessionHistory?.reduce((acc, s) => acc + (s.totalVolume || 0), 0) || 0;
  const workoutsCreated = user?.workouts?.length || 0;

  return (
    <div className="my-profile-container">
      {/* Top 4-Pillar Athlete Matrix using StatCard primitives */}
      <div
        className="athlete-quick-stats-row"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <StatCard
          icon={<WhatshotIcon style={{ color: "var(--primary)" }} />}
          label="Active Streak"
          value={`${streakDays} ${streakDays === 1 ? "Day" : "Days"}`}
        />
        <StatCard
          icon={<FitnessCenterIcon style={{ color: "var(--accent)" }} />}
          label="Logged Sessions"
          value={sessionsCount}
        />
        <StatCard
          icon={<EmojiEventsIcon style={{ color: "var(--warning)" }} />}
          label="Total Volume Lifted"
          value={totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume.toLocaleString()}
          unit={weightUnit}
        />
        <StatCard
          icon={<TrackChangesIcon style={{ color: "var(--info)" }} />}
          label="Custom Routines"
          value={workoutsCreated}
        />
      </div>

      {/* Hero Profile Info Card */}
      <div className="user-profile-info-card-container">
        <UserProfileInfoCard />
      </div>

      {/* Goals & Workouts Small Showcase */}
      <div className="user-profile-small-card-container">
        <GoalComponent />
        <WorkoutsSmallComponent />
      </div>
    </div>
  );
};

export default MyProfile;
