/**
 * Athlete Progression Tier System
 * Realistic progression levels based on consistency, volume, and logged sessions.
 * Designed so tiers feel earned — not handed out after a week of training.
 */

export const ATHLETE_TIERS = [
  {
    level: 1,
    id: "initiate",
    name: "Initiate",
    badge: "🌱",
    color: "#00e5ff",
    tagline: "Foundation & Habit Building",
    criteria: "0 – 24 Completed Sessions",
    description: "Building neuromuscular coordination, learning proper mechanics, and establishing a consistent training habit.",
    minWorkouts: 0,
    minStreak: 0,
    minVolume: 0,
    nextTierTarget: 25,
  },
  {
    level: 2,
    id: "beast",
    name: "Gym Beast",
    badge: "⚡",
    color: "#38bdf8",
    tagline: "Progressive Overload",
    criteria: "25+ Sessions · 7-Day Streak · 50k kg Volume",
    description: "Consistent training momentum with progressive overload and measurable strength gains across major lifts.",
    minWorkouts: 25,
    minStreak: 7,
    minVolume: 50000,
    nextTierTarget: 75,
  },
  {
    level: 3,
    id: "titan",
    name: "Titan",
    badge: "🔱",
    color: "#c084fc",
    tagline: "Hypertrophy & Strength Mastery",
    criteria: "75+ Sessions · 21-Day Streak · 200k kg Volume",
    description: "Advanced periodization, peak hypertrophy adaptation, and consistent volume PRs with structured recovery.",
    minWorkouts: 75,
    minStreak: 21,
    minVolume: 200000,
    nextTierTarget: 150,
  },
  {
    level: 4,
    id: "hercules",
    name: "Hercules",
    badge: "👑",
    color: "#ffd700",
    tagline: "Peak Athletic Mastery",
    criteria: "150+ Sessions · 45-Day Streak · 500k kg Volume",
    description: "Elite-level dedication, top-tier power output, and exceptional physical mastery earned through months of disciplined training.",
    minWorkouts: 150,
    minStreak: 45,
    minVolume: 500000,
    nextTierTarget: null,
  },
];

/**
 * Calculates current tier, next tier progress percentage, and requirement breakdown.
 * A user reaches the next tier when they satisfy ANY ONE of: sessions, streak, or volume.
 */
export const calculateAthleteTier = (user) => {
  const sessionsCount = user?.sessionHistory?.length || 0;
  const streak = user?.streak || 0;
  const totalVolume = user?.sessionHistory?.reduce((acc, s) => acc + (s.totalVolume || 0), 0) || 0;

  let currentTier = ATHLETE_TIERS[0];

  if (sessionsCount >= 150 || streak >= 45 || totalVolume >= 500000) {
    currentTier = ATHLETE_TIERS[3];
  } else if (sessionsCount >= 75 || streak >= 21 || totalVolume >= 200000) {
    currentTier = ATHLETE_TIERS[2];
  } else if (sessionsCount >= 25 || streak >= 7 || totalVolume >= 50000) {
    currentTier = ATHLETE_TIERS[1];
  }

  const nextTierIndex = ATHLETE_TIERS.findIndex((t) => t.level === currentTier.level + 1);
  const nextTier = nextTierIndex !== -1 ? ATHLETE_TIERS[nextTierIndex] : null;

  let progressPercent = 100;
  let remainingWorkouts = 0;

  if (nextTier) {
    const prevTarget = currentTier.minWorkouts;
    const nextTarget = nextTier.minWorkouts;
    const progressInCurrent = Math.max(0, sessionsCount - prevTarget);
    const range = nextTarget - prevTarget;
    progressPercent = Math.min(100, Math.max(5, Math.round((progressInCurrent / range) * 100)));
    remainingWorkouts = Math.max(0, nextTarget - sessionsCount);
  }

  return {
    currentTier,
    nextTier,
    progressPercent,
    remainingWorkouts,
    sessionsCount,
    streak,
    totalVolume,
  };
};

