import React from "react";
import homeImg from "../assets/images/back.jpg";
import { Link } from "react-router-dom";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";

const HomeBanner = () => {
  return (
    <div className="home-banner">
      <div className="banner-grid">
        <div className="banner-left">
          <span className="banner-eyebrow">✦ Your AI Fitness Companion</span>
          
          <h1 className="home-banner-text">
            Build a body <br />
            like your <span className="banner-highlight">favorite character</span>
          </h1>
          
          <p className="banner-subtext">
            Transform your training with AI-generated workouts, 1,300+ exercise guides, and customized healthy recipes designed to fuel your recovery.
          </p>
          
          <div className="banner-cta-row">
            <Link to="/exercises/all" className="find-exercise-btn">
              <span>Explore Exercises</span>
              <span className="btn-arrow">&rarr;</span>
            </Link>
            <Link to="/recipes" className="banner-secondary-btn">
              Browse Recipes
            </Link>
          </div>
        </div>

        <div className="banner-right">
          <div className="banner-image-container">
            <img className="home-img" src={homeImg} alt="FitHub hero character" fetchpriority="high" />
            <div className="image-overlay-gradient"></div>
            
            {/* Floating Glassmorphism Cards */}
            <div className="floating-card routine-preview">
              <OfflineBoltIcon className="card-icon" />
              <div className="card-info">
                <span className="card-label">Next Workout</span>
                <span className="card-val">Goku's Strength Routine</span>
              </div>
            </div>

            <div className="floating-card stats-preview">
              <FitnessCenterIcon className="card-icon" />
              <div className="card-info">
                <span className="card-label">Exercises Available</span>
                <span className="card-val">1,300+ Detailed Guides</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-dot" />
        <span>Scroll</span>
      </div>
    </div>
  );
};

export default HomeBanner;
