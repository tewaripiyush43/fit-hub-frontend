import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailSection from "../components/DetailsSection";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";

import axios from "axios";
const ExercisePage = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

  const { id } = useParams();
  // console.log(id);
  const [exercise, setexercise] = useState("");
  const [exercisesForBodyPart, setExercisesForBodyPart] = useState([]);
  const [exercisesForMuscle, setExercisesForMuscle] = useState([]);

  const findExercise = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}/exercise/findex/${id}`)
      .then((res) => {
        console.log(res);
        setexercise(res.data);
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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  console.log(id);
  return (
    <div className="exercise-page">
      <div className="quote-container">
        <FormatQuoteOutlinedIcon fontSize="large" className="quote-icon" />
        <p className="quote-text">
          “Once you are exercising regularly, the hardest thing is to stop it.”
        </p>
      </div>
      {/* <div className="exercise-detail-container"> */}
      <div className="exercise-gif-info">
        <div className="exericse-page-img-container">
          <img
            className="exercise-page-img"
            src={exercise?.gifUrl}
            alt="error"
          />
        </div>
        <div className="exercise-info">
          <h3 className="exercise-info-name">{exercise?.name} </h3>
          <hr className="exercise-info-ruler" />

          <ul className="exercise-page-info-instructions-list">
            <p className="exercise-info-detail" style={{ fontWeight: "bold" }}>
              Instructions :
            </p>
            {exercise?.instructions?.map((instruction, index) => (
              <li key={index} className="exercise-info-detail">
                {instruction}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* </div> */}

      <DetailSection ex={exercise} data={exercisesForMuscle} type="muscle" />
      <DetailSection
        ex={exercise}
        data={exercisesForBodyPart}
        type="bodyPart"
      />
    </div>
  );
};

export default ExercisePage;
