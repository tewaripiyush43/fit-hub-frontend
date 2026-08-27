import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import SearchIcon from "@mui/icons-material/Search";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CalculateIcon from "@mui/icons-material/Calculate";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";

/**
 * Navigation Groups & Hierarchy Registry
 * Group categories:
 * - workspace: Daily core loops (Dashboard, Routines, History, Analytics)
 * - discover: Catalogs & Guides (Exercises, Anatomy, Recipes)
 * - tools: Calculators & Generators
 * - account: User context & customization
 * - extensions: Extension points for Trainer, Community, Organizations
 */
export const NAVIGATION_REGISTRY = [
  // ── WORKSPACE & TRAINING ───────────────────────────────────────────────────
  {
    id: "dashboard",
    label: "Dashboard",
    group: "workspace",
    icon: <DashboardIcon />,
    getPath: (user) => (user?.username ? `/${user.username}/dashboard` : "/dashboard"),
    requiresAuth: true,
    isPrimaryMobile: true,
    exact: false,
  },
  {
    id: "workouts",
    label: "My Routines",
    group: "workspace",
    icon: <FitnessCenterIcon />,
    getPath: (user) => (user?.username ? `/${user.username}/myworkouts` : "/workouts"),
    requiresAuth: true,
    isPrimaryMobile: true,
    exact: false,
  },
  {
    id: "history",
    label: "Workout History",
    group: "workspace",
    icon: <HistoryIcon />,
    getPath: (user) => (user?.username ? `/${user.username}/history` : "/history"),
    requiresAuth: true,
    isPrimaryMobile: false,
    exact: false,
  },
  {
    id: "analytics",
    label: "Analytics & PRs",
    group: "workspace",
    icon: <BarChartIcon />,
    getPath: (user) => (user?.username ? `/${user.username}/analytics` : "/analytics"),
    requiresAuth: true,
    isPrimaryMobile: false,
    exact: false,
  },

  // ── DISCOVER & BIOMECHANICS ────────────────────────────────────────────────
  {
    id: "exercises",
    label: "Exercises",
    group: "discover",
    icon: <SearchIcon />,
    getPath: () => "/exercises/all",
    requiresAuth: false,
    isPrimaryMobile: true,
    exact: false,
  },
  {
    id: "anatomy",
    label: "Muscle Anatomy",
    group: "discover",
    icon: <AccessibilityNewIcon />,
    getPath: () => "/anatomy",
    requiresAuth: false,
    isPrimaryMobile: false,
    exact: false,
  },
  {
    id: "recipes",
    label: "Healthy Recipes",
    group: "discover",
    icon: <RestaurantIcon />,
    getPath: () => "/recipes",
    requiresAuth: false,
    isPrimaryMobile: false,
    exact: false,
  },

  // ── TOOLS & AI ─────────────────────────────────────────────────────────────
  {
    id: "ai-generator",
    label: "AI Workout Generator",
    group: "tools",
    icon: <AutoAwesomeIcon />,
    getPath: (user) => (user?.username ? `/${user.username}/myworkouts?ai=true` : "/workouts?tab=explore"),
    requiresAuth: true,
    isPrimaryMobile: false,
    exact: false,
  },
  {
    id: "tools",
    label: "Fitness Tools",
    group: "tools",
    icon: <CalculateIcon />,
    getPath: (user) => (user?.username ? `/${user.username}/fitnesstools` : "/fitnesstools"),
    requiresAuth: false,
    isPrimaryMobile: false,
    exact: false,
  },

  // ── ACCOUNT & PROFILE ──────────────────────────────────────────────────────
  {
    id: "profile",
    label: "My Profile",
    group: "account",
    icon: <PersonIcon />,
    getPath: (user) => (user?.username ? `/${user.username}/myprofile` : "/myprofile"),
    requiresAuth: true,
    isPrimaryMobile: false,
    exact: false,
  },
  {
    id: "favorites",
    label: "Favorite Exercises",
    group: "account",
    icon: <FavoriteIcon />,
    getPath: (user) => (user?.username ? `/${user.username}/myfavorite` : "/myfavorite"),
    requiresAuth: true,
    isPrimaryMobile: false,
    exact: false,
  },
  {
    id: "settings",
    label: "Settings",
    group: "account",
    icon: <SettingsIcon />,
    getPath: (user) => (user?.username ? `/${user.username}/settings` : "/settings"),
    requiresAuth: true,
    isPrimaryMobile: false,
    exact: false,
  },
];

