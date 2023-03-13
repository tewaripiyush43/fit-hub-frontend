import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCards, Pagination, Navigation } from "swiper";

import ExerciseCard from "../components/ExerciseCard";
import { useNavigate } from "react-router-dom";

const DetailSection = ({ ex, data, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    let search = type === "muscle" ? ex.target : ex.bodyPart;
    navigate(`/exercises/${search}`);
  };

  return (
    <div
      className={`exercises-for-muscle-container ${
        type === "muscle" ? "row" : "row-reverse"
      } `}
    >
      <div className="muscle-detail">
        <h1 className="muscle-detail-title">
          More Exercises for &#32; {type === "muscle" ? ex.target : ex.bodyPart}
        </h1>
        <hr />
        <p className="muscle-detail-info">
          Exercises keep you strong {ex.name} is one of the best exercises to
          target your {ex.target}. It will help you improve your mood and gain
          energy.
        </p>

        <button className="muscle-detail-link" onClick={handleClick}>
          see more...
        </button>
      </div>
      <div className="father">
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
          {data.map((exercise, index) => {
            return (
              <SwiperSlide
                // onClick={() => handleCarouselClick(data.part)}
                key={index}
              >
                <ExerciseCard
                  className="exercise-card"
                  key={exercise._id}
                  id={exercise._id}
                  exerciseImg={exercise.gifUrl}
                  bodyPart={exercise.bodyPart}
                  targetMuscle={exercise.target}
                  exercise={exercise.name}
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
