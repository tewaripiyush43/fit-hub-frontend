import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Keyboard } from "swiper";

import ExerciseCard from "../components/ExerciseCard";
import { useNavigate } from "react-router-dom";

// Material UI Icons
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const DetailSection = ({ ex, data, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    let search = type === "muscle" ? ex?.target : ex?.bodyPart;
    navigate(`/exercises/${search}`);
  };

  const focusArea = type === "muscle" ? ex?.target : ex?.bodyPart;
  const navId = `${type}-${focusArea}`.replace(/\s+/g, "-");

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

      <div className="swiper-slider-wrapper">
        {/* Custom navigation arrows */}
        <div className="detail-carousel-nav">
          <button
            className="detail-carousel-btn detail-carousel-btn--prev"
            id={`${navId}-prev`}
            aria-label="Previous exercise"
          >
            <ChevronLeftIcon />
          </button>
          <span className="detail-carousel-count">
            {data?.length || 0} exercises
          </span>
          <button
            className="detail-carousel-btn detail-carousel-btn--next"
            id={`${navId}-next`}
            aria-label="Next exercise"
          >
            <ChevronRightIcon />
          </button>
        </div>

        <Swiper
          grabCursor={true}
          slidesPerView={1}
          spaceBetween={16}
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: `#${navId}-prev`,
            nextEl: `#${navId}-next`,
          }}
          modules={[Pagination, Navigation, Keyboard]}
          className="mySwiper detail-swiper"
        >
          {data?.map((exercise, index) => {
            return (
              <SwiperSlide key={exercise._id || index}>
                <div className="detail-carousel-card-wrap">
                  <ExerciseCard
                    className="exercise-card"
                    exerciseData={exercise}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default DetailSection;

