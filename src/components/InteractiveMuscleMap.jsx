import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DETAILED_MUSCLES_LIST,
  calculateGranularMuscleRecovery,
  playGymTimerChime,
} from "../utils/gymExperienceUtils";
import AnatomyFrontSVG from "./AnatomyFrontSVG";
import AnatomyBackSVG from "./AnatomyBackSVG";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import BoltIcon from "@mui/icons-material/Bolt";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import "../styles/_interactiveMuscleMap.scss";

const POSTERIOR_MUSCLES = new Set([
  "traps",
  "lats",
  "rear_delts",
  "triceps",
  "lower_back",
  "glutes",
  "hamstrings",
]);

const MUSCLE_EXERCISE_SUGGESTIONS = {
  chest: ["Barbell Bench Press", "Incline Dumbbell Press", "Parallel Dips", "Cable Pec Flyes"],
  shoulders: ["Overhead Military Press", "Dumbbell Lateral Raises", "Arnold Press", "Face Pulls"],
  biceps: ["Barbell Bicep Curl", "Incline Dumbbell Curl", "Hammer Curls", "Preacher Curl"],
  forearms: ["Reverse Barbell Curls", "Wrist Curls", "Farmer's Walks", "Dead Hangs"],
  abs: ["Hanging Leg Raises", "Cable Woodchoppers", "Ab Wheel Rollouts", "Weighted Planks"],
  obliques: ["Russian Twists", "Side Planks", "Bicycle Crunches", "Landmine Rotations"],
  quads: ["Barbell Back Squat", "Leg Press", "Bulgarian Split Squats", "Leg Extensions"],
  calves: ["Standing Calf Raises", "Seated Calf Raises", "Donkey Calf Raises", "Tibialis Toe Raises"],
  traps: ["Barbell Shrugs", "Dumbbell Shrugs", "Rack Pulls", "Farmer's Walks"],
  lats: ["Lat Pulldowns", "Weighted Pull-ups", "Barbell Bent-Over Row", "Seated Cable Row"],
  rear_delts: ["Face Pulls", "Rear Delt Flyes", "Reverse Pec Deck", "Band Pull-Aparts"],
  triceps: ["Skull Crushers", "Tricep Rope Pushdowns", "Close-Grip Bench Press", "Dips"],
  lower_back: ["Conventional Deadlift", "Hyperextensions", "Good Mornings", "Superman Holds"],
  glutes: ["Barbell Hip Thrust", "Romanian Deadlift (RDL)", "Sumo Squats", "Cable Kickbacks"],
  hamstrings: ["Lying Leg Curls", "Romanian Deadlift", "Nordic Hamstring Curls", "Seated Leg Curl"],
};

const EQUIPMENT_OPTIONS = [
  { id: "all", label: "Featured" },
  { id: "barbell", label: "Barbell" },
  { id: "dumbbell", label: "Dumbbells" },
  { id: "machine", label: "Machine" },
  { id: "body weight", label: "Bodyweight" },
  { id: "cable", label: "Cables" },
  { id: "band", label: "Band" },
  { id: "kettlebell", label: "Kettlebells" },
];

