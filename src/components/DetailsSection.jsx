import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCards, Pagination } from "swiper";

import ExerciseCard from "../components/ExerciseCard";
import { useNavigate } from "react-router-dom";

// Material UI Icons
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DetailSection = ({ ex, data, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    let search = type === "muscle" ? ex?.target : ex?.bodyPart;
    navigate(`/exercises/${search}`);
  };

  const focusArea = type === "muscle" ? ex?.target : ex?.bodyPart;

  return (
    <div
      className={`exercises-for-muscle-container ${
        type === "muscle" ? "row" : "row-reverse"
      } `}
    >
      <div className="muscle-detail">
        <span className="focus-label">
          {type === "muscle" ? "Target Muscle Group" : "Body Category Focus"}
        </span>
        <h2 className="muscle-detail-title">
          More Exercises for {focusArea}
        </h2>
        <hr className="muscle-info-ruler" />

        <div className="muscle-benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon-wrapper target-icon">
              <FitnessCenterIcon />
            </div>
            <div className="benefit-info">
              <h4>Primary Area</h4>
              <p className="capitalize-text">{focusArea}</p>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper burn-icon">
              <LocalFireDepartmentIcon />
            </div>
            <div className="benefit-info">
              <h4>Expected Benefit</h4>
              <p>
                {type === "muscle"
                  ? "Accelerated muscle hypertrophy & stability"
                  : "Functional mobility & core activation"}
              </p>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper tips-icon">
              <LightbulbIcon />
            </div>
            <div className="benefit-info">
              <h4>Training Tip</h4>
              <p>Maintain clean posture and controlled breathing throughout.</p>
            </div>
          </div>
        </div>

        <button className="muscle-detail-link-btn" onClick={handleClick}>
          <span>Explore All {focusArea}</span>
          <ArrowForwardIcon />
        </button>
      </div>
      <div>
        <Swiper
          effect={"cards"}
          grabCursor={true}
          pagination={{
            clickable: "true",
          }}
          modules={[EffectCards, Pagination]}
          cardsEffect={{}}
          className="mySwiper"
        >
          {data?.map((exercise, index) => {
            return (
              <SwiperSlide
                key={index}
              >
                <ExerciseCard
                  className="exercise-card"
                  key={exercise._id}
                  exerciseData={exercise}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default DetailSection;
