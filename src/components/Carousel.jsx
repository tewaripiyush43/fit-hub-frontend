import React, { useState } from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";

// Map body parts to modern icons and short descriptions
const CATEGORY_META = {
  back: {
    icon: <AccessibilityNewIcon />,
    desc: "Lats, traps, and lower back",
    gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
  },
  cardio: {
    icon: <DirectionsRunIcon />,
    desc: "Heart rate and endurance",
    gradient: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)"
  },
  chest: {
    icon: <FitnessCenterIcon />,
    desc: "Pecs and chest strength",
    gradient: "linear-gradient(135deg, #200122 0%, #6f0000 100%)"
  },
  "lower arms": {
    icon: <FitnessCenterIcon />,
    desc: "Forearms and grip strength",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 100%, #2c5364 100%)"
  },
  "lower legs": {
    icon: <DirectionsRunIcon />,
    desc: "Calves and lower leg power",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
  },
  neck: {
    icon: <SelfImprovementIcon />,
    desc: "Neck flexibility and traps",
    gradient: "linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)"
  },
  shoulders: {
    icon: <FitnessCenterIcon />,
    desc: "Deltoids and shoulder width",
    gradient: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)"
  },
  "upper arms": {
    icon: <SportsKabaddiIcon />,
    desc: "Biceps and triceps pump",
    gradient: "linear-gradient(135deg, #d31027 0%, #ea7349 100%)"
  },
  "upper legs": {
    icon: <DirectionsRunIcon />,
    desc: "Quads, hamstrings, and glutes",
    gradient: "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)"
  },
  waist: {
    icon: <SelfImprovementIcon />,
    desc: "Core strength and obliques",
    gradient: "linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)"
  }
};

const Carousel = ({ carouselData, setSearchByCarousel, carouselTitle }) => {
  const [activeCategory, setActiveCategory] = useState("");

  const handleCategoryClick = (part) => {
    if (activeCategory === part) {
      setActiveCategory("");
      setSearchByCarousel(""); // clear filter
    } else {
      setActiveCategory(part);
      setSearchByCarousel(part); // apply filter
    }
  };

  return (
    <div className="body-parts-grid-section" data-aos="fade-up">
      <div className="section-eyebrow">TARGET GROUPS</div>
      <h2 className="section-heading">
        Explore Exercises by <span>Body Part</span>
      </h2>
      <p className="section-subtitle">
        Select a muscle group below to filter and find targeted routines instantly.
      </p>

      <div className="body-parts-grid">
        {carouselData?.map((data, index) => {
          const part = data.part.toLowerCase();
          const meta = CATEGORY_META[part] || {
            icon: <FitnessCenterIcon />,
            desc: "Targeted exercise routine",
            gradient: "linear-gradient(135deg, #232526 0%, #414345 100%)"
          };
          const isActive = activeCategory === part;

          return (
            <div
              key={index}
              onClick={() => handleCategoryClick(part)}
              className={`body-part-card ${isActive ? "active-card" : ""}`}
            >
              <div className="card-inner">
                {/* Clean graphic gradient header */}
                <div
                  className="card-graphic-header"
                  style={{ background: meta.gradient }}
                >
                  <div className="icon-wrapper">{meta.icon}</div>
                </div>

                <div className="card-body-content">
                  <h3 className="card-title-text">{data.part}</h3>
                  <p className="card-desc-text">{meta.desc}</p>
                </div>
                
                {isActive && <div className="card-active-indicator" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
