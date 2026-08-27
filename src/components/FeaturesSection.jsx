import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { portalActions } from "../store/index";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// UI Primitives
import { Badge } from "./ui";

const features = [
  {
    icon: <AutoAwesomeIcon className="feature-icon" />,
    tag: "AI-POWERED",
    title: "Custom AI Workout Generator",
    description:
      "Generate science-backed, periodized routines tailored to your available equipment, goals, and experience in seconds.",
    shortBenefit: "Instant personalized routine generator",
    accentColor: "#00e5ff",
    path: "/myworkouts?ai=true",
    protected: true,
    spotlight: true,
  },
  {
    icon: <FitnessCenterIcon className="feature-icon" />,
    tag: "BARBELL TECH",
    title: "Visual Barbell Plate Calculator",
    description:
      "Exact color-coded Olympic plate stacking diagrams per side in both KG and LBS — zero math required at the rack.",
    shortBenefit: "Color-coded plate loading diagrams",
    accentColor: "#f59e0b",
    path: "/fitnesstools",
    protected: false,
  },
  {
    icon: <AccessibilityNewIcon className="feature-icon" />,
    tag: "BIOMECHANICS",
    title: "2D Muscle Anatomy Explorer",
    description:
      "Anterior & posterior 2D mannequins with dynamic muscle activation, warmups, and cooldown routines.",
    shortBenefit: "Interactive 2D muscle maps & warmups",
    accentColor: "#00f0ff",
    path: "/anatomy",
    protected: false,
  },
  {
    icon: <EmojiEventsIcon className="feature-icon" />,
    tag: "PROGRESS",
    title: "Smart Workout Logging & PRs",
    description:
      "Track sets, weight, RPE, volume, and personal records automatically with detailed session analytics.",
    shortBenefit: "Automatic PR & volume tracking",
    accentColor: "#ffca28",
    path: "/dashboard",
    protected: true,
  },
  {
    icon: <FitnessCenterIcon className="feature-icon" />,
    tag: "LIBRARY",
    title: "1,300+ Exercise Library",
    description:
      "Explore comprehensive exercises with animated form demonstrations, muscle maps, and step-by-step instructions.",
    shortBenefit: "Animated form guides & muscle maps",
    accentColor: "#4caf50",
    path: "/exercises/all",
    protected: false,
  },
  {
    icon: <RestaurantMenuIcon className="feature-icon" />,
    tag: "NUTRITION",
    title: "High-Protein Recipes",
    description:
      "Fuel recovery with hand-picked, macro-balanced recipes designed for peak athletic performance.",
    shortBenefit: "Macro-balanced healthy recipes",
    accentColor: "#ff9800",
    path: "/recipes",
    protected: false,
  },
  {
    icon: <TrackChangesIcon className="feature-icon" />,
    tag: "GOALS",
    title: "Milestone & Goal Tracking",
    description:
      "Set measurable strength and weight targets with visual analytics to stay on track.",
    shortBenefit: "Real-time strength & weight goals",
    accentColor: "#ab47bc",
    path: "/myprofile",
    protected: true,
  },
  {
    icon: <CalculateIcon className="feature-icon" />,
    tag: "TOOLS",
    title: "Fitness Calculators",
    description:
      "BMI, TDEE, 1RM, and Body Fat calculators to train and eat with mathematical precision.",
    shortBenefit: "BMI, TDEE, 1RM & Body Fat tools",
    accentColor: "#00bcd4",
    path: "/fitnesstools",
    protected: false,
  },
];

const FeaturesSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const handleCardClick = (feature) => {
    if (feature.protected) {
      if (isLoggedIn) {
        navigate(`/${user?.username}${feature.path}`);
      } else {
        dispatch(portalActions.setPortalOpen());
        dispatch(portalActions.setPortalTypeLogin());
      }
    } else {
      navigate(feature.path);
    }
  };

  const spotlightFeature = features[0];
  const gridFeatures = features.slice(1);

  return (
    <section className="features-section">
      <div className="features-inner">
        <p className="features-eyebrow">WHAT'S INSIDE</p>
        <h2 className="features-heading">
          Everything built for <span>serious athletes</span>
        </h2>
        <p className="features-subheading">
          A complete fitness ecosystem combining AI intelligence, visual barbell plating, and progressive overload tracking.
        </p>

        {/* 🌟 Spotlight Hero Feature Card */}
        <div
          className="spotlight-feature-card"
          data-aos="fade-up"
          onClick={() => handleCardClick(spotlightFeature)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick(spotlightFeature);
            }
          }}
          role="button"
          tabIndex={0}
          style={{ "--accent-color": spotlightFeature.accentColor }}
        >
          <div className="spotlight-content">
            <div className="spotlight-header">
              <div className="feature-card-icon-wrapper spotlight-icon">
                {spotlightFeature.icon}
              </div>
              <Badge variant="accent" size="sm">
                {spotlightFeature.tag}
              </Badge>
            </div>
            <h3 className="spotlight-title">{spotlightFeature.title}</h3>
            <p className="spotlight-desc">{spotlightFeature.description}</p>
            <div className="spotlight-cta">
              <span>Launch AI Generator</span>
              <ArrowForwardIcon style={{ fontSize: "1rem" }} />
            </div>
          </div>
        </div>

        {/* ⚡ Bento Grid on Mobile / Desktop */}
        <div className="features-bento-grid">
          {gridFeatures.map((f, i) => (
            <div
              className="feature-card bento-card"
              key={i}
              data-aos="fade-up"
              data-aos-delay={`${(i + 1) * 50}`}
              style={{ "--accent-color": f.accentColor }}
              onClick={() => handleCardClick(f)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(f);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="feature-card-icon-wrapper">
                {f.icon}
              </div>
              <Badge variant="neutral" size="sm" style={{ marginBottom: "8px" }}>
                {f.tag}
              </Badge>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-description desktop-only">{f.description}</p>
              <p className="feature-description mobile-only">{f.shortBenefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
