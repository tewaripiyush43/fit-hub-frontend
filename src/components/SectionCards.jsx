import React from "react";

import ExerciseImg from "../assets/images/home-img-4.jpg";
import foodImg from "../assets/images/anime-food.jpeg";

import Card from "../components/Card";

const SectionCards = () => {
  return (
    <div className="section-cards-wrapper" data-aos="fade-up">
      <div className="section-cards-eyebrow">EXPLORE</div>
      <h2 className="section-cards-heading">
        Start your journey with <span>what matters most</span>
      </h2>
      <div className="section-cards-grid">
        <Card
          imgUrl={ExerciseImg}
          title="Exercises"
          description="Explore 1300+ exercises filtered by muscle group, equipment, and difficulty — each with animated GIF demonstrations to perfect your form."
          buttonText="Browse Exercises"
          cardTitle="Exercises"
          tag="1300+ Exercises"
        />
        <Card
          imgUrl={foodImg}
          title="Recipes"
          description="Fuel your fitness journey with our curated selection of high-protein, nutritious recipes designed to match your goals and taste."
          buttonText="Browse Recipes"
          cardTitle="Recipes"
          tag="500+ Recipes"
        />
      </div>
    </div>
  );
};

export default SectionCards;
