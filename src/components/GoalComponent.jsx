import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { errorPopUp } from "../helpers/errorPopUp";

const GoalComponent = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [progress, setProgress] = useState({
    longTerm: 0,
    shortTerm: 0,
  });
  const [goals, setGoals] = useState([
    {
      _id: 1,
      type: "longTerm",
      goal: "",
      startDate: new Date().toISOString(),
      deadline: new Date().toISOString(),
    },
    {
      _id: 2,
      type: "shortTerm",
      goal: "",
      startDate: new Date().toISOString(),
      deadline: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    if (errorMessage.length > 0) {
      // console.log(errorMessage);
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  useEffect(() => {
    const fetchUserGoals = async () => {
      try {
        const accessToken = localStorage.accessToken;
        if (!accessToken) throw new Error("Access token not found");

        const res = await axios.get(`${REACT_APP_BASE_URL}/goal/`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        });

        const adjustedGoals = res.data.map((goal) => ({
          ...goal,
          startDate: new Date(goal.startDate).toISOString(),
          deadline: new Date(goal.deadline).toISOString(),
        }));

        setGoals(adjustedGoals);
        // console.log(res.data);
      } catch (err) {
        // console.log(err);
        setErrorMessage("Something went wrong. Please try again later.");
      }
    };
    fetchUserGoals();
  }, []);

  useEffect(() => {
    // console.log(goals);
    const longTermProgress = calculateProgress(
      new Date(goals[0].startDate),
      new Date(goals[0].deadline)
    );
    const shortTermProgress = calculateProgress(
      new Date(goals[1].startDate),
      new Date(goals[1].deadline)
    );

    setProgress({
      longTerm: longTermProgress,
      shortTerm: shortTermProgress,
    });
  }, [goals]);

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
      const accessToken = localStorage.accessToken;
      if (!accessToken) throw new Error("Access token not found");

      const res = await axios.put(
        `${REACT_APP_BASE_URL}/goal/updateGoals`,
        goals,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const adjustedGoals = res.data.map((goal) => ({
        ...goal,
        startDate: new Date(goal.startDate).toISOString(),
        deadline: new Date(goal.deadline).toISOString(),
      }));

      setGoals(adjustedGoals);
      setEditMode((prev) => !prev);
    } catch (err) {
      // console.log(err);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  const handleGoalTextChange = (e, goalId) => {
    const { value } = e.target;
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === goalId ? { ...goal, goal: value } : goal
      )
    );
  };

  const handleDateChange = (e, goalId) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === goalId ? { ...goal, [name]: value } : goal
      )
    );
  };

  const calculateProgress = (startDate, endDate) => {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const currentDate = new Date();
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const elapsedDays = (currentDate - startDate) / (1000 * 60 * 60 * 24);
    let progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

    if (progress === 100) {
      return "Goal Complete";
    }

    return progress;
  };

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
        {goals?.map((goal) => (
          <div
            key={goal?._id}
            className={`goal ${
              goal?.type === "longTerm" ? "goal-long-term" : "goal-short-term"
            }`}
          >
            <h3 className="goal-heading">
              {goal?.type === "longTerm" ? "Long-Term Goal" : "Short-Term Goal"}
            </h3>
            <div>
              {editMode ? (
                <input
                  type="text"
                  name="goal"
                  onChange={(e) => handleGoalTextChange(e, goal?._id)}
                  value={goal?.goal}
                  className="goal-input"
                />
              ) : (
                <p className="goal-text">
                  {goal?.goal?.length === 0 ? "UNTITLED" : goal?.goal}
                </p>
              )}
              <div className="progress-bar">
                {typeof progress[goal?.type] === "number" ? (
                  <div
                    className="progress-fill"
                    style={{ width: `${progress[goal?.type]}%` }}
                  ></div>
                ) : (
                  <div className="progress-fill goal-complete">
                    {calculateProgress(
                      new Date(goal?.startDate),
                      new Date(goal?.deadline)
                    )}
                  </div>
                )}
                <div className="progress-dates">
                  {editMode ? (
                    <>
                      <input
                        type="date"
                        className="goal-date-input"
                        name="startDate"
                        onChange={(e) => handleDateChange(e, goal?._id)}
                        value={goal?.startDate?.split("T")[0]}
                      />
                      <input
                        type="date"
                        className="goal-date-input"
                        name="deadline"
                        min={goal?.startDate?.split("T")[0]}
                        onChange={(e) => handleDateChange(e, goal._id)}
                        value={goal?.deadline?.split("T")[0]}
                      />
                    </>
                  ) : (
                    <>
                      <span className="goal-date">
                        {goal?.startDate?.split("T")[0].split("-")[2]}{" "}
                        {
                          monthNames[
                            goal?.startDate?.split("T")[0].split("-")[1] - 1
                          ]
                        }
                      </span>
                      <span className="goal-date">
                        {goal?.deadline?.split("T")[0].split("-")[2]}{" "}
                        {
                          monthNames[
                            goal?.deadline?.split("T")[0].split("-")[1] - 1
                          ]
                        }
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
