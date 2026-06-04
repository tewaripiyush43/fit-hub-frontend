import React from "react";
import { useSelector } from "react-redux";
import ExerciseCard from "./ExerciseCard";

const MyFavorite = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="my-favorites-container">
      <p className="my-favorites-title">
        <span>M</span>y <span>F</span>avorites
      </p>

      <div className="my-favorite-exercise-cards-container">
        {user?.favoriteExercises?.map((exercise) => (
          <ExerciseCard
            key={exercise._id}
            animation={true}
            exerciseData={exercise}
          />
        ))}
        {user?.favoriteExercises?.length === 0 && (
          <p className="no-favorite-exercises">No Favorite Exercises</p>
        )}
      </div>
    </div>
  );
};

export default MyFavorite;
