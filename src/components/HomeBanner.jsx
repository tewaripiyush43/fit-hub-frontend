import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { selectActiveWorkout } from "../store";

// UI Primitives
import { Button, Badge } from "./ui";

const HomeBanner = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const activeWorkout = useSelector(selectActiveWorkout);

  return (
    <div className="home-banner">
      <div className="banner-grid">
        <div className="banner-left">
          <Badge variant="accent" size="md" showDot>
            Your AI Fitness Companion
          </Badge>

          <h1 className="home-banner-text">
            Build a body <br />
            like your <span className="banner-highlight">favorite character</span>
          </h1>

          <p className="banner-subtext">
            Transform your training with science-backed AI workouts, 1,300+ animated exercise guides, and macro-balanced healthy recipes.
          </p>

          <div className="banner-cta-row" style={{ width: "100%" }}>
            {isLoggedIn ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  iconStart={activeWorkout?.isActive ? <OfflineBoltIcon /> : <DashboardIcon />}
                  iconEnd={<ArrowForwardIcon />}
                  onClick={() => {
                    if (activeWorkout?.isActive) {
                      navigate(`/workout/${activeWorkout.workoutId}/session`);
                    } else {
                      navigate(`/${user?.username}/dashboard`);
                    }
                  }}
                >
                  {activeWorkout?.isActive ? "Resume Active Session" : "Go to Dashboard"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/exercises/all")}
                >
                  Explore 1,300+ Exercises
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  iconEnd={<ArrowForwardIcon />}
                  onClick={() => navigate("/exercises/all")}
                >
                  Explore 1,300+ Exercises
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/recipes")}
                >
                  Browse Healthy Recipes
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="banner-right">
          <div className="banner-image-container">
            <img
              className="home-img"
              src="/back.jpg"
              alt="FitHub athlete demonstrating strength training"
              width="612"
              height="347"
              fetchpriority="high"
            />
            <div className="image-overlay-gradient"></div>

            {/* Floating Glassmorphism Cards */}
            <div className="floating-card routine-preview">
              <OfflineBoltIcon className="card-icon" />
              <div className="card-info">
                <span className="card-label">Featured Routine</span>
                <span className="card-val">Full-Body Hypertrophy</span>
              </div>
            </div>

            <div className="floating-card stats-preview">
              <FitnessCenterIcon className="card-icon" />
              <div className="card-info">
                <span className="card-label">Exercise Library</span>
                <span className="card-val">1,300+ Interactive Guides</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-dot" />
        <span>Scroll to Explore</span>
      </div>
    </div>
  );
};

export default HomeBanner;
