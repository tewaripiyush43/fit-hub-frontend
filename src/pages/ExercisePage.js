import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailSection from "../components/DetailsSection";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
const ExercisePage = () => {
  const { id } = useParams();
  const [ex, setex] = useState("");
  const [exercisesForBodyPart, setExercisesForBodyPart] = useState([]);
  const [exercisesForMuscle, setExercisesForMuscle] = useState([]);

  useEffect(() => {
    const findExercise = () => {
      fetch(`http://localhost:9000/findex/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setex(data);
          // console.log(data);
          findExercisesByBodyPart(data.bodyPart);
          findExercisesByMuscle(data.target);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    findExercise();

    const findExercisesByBodyPart = (bodyPart) => {
      fetch(`http://localhost:9000/exercises/bodyParts/${bodyPart}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setExercisesForBodyPart(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const findExercisesByMuscle = (muscle) => {
      fetch(`http://localhost:9000/exercises/${muscle}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setExercisesForMuscle(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
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
