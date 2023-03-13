import React from "react";
import homeImg from "../assets/images/back-2.jpeg";

import { Link } from "react-router-dom";

const HomeBanner = () => {
  return (
    <div className="home-banner">
      <img className="home-img" src={homeImg} alt="home-img"></img>
      <div className="img-text">
        <h2 className="home-banner-text">
          Build a body like your <br /> favourite character
        </h2>
        <Link to="/exercises/all" className={`find-exercise-btn btn-effect-3d`}>
          Find Exercises
        </Link>
      </div>
    </div>
  );
};

export default HomeBanner;
