import React from "react";

import ExerciseImg from "../assets/images/home-img-4.jpg";
import foodImg from "../assets/images/anime-food.jpeg";

import Card from "../components/Card";

const SectionCards = () => {
  return (
    <div className="exercise-card-div" data-aos="slide-right">
      <Card
        imgUrl={ExerciseImg}
        title="Exercises"
        description="Exercise is a body activity that enhances or maintains physical fitness and overall health and wellness. In terms of health benefits, the amount of recommended exercise depends upon the goal, the type of exercise, and the age of the person. Even doing a small amount of exercise is healthier than doing none."
        buttonText="Let's Do it!"
        cardTitle="Exercises"
      />
      <Card
        imgUrl={foodImg}
        title="Recipes"
        description="COMING SOON"
        buttonText="Do not click on me"
        cardTitle="Recipes"
      />
    </div>
  );
};

export default SectionCards;
