import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlagIcon from "@mui/icons-material/Flag";
import { errorPopUp } from "../helpers/errorPopUp";
import { fetchGoals, updateGoals } from "../api/goalApi";
import { toast } from "../helpers/errorPopUp";

// UI Primitives
import { Badge, Button } from "./ui";

const GoalComponent = () => {
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
        const data = await fetchGoals();

        if (data && data.length > 0) {
          const adjustedGoals = data.map((goal) => ({
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
      const payload = goals.map((g) => ({
        _id: g._id,
        goal: g.goal || "",
        type: g.type,
        startDate: g.startDate ? new Date(g.startDate).toISOString() : undefined,
        deadline: g.deadline ? new Date(g.deadline).toISOString() : undefined,
      }));
      const data = await updateGoals(payload);

      const adjustedGoals = (data || []).map((goal) => ({
        ...goal,
        startDate: goal.startDate ? new Date(goal.startDate).toISOString() : "",
        deadline: goal.deadline ? new Date(goal.deadline).toISOString() : "",
      }));

      setGoals(adjustedGoals);
      setEditMode(false);
      toast.success("Fitness goals updated successfully!");
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || "Something went wrong. Please try again later.";
      setErrorMessage(msg);
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
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();

    if (isNaN(start) || isNaN(end) || end <= start) {
      return 0;
    }

    const totalDuration = end - start;
    const elapsed = Math.max(0, now - start);
    const progressVal = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    return progressVal;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return "";
    const day = dateObj.getDate();
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="user-goal-premium">
      <div className="goal-header-premium">
        <div className="goal-header-top-row">
          <h2 className="goal-header-title">
            <FlagIcon className="header-icon" /> My Fitness Goals
          </h2>
          <div className="goal-edit-icon-container">
            {editMode ? (
              <Button
                variant="primary"
                size="sm"
                iconStart={<SaveIcon />}
                onClick={handleSaveClick}
                title="Save Goals"
              >
                Save Goals
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                iconStart={<EditIcon />}
                onClick={handleEditClick}
                title="Edit Goals"
              >
                Edit Goals
              </Button>
            )}
          </div>
        </div>
        <p className="goal-subtitle">Stay Committed, Achieve Your Goals</p>
      </div>

      <div className="goal-cards-grid">
        {goals?.map((goal) => {
          const type = goal?.type;
          const isLongTerm = type === "longTerm";
          const progressVal = typeof progress[type] === "number" ? progress[type] : 0;
          const progressPercent = Math.round(progressVal);
          const isDeadlinePassed = progressPercent >= 100;

          return (
            <div key={goal?._id} className={`goal-card-item ${isLongTerm ? "long-term" : "short-term"}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <Badge variant={isLongTerm ? "accent" : "primary"} size="sm">
                  {isLongTerm ? "Long-Term Goal" : "Short-Term Goal"}
                </Badge>
                {isDeadlinePassed && (
                  <Badge variant="warning" size="sm">
                    Deadline Passed
                  </Badge>
                )}
              </div>

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
                        className={`progress-bar-fill ${isDeadlinePassed ? "complete" : ""}`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="progress-label-row">
                      <span>{isDeadlinePassed ? "Timeline Ended" : "Timeline Elapsed"}</span>
                      <span>{progressPercent}%</span>
                    </div>
                  </div>

                  <div className={`goal-dates-row ${editMode ? "edit-active" : ""}`}>
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
