import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InteractiveMuscleMap from "../components/InteractiveMuscleMap";
import {
  DETAILED_MUSCLES_LIST,
  WARMUP_ROUTINES_BY_MUSCLE,
  COOLDOWN_STRETCHES_BY_MUSCLE,
  calculateGranularMuscleRecovery,
  playGymTimerChime,
} from "../utils/gymExperienceUtils";
import { fetchAIMuscleCoachAnalysis, generateAIWorkout } from "../api/workoutApi";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltIcon from "@mui/icons-material/Bolt";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "../helpers/errorPopUp";
import { portalActions } from "../store/index";
import "../styles/_interactiveMuscleMap.scss";

// UI Primitives
import { Badge, Button } from "../components/ui";

const ANATOMY_KNOWLEDGE_BASE = {
  chest: {
    function: "Horizontal adduction, shoulder flexion, and medial rotation of the humerus.",
    bestCompounds: ["Barbell Bench Press", "Incline Dumbbell Press", "Parallel Bar Dips"],
    bestIsolations: ["Cable Chest Flyes", "Pec Deck Flyes", "Incline Cable Flyes"],
    formCues: "Keep scapulae retracted and depressed. Avoid excessive elbow flare beyond 75 degrees.",
  },
  shoulders: {
    function: "Abduction, forward flexion, and external/internal rotation of the upper arm.",
    bestCompounds: ["Standing Overhead Press", "Seated Dumbbell Press", "Arnold Press"],
    bestIsolations: ["Dumbbell Lateral Raises", "Cable Lateral Raises", "Face Pulls"],
    formCues: "Raise in the scapular plane (30° anterior to frontal plane) to prevent subacromial impingement.",
  },
  biceps: {
    function: "Elbow flexion and forearm supination.",
    bestCompounds: ["Underhand Chin-ups", "Supinated Barbell Rows"],
    bestIsolations: ["Incline Dumbbell Curls", "Preacher Curls", "Hammer Curls"],
    formCues: "Keep elbows pinned to your sides; initiate with forearm supination for peak contraction.",
  },
  triceps: {
    function: "Elbow extension and shoulder extension (Long Head).",
    bestCompounds: ["Close-Grip Bench Press", "Parallel Bar Dips", "Overhead Tricep Extension"],
    bestIsolations: ["Tricep Rope Pushdowns", "Skull Crushers", "Cable Kickbacks"],
    formCues: "Lock elbows in space and achieve full terminal extension for peak tricep contraction.",
  },
  forearms: {
    function: "Grip strength, wrist flexion/extension, and radial/ulnar deviation.",
    bestCompounds: ["Heavy Deadlifts", "Farmer's Walks", "Pull-ups"],
    bestIsolations: ["Barbell Wrist Curls", "Reverse Grip Curls", "Wrist Roller"],
    formCues: "Train both flexors (underside) and extensors (top) for balanced wrist joint integrity.",
  },
  abs: {
    function: "Spinal flexion, anti-extension, anti-rotation, and intra-abdominal pressure stabilization.",
    bestCompounds: ["Heavy Squats", "Standing Overhead Press", "Deadlifts"],
    bestIsolations: ["Hanging Leg Raises", "Cable Woodchoppers", "Ab Wheel Rollouts"],
    formCues: "Exhale fully and curl the pelvis toward the ribcage rather than pulling with hip flexors.",
  },
  obliques: {
    function: "Lateral trunk flexion, rotational power, and lateral core bracing.",
    bestCompounds: ["Suitcase Carries", "Landmine Rotations"],
    bestIsolations: ["Russian Twists", "Side Planks", "Cable Rotational Chops"],
    formCues: "Focus on controlled rotational torque through the core, not jerky spinal twisting.",
  },
  quads: {
    function: "Knee extension and hip flexion (via Rectus Femoris).",
    bestCompounds: ["Barbell Back Squats", "Front Squats", "Bulgarian Split Squats", "Leg Press"],
    bestIsolations: ["Leg Extensions", "Sissy Squats", "Spanish Squats"],
    formCues: "Track knees in line with second toes; achieve full knee flexion for maximum quadriceps stretch.",
  },
  calves: {
    function: "Plantar flexion of the ankle and knee joint stabilization.",
    bestCompounds: ["Standing Calf Raises (Gastrocnemius)", "Seated Calf Raises (Soleus)"],
    bestIsolations: ["Single-Leg Dumbbell Calf Raises", "Tibialis Toe Raises"],
    formCues: "Pause for 2 full seconds at the bottom stretch to eliminate the elastic Achilles tendon rebound.",
  },
  traps: {
    function: "Scapular elevation, retraction, upward rotation, and cervical support.",
    bestCompounds: ["Heavy Deadlifts", "Barbell Shrugs", "Rack Pulls", "Farmer's Walks"],
    bestIsolations: ["Dumbbell Kelso Shrugs", "Prone Trap-3 Raises", "Face Pulls with External Rotation"],
    formCues: "Shrug slightly up and back toward the ears; avoid rolling shoulders forward.",
  },
  lats: {
    function: "Shoulder adduction, extension, and horizontal abduction.",
    bestCompounds: ["Weighted Pull-ups", "Barbell Bent-Over Rows", "Lat Pulldowns"],
    bestIsolations: ["Straight-Arm Cable Pushdowns", "Single-Arm Dumbbell Row", "Kayak Rows"],
    formCues: "Drive elbows down and back toward your hip pockets rather than pulling with your arms.",
  },
  rear_delts: {
    function: "Horizontal abduction and external rotation of the humerus.",
    bestCompounds: ["Chest-Supported Rows", "Inverted Rows"],
    bestIsolations: ["Face Pulls", "Rear Delt Flyes", "Cable Reverse Flyes"],
    formCues: "Keep wrists relaxed and lead with elbows pulled wide at 90 degrees to torso.",
  },
  lower_back: {
    function: "Spinal extension, posture maintenance, and anti-flexion stabilization.",
    bestCompounds: ["Conventional Deadlift", "Barbell Good Mornings", "Hyperextensions"],
    bestIsolations: ["Back Extensions", "Bird-Dogs", "Superman Holds"],
    formCues: "Maintain neutral lumbar spine throughout all pulling and hinging movements.",
  },
  glutes: {
    function: "Hip extension, hyperextension, abduction, and external rotation.",
    bestCompounds: ["Barbell Hip Thrusts", "Romanian Deadlifts (RDL)", "Sumo Deadlifts", "Walking Lunges"],
    bestIsolations: ["Cable Glute Kickbacks", "Abductor Machine", "Frog Pumps"],
    formCues: "Drive through heels and achieve full posterior pelvic tilt at top of hip extension.",
  },
  hamstrings: {
    function: "Knee flexion and hip extension.",
    bestCompounds: ["Romanian Deadlift (RDL)", "Good Mornings", "Sumo Squats"],
    bestIsolations: ["Lying Leg Curls", "Seated Leg Curls", "Nordic Hamstring Curls"],
    formCues: "Initiate hip hinges with hips pushing back; maintain soft knee bend on deadlifts.",
  },
};

const AnatomyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const targetParam = queryParams.get("target");

  const [selectedMuscleId, setSelectedMuscleId] = useState(targetParam ? targetParam.toLowerCase() : "chest");
  const [mapMode, setMapMode] = useState("filter");
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [generatingRoutine, setGeneratingRoutine] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const sessionHistory = user?.sessionHistory || [];
  const recoveryList = calculateGranularMuscleRecovery(sessionHistory);
  const currentRecovery = recoveryList.find((m) => m.id === selectedMuscleId) || { recoveryPercent: 100, status: "ready" };

  useEffect(() => {
    if (targetParam) {
      setSelectedMuscleId(targetParam.toLowerCase());
    }
  }, [targetParam]);

  const activeMuscle = DETAILED_MUSCLES_LIST.find((m) => m.id === selectedMuscleId) || DETAILED_MUSCLES_LIST[0];
  const knowledge = ANATOMY_KNOWLEDGE_BASE[activeMuscle.id] || ANATOMY_KNOWLEDGE_BASE[activeMuscle.searchKey] || ANATOMY_KNOWLEDGE_BASE.chest;
  
  const warmupRoutine = WARMUP_ROUTINES_BY_MUSCLE[activeMuscle.id] || WARMUP_ROUTINES_BY_MUSCLE[activeMuscle.searchKey] || WARMUP_ROUTINES_BY_MUSCLE.default || [];
  const cooldownStretches = COOLDOWN_STRETCHES_BY_MUSCLE[activeMuscle.id] || COOLDOWN_STRETCHES_BY_MUSCLE[activeMuscle.searchKey] || COOLDOWN_STRETCHES_BY_MUSCLE.default || [];

  const handleSelectMuscle = (muscleId) => {
    setSelectedMuscleId(muscleId || "chest");
    setAiAnalysis(null);
  };

  const handleNavigateExercises = () => {
    const query = activeMuscle.searchKey || activeMuscle.id;
    navigate(`/exercises?target=${encodeURIComponent(query)}`);
  };

  const handleConsultAICoach = async () => {
    if (!user) {
      dispatch(portalActions.setPortalOpen());
      dispatch(portalActions.setPortalTypeLogin());
      toast.info("Please log in to consult your personalized AI Biomechanics Coach.");
      return;
    }
    playGymTimerChime();
    const instantPreview = {
      verdict: `${activeMuscle.label} (${activeMuscle.anatomicalName}) is primed at ${currentRecovery.recoveryPercent}% recovery readiness. Focus on high mechanical tension and full active range of motion.`,
      activationCue: knowledge.formCues || "Initiate each rep by bracing core and actively squeezing the muscle at full peak contraction.",
      repScheme: "3-4 sets of 8-12 reps @ 1-2 RIR (Reps in Reserve)",
      injuryPrevention: "Maintain controlled 3-second eccentric tempo to protect tendons and avoid aggressive joint lockouts.",
      targetExercises: knowledge.bestCompounds?.slice(0, 3) || ["Compound Anchor Movement", "Stretch-Focused Isolation"],
    };
    setAiAnalysis(instantPreview);
    setAiLoading(true);

    try {
      const data = await fetchAIMuscleCoachAnalysis({
        muscle: `${activeMuscle.label} (${activeMuscle.anatomicalName})`,
        recoveryPercent: currentRecovery.recoveryPercent,
        userLevel: user?.profile?.fitnessLevel || "intermediate",
        userGoal: user?.goals?.[0]?.goalType || "hypertrophy",
      });
      if (data) {
        setAiAnalysis(data);
      }
      toast.success(`AI Biomechanics Coach analysis ready for ${activeMuscle.label}!`);
    } catch (err) {
      console.warn("Using instant coach analysis fallback:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateAIMuscleRoutine = async () => {
    if (!user) {
      dispatch(portalActions.setPortalOpen());
      dispatch(portalActions.setPortalTypeLogin());
      toast.info("Please log in to generate and save custom AI routines.");
      return;
    }
    playGymTimerChime();
    setGeneratingRoutine(true);
    try {
      const result = await generateAIWorkout(dispatch, {
        target: activeMuscle.label,
        difficulty: user?.profile?.fitnessLevel || "intermediate",
        duration: "45",
        intensity: "high",
        equipment: "Full Gym",
        specialFocus: "Hypertrophy & Progressive Overload",
        prompt: `Focused hypertrophy targeting ${activeMuscle.label} with biomechanically sound exercise sequencing.`,
      });

      if (result?.workoutId) {
        toast.success(`AI Workout "${result.workoutName}" created!`);
        navigate(`/${user.username}/myworkouts/${result.workoutId}`);
      }
    } catch (err) {
      toast.error("Failed to generate AI routine. Please try again.");
    } finally {
      setGeneratingRoutine(false);
    }
  };

  return (
    <div className="anatomy-page-root">
      {/* Streamlined Page Header */}
      <div className="anatomy-page-header">
        <h1>
          Human Muscle <span>Anatomy Map</span>
        </h1>
        <p>
          Select any muscle to view anatomical biomechanics, prime mover exercises, and personalized recovery readiness.
        </p>

        {/* Mode Selector */}
        <div className="mode-selector-pill">
          <button
            type="button"
            className={mapMode === "filter" ? "active" : ""}
            onClick={() => setMapMode("filter")}
          >
            🔍 Exercise Target Explorer
          </button>
          <button
            type="button"
            className={mapMode === "recovery" ? "active" : ""}
            onClick={() => setMapMode("recovery")}
          >
            ⚡ Live Recovery Heatmap
          </button>
        </div>
      </div>

      {/* Embedded 2D Mannequin */}
      <InteractiveMuscleMap
        selectedMuscleId={selectedMuscleId}
        onSelectMuscle={handleSelectMuscle}
        mode={mapMode}
        title={`${activeMuscle.label} Anatomy`}
        subtitle="Click any muscle to explore biomechanics and exercises"
        compact={true}
        onLaunchAICoach={handleConsultAICoach}
      />

      {/* ─── AI BIOMECHANICS & HYPERTROPHY COACH SECTION ─── */}
      <div className="ai-muscle-coach-panel">
        <div className="coach-panel-header">
          <div className="coach-title-block">
            <div className="coach-avatar">
              <PsychologyIcon style={{ fontSize: "1.4rem" }} />
            </div>
            <div>
              <h3>
                FitHub AI Biomechanics Coach
                <span className="gemini-tag">GEMINI 2.5 FLASH</span>
              </h3>
              <p>
                Instant AI analysis on motor unit recruitment, optimal rep ranges, and injury prevention for {activeMuscle.label}
              </p>
            </div>
          </div>

          <div className="coach-actions-row">
            <Button
              variant="accent"
              size="md"
              iconStart={aiLoading ? <CircularProgress size={15} color="inherit" /> : <AutoAwesomeIcon />}
              onClick={handleConsultAICoach}
              disabled={aiLoading}
            >
              {aiAnalysis ? "Re-Analyze Muscle" : `Analyze ${activeMuscle.label} with AI`}
            </Button>

            <Button
              variant="primary"
              size="md"
              iconStart={generatingRoutine ? <CircularProgress size={15} color="inherit" /> : <PlayArrowIcon />}
              onClick={handleGenerateAIMuscleRoutine}
              disabled={generatingRoutine}
            >
              Generate AI {activeMuscle.label} Workout
            </Button>
          </div>
        </div>

        {/* AI Results Display */}
        {aiAnalysis ? (
          <div className="ai-results-grid">
            <div className="ai-card verdict">
              <div className="card-label">
                <WhatshotIcon />
                <span>Coach Verdict & Readiness</span>
              </div>
              <p>{aiAnalysis.verdict}</p>
            </div>

            <div className="ai-card cue">
              <div className="card-label">
                <BoltIcon />
                <span>Peak Activation Cue</span>
              </div>
              <p>"{aiAnalysis.activationCue}"</p>
            </div>

            <div className="ai-card reps">
              <div className="card-label">
                <FitnessCenterIcon />
                <span>Optimal Set & Rep Scheme</span>
              </div>
              <p>{aiAnalysis.repScheme}</p>
            </div>

            <div className="ai-card injury">
              <div className="card-label">
                <SelfImprovementIcon />
                <span>Joint Safety & Form Guard</span>
              </div>
              <p>{aiAnalysis.injuryPrevention}</p>
            </div>
          </div>
        ) : (
          <div className="ai-empty-prompt">
            <p>
              Click <strong>"Analyze {activeMuscle.label} with AI"</strong> to generate a customized biomechanical profile, optimal rep schemes, and real-time activation cues.
            </p>
          </div>
        )}
      </div>

      {/* Deep Muscle Biomechanics & Guides Grid */}
      <div className="muscle-deep-dive-grid">
        {/* Card 1: Biomechanical Function & Prime Movers */}
        <div className="deep-dive-card function-card">
          <div className="card-header">
            <div className="header-icon cyan">
              <BoltIcon />
            </div>
            <div>
              <h3>Biomechanical Function</h3>
              <Badge variant="accent" size="sm">
                {activeMuscle.anatomicalName}
              </Badge>
            </div>
          </div>

          <p className="desc-text">{knowledge.function}</p>

          <div className="card-sub-section">
            <h4>Key Form Cues:</h4>
            <p className="cue-quote">"{knowledge.formCues}"</p>
          </div>
        </div>

        {/* Card 2: Top Compound & Isolation Exercises */}
        <div className="deep-dive-card exercises-card">
          <div className="card-header">
            <div className="header-icon blue">
              <FitnessCenterIcon />
            </div>
            <div>
              <h3>Prime Mover Exercises</h3>
              <Badge variant="primary" size="sm">
                Mass & Strength Drivers
              </Badge>
            </div>
          </div>

          <div className="exercise-list-group">
            <span className="group-title blue">Heavy Compound Movements:</span>
            <ul>
              {knowledge.bestCompounds.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="exercise-list-group" style={{ marginTop: "0.85rem" }}>
            <span className="group-title cyan">Target Isolation / Cable Drivers:</span>
            <ul>
              {knowledge.bestIsolations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <Button
            variant="outline"
            size="md"
            fullWidth
            iconEnd={<ArrowForwardIcon />}
            onClick={handleNavigateExercises}
            style={{ marginTop: "1rem" }}
          >
            Browse All {activeMuscle.label} Exercises
          </Button>
        </div>

        {/* Card 3: Pre-Workout Dynamic Warmup */}
        <div className="deep-dive-card warmup-card">
          <div className="card-header">
            <div className="header-icon green">
              <WhatshotIcon />
            </div>
            <div>
              <h3>Pre-Workout Dynamic Warmup</h3>
              <Badge variant="warning" size="sm">
                Joint Prep & Injury Prevention
              </Badge>
            </div>
          </div>

          <div className="routines-list">
            {warmupRoutine.map((step, idx) => (
              <div key={idx} className="routine-step-item">
                <span className="step-num">{idx + 1}</span>
                <div className="step-content">
                  <div className="step-top">
                    <strong>{step.name}</strong>
                    <span className="step-duration">{step.duration}</span>
                  </div>
                  <p>{step.cue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Post-Workout Cooldown & Stretches */}
        <div className="deep-dive-card cooldown-card">
          <div className="card-header">
            <div className="header-icon purple">
              <SelfImprovementIcon />
            </div>
            <div>
              <h3>Post-Workout Cooldown</h3>
              <Badge variant="info" size="sm">
                Recovery & Flexibility Reset
              </Badge>
            </div>
          </div>

          <div className="routines-list">
            {cooldownStretches.map((step, idx) => (
              <div key={idx} className="routine-step-item">
                <span className="step-num purple">{idx + 1}</span>
                <div className="step-content">
                  <div className="step-top">
                    <strong>{step.name}</strong>
                    <span className="step-duration purple">{step.duration || step.hold || "30s"}</span>
                  </div>
                  <p>{step.cue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnatomyPage;
