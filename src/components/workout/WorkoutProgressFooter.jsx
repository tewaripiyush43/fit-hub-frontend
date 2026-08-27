import React from "react";
import PropTypes from "prop-types";

const WorkoutProgressFooter = ({
  completedSetsCount,
  totalSetsCount,
  progressPercent,
}) => {
  return (
    <div className="active-progress-footer" role="region" aria-label="Session Progress Footer">
      <div className="progress-text-row">
        <span>Overall Session Progress</span>
        <span>
          {progressPercent}% ({completedSetsCount} / {totalSetsCount} sets completed)
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

WorkoutProgressFooter.propTypes = {
  completedSetsCount: PropTypes.number.isRequired,
  totalSetsCount: PropTypes.number.isRequired,
  progressPercent: PropTypes.number.isRequired,
};

export default React.memo(WorkoutProgressFooter);