const InteractiveMuscleMap = ({
  selectedMuscleId = null,
  onSelectMuscle = null,
  mode = "filter", // 'filter' or 'recovery'
  showQuickChips = true,
  title = "Muscle Anatomy Explorer",
  subtitle = "Click any muscle on the 2D anatomical mannequin to explore biomechanics and exercises",
  compact = false,
  onLaunchAICoach = null,
}) => {
  const navigate = useNavigate();
  const [view, setView] = useState("both"); // 'both', 'front', 'back'
  const [hoveredMuscleId, setHoveredMuscleId] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState("all");

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && view === "both") {
        setView("front");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [view]);

  const user = useSelector((state) => state.auth.user);

  // Granular recovery calculation based on user's real workout logs
  const recoveryData = useMemo(() => {
    const sessionHistory = user?.sessionHistory || [];
    return calculateGranularMuscleRecovery(sessionHistory);
  }, [user?.sessionHistory]);

  const recoveryMap = useMemo(() => {
    const map = {};
    recoveryData.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [recoveryData]);

  // Currently active muscle details: Selection takes strict priority over hover
  const activeMuscleId = selectedMuscleId || hoveredMuscleId || "chest";
  const activeMuscle =
    recoveryMap[activeMuscleId] ||
    DETAILED_MUSCLES_LIST.find((m) => m.id === activeMuscleId) ||
    DETAILED_MUSCLES_LIST[0];

  const selectedEquipmentObj = useMemo(
    () => EQUIPMENT_OPTIONS.find((e) => e.id === selectedEquipment) || EQUIPMENT_OPTIONS[0],
    [selectedEquipment]
  );

  const searchButtonLabel = useMemo(() => {
    if (selectedEquipment && selectedEquipment !== "all") {
      return `View ${selectedEquipmentObj.label} ${activeMuscle.label} Exercises`;
    }
    return `View ${activeMuscle.label} Exercises`;
  }, [selectedEquipment, selectedEquipmentObj, activeMuscle.label]);

  // Effective view: Never allow 'both' on mobile viewports
  const effectiveView = useMemo(() => {
    if (isMobile) {
      if (view === "both") {
        return POSTERIOR_MUSCLES.has(activeMuscleId) ? "back" : "front";
      }
      return view;
    }
    return view;
  }, [isMobile, view, activeMuscleId]);

  const handleMuscleClick = (muscleId, searchKey) => {
    playGymTimerChime();
    setHoveredMuscleId(null);
    if (isMobile && muscleId) {
      if (POSTERIOR_MUSCLES.has(muscleId)) {
        setView("back");
      } else {
        setView("front");
      }
    }
    if (onSelectMuscle) {
      if (selectedMuscleId === muscleId) {
        onSelectMuscle(null, "");
      } else {
        onSelectMuscle(muscleId, searchKey || muscleId);
      }
    }
  };

  const handleExploreExercises = (searchKey) => {
    playGymTimerChime();
    const muscleQuery = searchKey || activeMuscle.searchKey || activeMuscle.id;
    if (onSelectMuscle) {
      onSelectMuscle(activeMuscle.id, muscleQuery);
    }
    const fullQuery =
      selectedEquipment && selectedEquipment !== "all"
        ? `${selectedEquipment} ${muscleQuery}`
        : muscleQuery;
    const equipParam =
      selectedEquipment !== "all" ? `&equipment=${encodeURIComponent(selectedEquipment)}` : "";
    navigate(`/exercises?target=${encodeURIComponent(muscleQuery)}${equipParam}&search=${encodeURIComponent(fullQuery)}`);
  };

  const getMuscleStatusClass = (muscleId) => {
    if (mode !== "recovery") return "";
    const data = recoveryMap[muscleId];
    return data ? `status-${data.status}` : "status-ready";
  };

  const exerciseSuggestions =
    MUSCLE_EXERCISE_SUGGESTIONS[activeMuscle.id] ||
    MUSCLE_EXERCISE_SUGGESTIONS[activeMuscle.searchKey] || [
      "Compound Movements",
      "Isolation Exercises",
    ];

  return (
    <div className={`interactive-muscle-map-widget ${compact ? "compact-mode" : ""}`}>
      {/* Header Bar */}
      <div className="map-header">
        <div className="header-info">
          <div className="header-icon-badge">
            <AccessibilityNewIcon />
          </div>
          <div className="title-text">
            <h3>
              {title}
              <span className="badge-beta">2D Anatomy</span>
            </h3>
            <p>{subtitle}</p>
          </div>
        </div>

        <div className="map-controls">
          {/* View Switcher: Dual View (Desktop Only), Front, Back */}
          <div className="view-toggle-pill">
            {!isMobile && (
              <button
                type="button"
                className={`btn-dual-view ${effectiveView === "both" ? "active" : ""}`}
                onClick={() => setView("both")}
              >
                Dual View
              </button>
            )}
            <button
              type="button"
              className={effectiveView === "front" ? "active" : ""}
              onClick={() => setView("front")}
            >
              Anterior (Front)
            </button>
            <button
              type="button"
              className={effectiveView === "back" ? "active" : ""}
              onClick={() => setView("back")}
            >
              Posterior (Back)
            </button>
          </div>

          {selectedMuscleId && onSelectMuscle && (
            <button
              type="button"
              className="btn-clear-selection"
              onClick={() => onSelectMuscle(null, "")}
              title="Clear muscle filter"
            >
              <RestartAltIcon style={{ fontSize: "0.95rem" }} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div
        className="map-workspace"
        style={{
          display: "grid",
          gridTemplateColumns: effectiveView === "both" ? "minmax(300px, 600px) 1fr" : "minmax(280px, 380px) 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Anatomical SVG Mannequin (FitHub Vector Model) */}
        <div
          className="mannequin-container"
          style={{
            maxWidth: effectiveView === "both" ? "620px" : "380px",
            minHeight: isMobile ? "360px" : "520px",
            display: "flex",
            gap: "1.25rem",
            justifyContent: "center",
            alignItems: "center",
            background: "radial-gradient(circle at 50% 40%, rgba(30, 41, 59, 0.45) 0%, rgba(10, 15, 26, 0.95) 80%)",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: isMobile ? "1rem 0.5rem" : "1.5rem 1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="body-scanner-line" />

          {/* ─── ANTERIOR (FRONT) BODY ─── */}
          {(effectiveView === "both" || effectiveView === "front") && (
            <div style={{ flex: "1 1 260px", maxWidth: "290px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                Anterior (Front)
              </span>
              <AnatomyFrontSVG
                selectedMuscleId={selectedMuscleId}
                hoveredMuscleId={hoveredMuscleId}
                onSelectMuscle={(id) => handleMuscleClick(id, id)}
                onHoverMuscle={(id) => setHoveredMuscleId(id)}
                getMuscleStatusClass={getMuscleStatusClass}
              />
            </div>
          )}

          {/* ─── POSTERIOR (BACK) BODY ─── */}
          {(effectiveView === "both" || effectiveView === "back") && (
            <div style={{ flex: "1 1 260px", maxWidth: "290px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                Posterior (Back)
              </span>
              <AnatomyBackSVG
                selectedMuscleId={selectedMuscleId}
                hoveredMuscleId={hoveredMuscleId}
                onSelectMuscle={(id) => handleMuscleClick(id, id)}
                onHoverMuscle={(id) => setHoveredMuscleId(id)}
                getMuscleStatusClass={getMuscleStatusClass}
              />
            </div>
          )}
        </div>

        {/* Right Details Panel: Equipment Filters & Muscle Summary */}
        <div className="muscle-details-panel">
          {/* Active / Focused Muscle Card */}
          <div className="active-muscle-card">
            <div className="card-header-row">
              <div className="name-and-tag">
                <span className="emoji-avatar">{activeMuscle.emoji || "⚡"}</span>
                <div className="title-grp">
                  <h4>{activeMuscle.label}</h4>
                  <span className="latin-name">{activeMuscle.anatomicalName}</span>
                </div>
              </div>

              {mode === "recovery" && (
                <span className={`status-badge ${activeMuscle.status || "ready"}`}>
                  {activeMuscle.status === "fatigued" && <><WhatshotIcon style={{ fontSize: "0.85rem" }} /> Fatigued</>}
                  {activeMuscle.status === "recovering" && <><BoltIcon style={{ fontSize: "0.85rem" }} /> Recovering</>}
                  {(!activeMuscle.status || activeMuscle.status === "ready") && <><CheckCircleIcon style={{ fontSize: "0.85rem" }} /> Ready</>}
                </span>
              )}
            </div>

            {/* Sleek Equipment Filter Bar */}
            <div className="equipment-filter-block">
              <span className="filter-label">Filter Equipment</span>
              <div className="equip-chips-row">
                {EQUIPMENT_OPTIONS.map((equip) => (
                  <button
                    key={equip.id}
                    type="button"
                    className={`equip-chip-btn ${selectedEquipment === equip.id ? "active" : ""}`}
                    onClick={() => setSelectedEquipment(equip.id)}
                  >
                    {equip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Target Exercises List */}
            <div className="recommended-exercises-preview">
              <div className="preview-heading">
                <FitnessCenterIcon style={{ fontSize: "0.85rem", color: "var(--accent, #00e5ff)" }} />
                <span>Prime Target Movements:</span>
              </div>
              <div className="preview-tags-row">
                {exerciseSuggestions.slice(0, 4).map((exName, idx) => (
                  <span key={idx} className="preview-ex-tag">
                    {exName}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Row */}
            <div className="action-row">
              <button
                type="button"
                className="btn-filter-action"
                onClick={() => handleExploreExercises(activeMuscle.searchKey || activeMuscle.id)}
              >
                <SearchIcon style={{ fontSize: "1rem" }} />
                <span>{searchButtonLabel}</span>
              </button>

              {onLaunchAICoach && (
                <button
                  type="button"
                  className="btn-ai-advice"
                  onClick={() => onLaunchAICoach(activeMuscle)}
                >
                  <AutoAwesomeIcon style={{ fontSize: "0.95rem" }} />
                  <span>AI Coach</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Target Muscle Chips */}
          {showQuickChips && (
            <div className="muscle-chips-selector">
              <h5>Quick Muscle Switcher</h5>
              <div className="chips-container">
                {DETAILED_MUSCLES_LIST.map((muscle) => {
                  const data = recoveryMap[muscle.id] || muscle;
                  const isSelected = selectedMuscleId === muscle.id;
                  return (
                    <button
                      key={muscle.id}
                      type="button"
                      className={`muscle-chip-btn ${isSelected ? "selected" : ""} ${data.status || ""}`}
                      onClick={() => handleMuscleClick(muscle.id, muscle.searchKey)}
                    >
                      <span className="chip-emoji">{muscle.emoji}</span>
                      <span className="chip-text">{muscle.label}</span>
                      {mode === "recovery" && data.recoveryPercent !== undefined && (
                        <span className="chip-pct">{data.recoveryPercent}%</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMuscleMap;
