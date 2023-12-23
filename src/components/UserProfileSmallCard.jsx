import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const UserProfileSmallCard = () => {
  const initialPRs = [
    { exercise: "Deadlift", maxWeight: "300 lbs" },
    { exercise: "Bench Press", maxWeight: "250 lbs" },
    { exercise: "Squat", maxWeight: "350 lbs" },
  ];

  const [prs, setPRs] = useState(initialPRs);
  const [editIndex, setEditIndex] = useState(null);

  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  const handleSaveClick = (index) => {
    setEditIndex(null);
  };

  const handleInputChange = (e, index) => {
    const updatedPRs = [...prs];
    updatedPRs[index].maxWeight = e.target.value;
    setPRs(updatedPRs);
  };

  return (
    <div className="user-pr-card">
      <div className="card-header">
        <h2>Your Fitness Achievements</h2>
        <p>Explore your personal records in style!</p>
      </div>
      <div className="pr-list">
        {prs?.map((pr, index) => (
          <div className="pr-item" key={index}>
            <h3>{pr?.exercise}</h3>
            {editIndex === index ? (
              <div className="edit-save-container">
                <input
                  className="edit-input"
                  type="text"
                  value={pr?.maxWeight}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <button
                  className="save-button"
                  onClick={() => handleSaveClick(index)}
                >
                  <SaveIcon />
                </button>
              </div>
            ) : (
              <div>
                <p>Max Weight: {pr?.maxWeight}</p>
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(index)}
                >
                  <EditIcon />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfileSmallCard;
