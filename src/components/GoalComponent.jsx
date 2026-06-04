import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlagIcon from "@mui/icons-material/Flag";
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

        if (res.data && res.data.length > 0) {
          const adjustedGoals = res.data.map((goal) => ({
            ...goal,
            startDate: new Date(goal.startDate).toISOString(),
            deadline: new Date(goal.deadline).toISOString(),
          }));
          setGoals(adjustedGoals);
        }
      } catch (err) {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    };
    fetchUserGoals();
  }, []);

  useEffect(() => {
    if (goals && goals.length >= 2) {
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
    }
  }, [goals]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
    let progressVal = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

    if (progressVal === 100) {
      return "Goal Complete";
    }

    return progressVal;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="user-goal-premium">
      <div className="goal-edit-icon-container">
        {editMode ? (
          <button onClick={handleSaveClick} title="Save Goals" className="goal-save-info-btn">
            <SaveIcon style={{ fontSize: "1.1rem" }} /> Save
          </button>
        ) : (
          <EditIcon onClick={handleEditClick} title="Edit Goals" className="goal-edit-icon" />
        )}
      </div>

      <div className="goal-header-premium">
        <h2 className="goal-header-title">
          <FlagIcon className="header-icon" /> My Fitness Goals
        </h2>
        <p className="goal-subtitle">Stay Committed, Achieve Your Goals</p>
      </div>

      <div className="goal-cards-grid">
        {goals?.map((goal) => {
          const type = goal?.type;
          const isLongTerm = type === "longTerm";
          const progressVal = progress[type];
          const isComplete = progressVal === "Goal Complete" || progressVal >= 100;
          const progressPercent = typeof progressVal === "number" ? Math.round(progressVal) : 100;

          return (
            <div key={goal?._id} className={`goal-card-item ${isLongTerm ? "long-term" : "short-term"}`}>
              <h3 className="goal-card-label">
                {isLongTerm ? "Long-Term Goal" : "Short-Term Goal"}
              </h3>

              <div className="goal-body">
                {editMode ? (
                  <input
                    type="text"
                    onChange={(e) => handleGoalTextChange(e, goal?._id)}
                    value={goal?.goal || ""}
                    placeholder="Set a goal description..."
                    className="goal-input-field"
                  />
                ) : (
                  <h4 className="goal-text-display">
                    {goal?.goal?.length > 0 ? goal?.goal : "Set your goal"}
                  </h4>
                )}

                <div className="goal-progress-section">
                  <div className="progress-bar-container">
                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-fill ${isComplete ? "complete" : ""}`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="progress-label-row">
                      <span>{isComplete ? "Goal Achieved!" : "Time Progress"}</span>
                      <span>{progressPercent}%</span>
                    </div>
                  </div>

                  <div className="goal-dates-row">
                    <div className="date-block">
                      <CalendarMonthIcon className="date-icon" />
                      {editMode ? (
                        <div className="date-input-wrap">
                          <span className="date-label">Start:</span>
                          <input
                            type="date"
                            className="goal-date-input"
                            name="startDate"
                            onChange={(e) => handleDateChange(e, goal?._id)}
                            value={goal?.startDate?.split("T")[0] || ""}
                          />
                        </div>
                      ) : (
                        <div className="date-text-wrap">
                          <span className="date-label">Start:</span>
                          <span className="date-value">{formatDate(goal?.startDate)}</span>
                        </div>
                      )}
                    </div>

                    <div className="date-block align-right">
                      <CalendarMonthIcon className="date-icon" />
                      {editMode ? (
                        <div className="date-input-wrap">
                          <span className="date-label">End:</span>
                          <input
                            type="date"
                            className="goal-date-input"
                            name="deadline"
                            min={goal?.startDate?.split("T")[0] || ""}
                            onChange={(e) => handleDateChange(e, goal?._id)}
                            value={goal?.deadline?.split("T")[0] || ""}
                          />
                        </div>
                      ) : (
                        <div className="date-text-wrap">
                          <span className="date-label">Deadline:</span>
                          <span className="date-value">{formatDate(goal?.deadline)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalComponent;