/**
 * Sidebar Groups Config
 */
export const getSidebarNavGroups = (user) => {
  return [
    {
      groupTitle: "TRAINING",
      items: [
        { id: "dashboard", name: "Dashboard", icon: <DashboardIcon />, path: user?.username ? `/${user.username}/dashboard` : "/dashboard" },
        { id: "workouts", name: "My Routines", icon: <FitnessCenterIcon />, path: user?.username ? `/${user.username}/myworkouts` : "/myworkouts" },
        { id: "ai-generator", name: "AI Generator", icon: <AutoAwesomeIcon />, path: user?.username ? `/${user.username}/myworkouts?ai=true` : "/myworkouts" },
      ],
    },
    {
      groupTitle: "PROGRESS & DATA",
      items: [
        { id: "history", name: "Workout History", icon: <HistoryIcon />, path: user?.username ? `/${user.username}/history` : "/history" },
        { id: "analytics", name: "Analytics & PRs", icon: <BarChartIcon />, path: user?.username ? `/${user.username}/analytics` : "/analytics" },
      ],
    },
    {
      groupTitle: "DISCOVER & TOOLS",
      items: [
        { id: "exercises", name: "Exercise Library", icon: <SearchIcon />, path: "/exercises/all" },
        { id: "anatomy", name: "Muscle Anatomy", icon: <AccessibilityNewIcon />, path: "/anatomy" },
        { id: "recipes", name: "Healthy Recipes", icon: <RestaurantIcon />, path: "/recipes" },
        { id: "tools", name: "Fitness Tools", icon: <CalculateIcon />, path: user?.username ? `/${user.username}/fitnesstools` : "/fitnesstools" },
      ],
    },
    {
      groupTitle: "ACCOUNT",
      items: [
        { id: "profile", name: "My Profile", icon: <PersonIcon />, path: user?.username ? `/${user.username}/myprofile` : "/myprofile" },
        { id: "favorites", name: "Favorites", icon: <FavoriteIcon />, path: user?.username ? `/${user.username}/myfavorite` : "/myfavorite" },
        { id: "settings", name: "Settings", icon: <SettingsIcon />, path: user?.username ? `/${user.username}/settings` : "/settings" },
      ],
    },
  ];
};

/**
 * Mobile Bottom Nav Configuration
 */
export const getMobileBottomNav = (user, activeWorkout) => {
  const isLoggedIn = Boolean(user && user._id);

  return [
    {
      id: "home",
      label: isLoggedIn ? "Dashboard" : "Home",
      icon: isLoggedIn ? <DashboardIcon /> : <HomeIcon />,
      path: isLoggedIn && user?.username ? `/${user.username}/dashboard` : "/",
    },
    {
      id: "workouts",
      label: "Workouts",
      icon: <FitnessCenterIcon />,
      path: isLoggedIn && user?.username ? `/${user.username}/myworkouts` : "/workouts?tab=explore",
    },
    {
      id: "active",
      label: activeWorkout?.isActive ? "Active" : "AI Coach",
      icon: activeWorkout?.isActive ? <WhatshotIcon /> : <AutoAwesomeIcon />,
      isAction: true,
      isActiveWorkout: Boolean(activeWorkout?.isActive),
      path: activeWorkout?.isActive ? `/workout/${activeWorkout.workoutId}/session` : null,
    },
    {
      id: "exercises",
      label: "Exercises",
      icon: <SearchIcon />,
      path: "/exercises/all",
    },
    {
      id: "more",
      label: "More",
      icon: null,
      isMore: true,
    },
  ];
};
