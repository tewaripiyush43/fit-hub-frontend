import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// import ExerciseImg from "../assets/images/home-img-4.jpg";

const ExerciseCard = ({
  id,
  exerciseImg,
  bodyPart,
  targetMuscle,
  exercise,
}) => {
  const navigate = useNavigate();
  // const favoriteIcon = useRef();
  const [isFavorite, setIsFavorite] = useState(false);

  const bodyPartPage = () => {
    navigate(`/exercises/${bodyPart}`);
  };

  const targetMusclePage = () => {
    navigate(`/exercises/${targetMuscle}`);
  };

  const exercisePage = () => {
    navigate(`/exercise/${id}`);
  };

  const handleAddToFavorites = (e) => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="exercise-card">
      <img onClick={exercisePage} src={exerciseImg} alt="error" />
      {isFavorite ? (
        <FavoriteIcon
          // ref={favoriteIcon}
          onClick={handleAddToFavorites}
          className="exercise-card-favorite-icon"
        />
      ) : (
        <FavoriteBorderIcon
          // ref={favoriteIcon}
          onClick={handleAddToFavorites}
          className="exercise-card-favorite-icon"
        />
      )}

      <div className="card-info">
        <button onClick={bodyPartPage} className="exercise-button">
          {bodyPart}
        </button>
        <button onClick={targetMusclePage} className="exercise-button">
          {targetMuscle}
        </button>
      </div>
      <p className="exercise-name">{exercise}</p>
    </div>
  );
};

export default ExerciseCard;
