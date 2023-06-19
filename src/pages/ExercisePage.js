import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailSection from "../components/DetailsSection";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";

import axios from "axios";
const ExercisePage = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

  const { id } = useParams();
  // console.log(id);
  const [ex, setex] = useState("");
  const [exercisesForBodyPart, setExercisesForBodyPart] = useState([]);
  const [exercisesForMuscle, setExercisesForMuscle] = useState([]);

  const findExercise = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}/exercise/findex/${id}`)
      .then((res) => {
        setex(res.data);
        findExercisesByBodyPart(res.data.bodyPart);
        findExercisesByMuscle(res.data.target);
      })
      .catch((err) => console.log(err.message));
  };

  const findExercisesByBodyPart = async (bodyPart) => {
    await axios
      .get(`${REACT_APP_BASE_URL}/exercise/exercises/bodyParts/${bodyPart}`)
      .then((res) => {
        setExercisesForBodyPart(res.data);
      })
      .catch((err) => console.log(err.message));
  };

  const findExercisesByMuscle = async (muscle) => {
    await axios
      .get(`${REACT_APP_BASE_URL}/exercise/exercises/${muscle}`)
      .then((res) => {
        setExercisesForMuscle(res.data);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    findExercise();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // console.log(id);
  return (
    <div className="exercise-page">
      {/*quote*/}
      <div className="quote-container">
        <FormatQuoteOutlinedIcon fontSize="large" className="quote-icon" />
        <p>
          “Once you are exercising regularly, the hardest thing is to stop it.”
        </p>
      </div>
      <div className="exercise-gif-info">
        <img src={ex.gifUrl} alt="error" />
        <div className="exercise-info">
          <h3 className="exercise-info-name">{ex.name} </h3>
          <hr />
          <p className="exercise-info-detail">
            Exercises keep you strong {ex.name} is one of the best exercises to
            target your {ex.target}. It will help you improve your mood and gain
            energy.
          </p>
        </div>
      </div>

      <DetailSection ex={ex} data={exercisesForMuscle} type="muscle" />
      <DetailSection ex={ex} data={exercisesForBodyPart} type="bodyPart" />
    </div>
  );
};

export default ExercisePage;
