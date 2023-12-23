import React from "react";
import { useNavigate } from "react-router-dom";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

const Card = ({ imgUrl, title, description, buttonText, cardTitle }) => {
  const navigate = useNavigate();

  const handleOnclick = () => {
    const value = cardTitle.toLowerCase();
    if (value === "exercises") navigate(`/exercises/all`);
    else navigate("/recipes");
  };

  return (
    <>
      <div className="card">
        {<img className="card-img" src={imgUrl} alt="pic" />}
        <p className="card-title">{cardTitle}</p>
        <div className="card-content">
          <h1 className="card-decription-title">{title}</h1>
          <p className="card-details">{description}</p>
          <button onClick={handleOnclick}>{buttonText}</button>
        </div>
      </div>
    </>
  );
};

export default Card;
