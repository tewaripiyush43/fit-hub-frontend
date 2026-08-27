import React from "react";
import PropTypes from "prop-types";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CalculateIcon from "@mui/icons-material/Calculate";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RemoveIcon from "@mui/icons-material/Remove";
import ActiveSetRow from "./ActiveSetRow";

const ActiveExerciseCard = ({
  exercise,
  sets,
  prevStats,
  weightUnit,
  weightStep,
  isNotesOpen,
  exerciseNotes,
  onToggleNotes,
  onNotesChange,
  onOpenPlateModal,
  onOpenSwapModal,
  onOpenLegendModal,
  onAdjustValue,
  onActiveSetChange,
  onToggleSetTag,
  onToggleSetCompleted,
  onAddActiveSet,
  onRemoveActiveSet,
}) => {
  const firstSetWeight = sets[0]?.weight ? Number(sets[0].weight) : 60;

  return (
    <div className="active-exercise-card">
      <div className="exercise-header">
        <div className="header-title-group">
          {exercise.gifUrl ? (
            <div className="workout-ex-thumb-wrapper">
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="workout-ex-thumb-img"
                loading="lazy"
              />
            </div>
          ) : (
            <FitnessCenterIcon className="ex-icon" />
          )}
          <div>
            <h3>{exercise.name}</h3>
            {prevStats && (
              <span className="previous-ghost-badge" title={`Recorded on ${prevStats.date}`}>
                📊 Last: <strong>{prevStats.weight} {weightUnit}</strong> × {prevStats.reps} reps
              </span>
            )}
          </div>
        </div>

        {/* Exercise Tools Quick Action Bar */}
        <div className="exercise-tools-bar">
          <button
            type="button"
            className="ex-tool-btn plate-calc-tool"
            onClick={() => onOpenPlateModal(firstSetWeight)}
            title="Open Barbell Plate Calculator"
          >
            <CalculateIcon style={{ fontSize: "1rem" }} />
            <span>Plates</span>
          </button>

          <button
            type="button"
            className="ex-tool-btn swap-tool"
            onClick={() => onOpenSwapModal(exercise)}
            title="Swap exercise if machine/equipment is busy"
          >
            <SwapHorizIcon style={{ fontSize: "1rem" }} />
            <span>Swap</span>
          </button>

          <button
            type="button"
            className={`ex-tool-btn notes-tool ${isNotesOpen ? "active" : ""}`}
            onClick={() => onToggleNotes(exercise._id)}
            title="Add seat/pin height or form cue"
          >
            <NoteAltIcon style={{ fontSize: "1rem" }} />
          </button>
        </div>
      </div>

      {/* Expandable Form Cue / Seat Notes */}
      {isNotesOpen && (
        <div className="exercise-notes-field">
          <input
            type="text"
            placeholder="Form cues or machine pin/seat height (e.g. Pin #4, wide grip)..."
            value={exerciseNotes[exercise._id] || ""}
            onChange={(e) => onNotesChange(exercise._id, e.target.value)}
          />
        </div>
      )}

      {/* Sets Table */}
      <div className="sets-table">
        <div className="table-header-row">
          <span
            className="col-num clickable-header-guide"
            onClick={onOpenLegendModal}
            title="Click to view Set Types & Tools Guide (N = Normal, W = Warmup, D = Drop Set, F = Failure)"
          >
            <span>SET</span>
            <HelpOutlineIcon className="header-info-icon" />
          </span>
          <span className="col-weight">Weight ({weightUnit})</span>
          <span className="col-reps">Reps</span>
          <span className="col-check">Done</span>
        </div>

        {sets.map((set, idx) => (
          <ActiveSetRow
            key={idx}
            exerciseId={exercise._id}
            setIndex={idx}
            set={set}
            weightUnit={weightUnit}
            weightStep={weightStep}
            onAdjustValue={onAdjustValue}
            onActiveSetChange={onActiveSetChange}
            onToggleSetTag={onToggleSetTag}
            onToggleSetCompleted={onToggleSetCompleted}
          />
        ))}
      </div>

      {/* Add / Remove Set Controls */}
      <div className="sets-row-controls">
        <button
          type="button"
          className="add-set-btn"
          onClick={() => onAddActiveSet(exercise._id)}
        >
          <AddTwoToneIcon style={{ fontSize: "1.1rem" }} /> Add Set
        </button>
        <button
          type="button"
          className="remove-set-btn"
          onClick={() => onRemoveActiveSet(exercise._id)}
        >
          <RemoveIcon style={{ fontSize: "1.1rem" }} /> Remove Set
        </button>
      </div>
    </div>
  );
};

ActiveExerciseCard.propTypes = {
  exercise: PropTypes.object.isRequired,
  sets: PropTypes.array.isRequired,
  prevStats: PropTypes.object,
  weightUnit: PropTypes.string.isRequired,
  weightStep: PropTypes.number.isRequired,
  isNotesOpen: PropTypes.bool,
  exerciseNotes: PropTypes.object.isRequired,
  onToggleNotes: PropTypes.func.isRequired,
  onNotesChange: PropTypes.func.isRequired,
  onOpenPlateModal: PropTypes.func.isRequired,
  onOpenSwapModal: PropTypes.func.isRequired,
  onOpenLegendModal: PropTypes.func.isRequired,
  onAdjustValue: PropTypes.func.isRequired,
  onActiveSetChange: PropTypes.func.isRequired,
  onToggleSetTag: PropTypes.func.isRequired,
  onToggleSetCompleted: PropTypes.func.isRequired,
  onAddActiveSet: PropTypes.func.isRequired,
  onRemoveActiveSet: PropTypes.func.isRequired,
};

export default React.memo(ActiveExerciseCard);
