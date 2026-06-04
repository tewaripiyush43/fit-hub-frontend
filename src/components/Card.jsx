import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Card = ({ imgUrl, title, description, buttonText, cardTitle, accentColor, tag }) => {
  const navigate = useNavigate();

  const handleOnclick = () => {
    const value = cardTitle.toLowerCase();
    if (value === "exercises") navigate(`/exercises/all`);
    else navigate("/recipes");
  };

  return (
    <div className="modern-card" onClick={handleOnclick}>
      <div className="modern-card-image-wrapper">
        <img className="modern-card-img" src={imgUrl} alt={cardTitle} />
        <div className="modern-card-image-overlay" />
        {tag && <span className="modern-card-tag">{tag}</span>}
      </div>
      <div className="modern-card-body">
        <h2 className="modern-card-title">{title}</h2>
        <p className="modern-card-description">{description}</p>
        <button className="modern-card-btn">
          {buttonText}
          <ArrowForwardIcon style={{ fontSize: "1.1rem" }} />
        </button>
      </div>
    </div>
  );
};

export default Card;
