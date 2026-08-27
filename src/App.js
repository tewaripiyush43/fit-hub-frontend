import "./styles/styles.scss";
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import UserProfileSideBar from "./components/UserProfileSideBar";
import BottomNavigation from "./components/BottomNavigation";
import InstallBanner from "./components/InstallBanner";
import ActiveWorkoutTopBanner from "./components/ActiveWorkoutTopBanner";
import QuickCommandPalette from "./components/QuickCommandPalette";
import FitHubToastContainer from "./components/FitHubToastContainer";

import { getUser } from "./api/authApi";
import { updateSEO } from "./utils/seoHelper";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Home = lazy(() => import("./pages/Home"));
const Recipes = lazy(() => import("./pages/Recipes"));
const ExercisePage = lazy(() => import("./pages/ExercisePage"));
const ExercisesPage = lazy(() => import("./pages/Exercises"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const WorkoutPage = lazy(() => import("./pages/WorkoutPage"));
const SharedWorkoutPage = lazy(() => import("./pages/SharedWorkoutPage"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const AICoachChat = lazy(() => import("./components/AICoachChat"));
const AnatomyPage = lazy(() => import("./pages/AnatomyPage"));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  // console.log(REACT_APP_BASE_URL);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isRouteResetPassword =
    window.location.pathname.includes("/reset-password");

  const shouldRenderNavbar = isRouteResetPassword;

  useEffect(() => {
    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);

    let title = "FitHub - AI Workout Generator, Exercises & Fitness Recipes";
    let description = "FitHub is an AI workout generator, fitness tracker, and exercise library. Log workouts, track streaks, explore 1,300+ exercises with animated form guides, and browse healthy nutrition recipes.";
    let keywords = "fithub, fitness tracker app, ai workout generator, workout routines, exercise database, muscle anatomy map, gym log, nutrition recipes";

    if (parts.length === 0) {
      title = "FitHub - AI Workout Generator, Exercises & Fitness Recipes";
      description = "Transform your training with FitHub. AI-generated workout routines, 1,300+ animated exercise guides, interactive 2D muscle anatomy map, and healthy macro-balanced recipes.";
    } else if (parts[0] === "forgot-password") {
      title = "Reset Password | FitHub Account Recovery";
      description = "Forgot your FitHub password? Enter your email address to receive secure password reset instructions.";
    } else if (parts[0] === "reset-password") {
      title = "Create New Password | FitHub";
      description = "Enter and confirm your new secure password to restore access to your FitHub training account.";
    } else if (parts[0] === "exercises") {
      const category = parts[1] ? parts[1].replace(/[-_]/g, " ") : "";
      title = category
        ? `FitHub - ${category.charAt(0).toUpperCase() + category.slice(1)} Exercises & Workouts | 1,300+ Guides`
        : "FitHub - Search 1,300+ Gym Exercises & Muscle Workouts | Interactive GIFs";
      description = `Search FitHub's comprehensive library of 1,300+ exercises${category ? ` for ${category}` : ""}. Filter by muscle group, gym equipment, and view step-by-step form execution animations.`;
      keywords = `exercises, ${category || "gym exercises"}, workout GIFs, muscle targets, bodybuilding, strength training`;
    } else if (parts[0] === "anatomy" || parts[0] === "muscle-map") {
      title = "FitHub - Interactive 2D Muscle Anatomy Map & Biomechanics Explorer";
      description = "Interactive 2D muscle anatomy map and biomechanics explorer. Select target muscles to reveal motor unit recruitment, optimal rep ranges, warmup protocols, and AI coach analysis.";
      keywords = "muscle anatomy map, biomechanics explorer, 2d human anatomy, muscle recovery heatmap, bodybuilding anatomy, prime mover exercises";
    } else if (parts[0] === "recipes") {
      title = "FitHub - Healthy High-Protein & Fitness Nutrition Recipes";
      description = "Fuel your muscle growth and recovery with FitHub's curated fitness recipes. Filter by High Protein, Low Carb, Keto, and Vegan with exact calorie and macronutrient breakdowns.";
      keywords = "healthy recipes, high protein meals, bodybuilding diet, fitness nutrition, low carb meal prep, keto recipes";
    } else if (parts[0] === "fitnesstools" || parts[0] === "tools") {
      title = "FitHub - Fitness Tools: Barbell Plate Calculator, 1RM & BMI";
      description = "Free gym and fitness calculators. Calculate Olympic barbell plate loadings, estimate One-Rep Max (1RM) using scientific formulas, and compute Body Mass Index.";
      keywords = "plate calculator, barbell loader, 1rm calculator, one rep max, bmi calculator, gym calculators";
    } else if (parts[0] === "exercise") {
      title = "FitHub - Exercise Form Guide & Interactive Execution Demonstration";
      description = "Step-by-step exercise instructions, targeted muscle groups, secondary muscles, and animated form execution on FitHub.";
    } else if (parts[0] === "share" && parts[1] === "workout") {
      title = "FitHub - Shared Workout Routine & Training Program";
      description = "Check out this custom workout routine on FitHub. View exercises, sets, reps, and add it directly to your training routines.";
    } else if (parts.length >= 2) {
      const page = parts[1];
      if (page === "myworkouts") {
        title = parts.length >= 3 ? "FitHub - View Workout Routine" : "FitHub - My Custom Workout Routines & Training Programs";
        description = "Manage and execute your personalized workout routines, custom gym splits, and training regimens on FitHub.";
      } else if (page === "dashboard") {
        title = "FitHub - Athlete Dashboard: Streaks, Total Volume & PRs";
        description = "Track your workout consistency, training streaks, total tonnage volume, and personal records on your FitHub Athlete Dashboard.";
      } else if (page === "history" || page === "workouthistory") {
        title = "FitHub - Workout History & Detailed Training Session Logs";
        description = "Review your historical workout logs, completed sets, reps, recorded weights, and rest periods on FitHub.";
      } else if (page === "settings") {
        title = "FitHub - Account Settings & Profile Customization";
        description = "Customize your FitHub athlete profile, unit preferences (kg/lbs), fitness level, and training goals.";
      } else {
        title = `FitHub - ${parts[0]}'s Athlete Profile`;
      }
    }

    updateSEO({
      title,
      description,
      pathname: location.pathname,
      keywords,
    });

    // P0 Scroll Fix: Guarantee cleanup of any modal/portal/drawer scroll locks on route transitions
    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
  }, [location.pathname]);

  useEffect(() => {
    getUser(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      getUser(dispatch);
    }
  }, [isLoggedIn, dispatch]);

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`App ${isLoggedIn ? "has-sidebar" : ""}`}>
      <FitHubToastContainer />
      {isLoggedIn && <UserProfileSideBar />}
      <main className="main-app-content">
        <ActiveWorkoutTopBanner />
        {!shouldRenderNavbar && <Navbar />}
        <InstallBanner />
        <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><div style={{ width: "32px", height: "32px", border: "2px solid rgba(0, 240, 255, 0.1)", borderTopColor: "#00f0ff", borderRadius: "50%", animation: "spin 0.8s infinite linear" }}></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/exercises/:search" element={<ExercisesPage />} />
            <Route path="/anatomy" element={<AnatomyPage />} />
            <Route path="/muscle-map" element={<AnatomyPage />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/exercise/:id" element={<ExercisePage />} />
            <Route path="/workouts" element={<UserProfile />} />
            <Route path="/fitnesstools" element={<UserProfile />} />
            <Route path="/tools" element={<UserProfile />} />
            <Route path="/dashboard" element={<UserProfile />} />
            <Route path="/analytics" element={<UserProfile />} />
            <Route path="/history" element={<UserProfile />} />
            <Route path="/myworkouts" element={<UserProfile />} />
            <Route path="/myprofile" element={<UserProfile />} />
            <Route path="/settings" element={<UserProfile />} />
            <Route path="/:username/:page" element={<UserProfile />} />

            <Route
              path="/:username/myworkouts/:workoutId"
              element={<WorkoutPage />}
            />
            <Route path="/workout/:workoutId" element={<WorkoutPage />} />
            <Route path="/workout/:workoutId/session" element={<WorkoutPage />} />
            <Route path="/share/workout/:workoutId" element={<SharedWorkoutPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </main>
      {showScrollButton && (
        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <KeyboardArrowUpIcon />
        </button>
      )}
      <Suspense fallback={null}>
        <AICoachChat />
      </Suspense>
      <QuickCommandPalette />
      <BottomNavigation />
    </div>
  );
}

export default App;
