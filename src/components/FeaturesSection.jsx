import React from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CalculateIcon from "@mui/icons-material/Calculate";

const features = [
  {
    icon: <AutoAwesomeIcon className="feature-icon" />,
    tag: "AI-Powered",
    title: "Custom AI Workout Generator",
    description:
      "Tell our AI your fitness level, goals, and available equipment. Get a personalized workout plan in seconds — no guesswork, just science.",
    accentColor: "#00e5ff",
  },
  {
    icon: <RestaurantMenuIcon className="feature-icon" />,
    tag: "Nutrition",
    title: "Nutritious Recipes",
    description:
      "Fuel your training with hand-picked, high-protein recipes designed to match your fitness goals. Tasty, balanced, and optimized for performance.",
    accentColor: "#ff9800",
  },
  {
    icon: <EmojiEventsIcon className="feature-icon" />,
    tag: "Progress",
    title: "Workout Notes & History",
    description:
      "Document your workouts with detailed notes and AI-generated descriptions. Keep a running log of what you lifted, how you felt, and what to improve.",
    accentColor: "#ffca28",
  },
  {
    icon: <FitnessCenterIcon className="feature-icon" />,
    tag: "Library",
    title: "1300+ Exercise Catalogue",
    description:
      "Explore an extensive library of exercises filtered by muscle group, equipment, and difficulty — each with animated GIF demos.",
    accentColor: "#4caf50",
  },
  {
    icon: <TrackChangesIcon className="feature-icon" />,
    tag: "Goals",
    title: "Goal Tracking",
    description:
      "Set measurable fitness goals and track your progress over time. Visualize how far you've come and what's left to conquer.",
    accentColor: "#ab47bc",
  },
  {
    icon: <CalculateIcon className="feature-icon" />,
    tag: "Tools",
    title: "Fitness Calculators",
    description:
      "BMI, TDEE, Macro splits, and One-Rep Max calculators — all the numbers you need to train and eat with precision.",
    accentColor: "#ef5350",
  },
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="features-inner">
        <p className="features-eyebrow">WHAT'S INSIDE</p>
        <h2 className="features-heading">
          Everything built for <span>serious athletes</span>
        </h2>
        <p className="features-subheading">
          A complete fitness platform combining AI intelligence, nutrition science, and game-like progression.
        </p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div
              className="feature-card"
              key={i}
              data-aos="fade-up"
              data-aos-delay={`${i * 80}`}
              style={{ "--accent-color": f.accentColor }}
            >
              <div className="feature-card-icon-wrapper">
                {f.icon}
              </div>
              <span className="feature-tag">{f.tag}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-description">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
