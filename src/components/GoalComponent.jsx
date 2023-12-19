import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const GoalComponent = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [editMode, setEditMode] = useState(false);

  const [goals, setGoals] = useState([
    {
      id: 1,
      type: "longTerm",
      goal: "Lose 20 pounds",
      startDate: new Date("2023-01-01"),
      deadline: new Date("2023-12-30"),
    },
    {
      id: 2,
      type: "shortTerm",
      goal: "Run 5 miles per week",
      startDate: new Date("2023-03-01"),
      deadline: new Date("2024-04-30"),
    },
  ]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleEditClick = () => {
    setEditMode((prev) => !prev);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/users/615e1c8b0d3d8c9b3c9a7f6d",
        {
          goals: goals,
        }
      );
      setEditMode((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoalTextChange = (e, id, updatedGoalText) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, goal: updatedGoalText } : goal
      )
    );
  };

  const handleDateChange = (e, id, dateType, updatedDate) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, [dateType]: new Date(updatedDate) } : goal
      )
    );
  };

  const calculateProgress = (startDate, endDate) => {
    const currentDate = new Date();
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const elapsedDays = (currentDate - startDate) / (1000 * 60 * 60 * 24);
    let progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

    if (progress === 100) {
      return "Goal Complete";
    }

    return progress;
  };

  useEffect(() => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => ({
        ...goal,
        progress: calculateProgress(goal.startDate, goal.deadline),
      }))
    );
  }, []);

  return (
    <div className="user-goal">
      <div className="goal-edit-icon-container">
        {editMode ? (
          <button
            onClick={handleSaveClick}
            title="Save Info"
            className="goal-save-info-btn"
          >
            Save
          </button>
        ) : (
          <EditIcon
            onClick={handleEditClick}
            title="Edit Profile"
            className="goal-edit-icon"
          />
        )}
      </div>
      <div className="goal-header">
        <h2 className="goal-header-title">My Fitness Goals</h2>
        <p className="goal-subtitle">Stay Committed, Achieve Your Goals</p>
      </div>
      <div className="goal-content">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`goal ${
              goal.type === "longTerm" ? "goal-long-term" : "goal-short-term"
            }`}
          >
            <h3 className="goal-heading">
              {goal.type === "longTerm" ? "Long-Term Goal" : "Short-Term Goal"}
            </h3>
            <div>
              <p
                contentEditable={editMode}
                suppressContentEditableWarning={true}
                name="goal"
                onInput={(e) =>
                  handleGoalTextChange(goal.id, e.target.textContent)
                }
                className={`goal-text ${editMode && `goal-text-input`} `}
              >
                {goal.goal}
              </p>
              <div className="progress-bar">
                {typeof goal.progress === "number" ? (
                  <div
                    className="progress-fill"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                ) : (
                  <div className="progress-fill goal-complete">
                    {goal.progress}
                  </div>
                )}
                <div className="progress-dates">
                  {editMode ? (
                    <>
                      <input
                        type="date"
                        className="goal-date-input"
                        onChange={(e) =>
                          handleDateChange(goal.id, "startDate", e.target.value)
                        }
                        value={goal.startDate.toISOString().split("T")[0]}
                      />
                      <input
                        type="date"
                        className="goal-date-input"
                        onChange={(e) =>
                          handleDateChange(goal.id, "deadline", e.target.value)
                        }
                        value={goal.deadline.toISOString().split("T")[0]}
                      />
                    </>
                  ) : (
                    <>
                      <span className="goal-date">
                        {goal.startDate.getDate()}{" "}
                        {monthNames[goal.startDate.getMonth()]}
                      </span>
                      <span className="goal-date">
                        {goal.deadline.getDate()}{" "}
                        {monthNames[goal.deadline.getMonth()]}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalComponent;
