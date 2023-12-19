import React from "react";

import ExerciseImg from "../assets/images/dumbell.jpg";
import foodImg from "../assets/images/food-img-1.jpg";

import Card from "../components/Card";

const SectionCards = () => {
  return (
    <div className="exercise-card-div" data-aos="slide-right">
      <Card
        imgUrl={ExerciseImg}
        title="Exercises"
        description="Exercise is a body activity that enhances or maintains physical fitness and overall health and wellness. In terms of health benefits, the amount of recommended exercise depends upon the goal, the type of exercise, and the age of the person. Even doing a small amount of exercise is healthier than doing none."
        buttonText="Let's Do it!"
        textColor="#fff"
        cardTitle="Exercises"
      />
      <Card
        imgUrl={foodImg}
        title="Recipes"
        description="COMING SOON"
        buttonText="Do not click on me"
        textColor="#808080"
        cardTitle="Recipes"
      />
    </div>
  );
};

export default SectionCards;
