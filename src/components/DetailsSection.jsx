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
  // console.log(data);

  const handleClick = () => {
    let search = type === "muscle" ? ex?.target : ex?.bodyPart;
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
          More Exercises for &#32;{" "}
          {type === "muscle" ? ex?.target : ex?.bodyPart}
        </h1>
        <hr className="muscle-info-ruler" />
        <p className="muscle-detail-info">
          Exercises keep you strong {ex?.name} is one of the best exercises to
          target your {type === "muscle" ? ex?.target : ex?.bodyPart}. It will
          help you improve your mood and gain energy. It will also help you to
          sleep better and manage your weight. Regular exercise is good for your
          muscles, bones, and joints. To see more exercises for{" "}
          {type === "muscle" ? ex?.target : ex?.bodyPart} click on the button
          below.
        </p>

        <button className="muscle-detail-link" onClick={handleClick}>
          see more...
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
                // onClick={() => handleCarouselClick(data.part)}
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
