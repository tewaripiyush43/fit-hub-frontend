import React from "react";
import { useNavigate } from "react-router-dom";
// import ExerciseImg from "../assets/images/home-img-4.jpg";

const ExerciseCard = ({
  id,
  exerciseImg,
  bodyPart,
  targetMuscle,
  exercise,
}) => {
  const navigate = useNavigate();

  const bodyPartPage = () => {
    navigate(`/exercises/${bodyPart}`);
  };

  const targetMusclePage = () => {
    navigate(`/exercises/${targetMuscle}`);
  };

  const exercisePage = () => {
    navigate(`/exercise/${id}`);
  };

  return (
    <div className="exercise-card">
      <img onClick={exercisePage} src={exerciseImg} alt="error" />
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
