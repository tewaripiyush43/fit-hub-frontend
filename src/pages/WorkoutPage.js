import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { fetchWorkout, deleteWorkout, updateWorkout, fetchAICoachSummary, cloneWorkout } from "../api/workoutApi";
import { logWorkoutSession, updatePRs } from "../api/userApi";
import { workoutActions, activeWorkoutActions, portalActions, selectActiveWorkout } from "../store/index";
import ExerciseCard from "../components/ExerciseCard";
import ConfirmationPopup from "../components/ConfirmationPopUp";
import { useUnitPreference } from "../utils/useUnitPreference";
import {
  playSetCompleteSound,
  playRestCompleteSound,
  playWorkoutCompleteSound,
  triggerHaptic,
} from "../utils/audioFeedback";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import EditIcon from "@mui/icons-material/Edit";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ShareIcon from "@mui/icons-material/Share";
import CheckIcon from "@mui/icons-material/Check";
import BoltIcon from "@mui/icons-material/Bolt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalculateIcon from "@mui/icons-material/Calculate";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import SpaIcon from "@mui/icons-material/Spa";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import PreWorkoutWarmupModal from "../components/PreWorkoutWarmupModal";
import PostWorkoutCooldownModal from "../components/PostWorkoutCooldownModal";
import PlateCalculatorModal from "../components/PlateCalculatorModal";
import ExerciseSwapModal from "../components/ExerciseSwapModal";
import GymSessionLegendModal from "../components/GymSessionLegendModal";

const renderFormattedDescription = (text) => {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    if (!cleanLine) {
      return <br key={idx} />;
    }
    const isListItem = cleanLine.startsWith("* ") || cleanLine.startsWith("- ");
    const isNumbered = /^\d+\.\s/.test(cleanLine);
    const isHeading = cleanLine.startsWith("#");

    if (isHeading) {
      const headingText = cleanLine.replace(/^#+\s*/, "");
      return (
        <h4 key={idx} className="desc-subheading">
          {headingText}
        </h4>
      );
    }

    if (isListItem || isNumbered) {
      return (
        <li key={idx} className="desc-list-item">
          {cleanLine.replace(/^([*-]|\d+\.)\s*/, "")}
        </li>
      );
    }

    return (
      <p key={idx} className="desc-paragraph">
        {cleanLine}
      </p>
    );
  });
};

const WORKOUT_DESCRIPTION_MAX_LENGTH = 2500;

const WorkoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, workoutId } = useParams();
  const [id] = (workoutId || "").split("-");
  const dispatch = useDispatch();
  const workoutData = useSelector((state) => state.workout.workoutData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const isOwner = Boolean(
    isLoggedIn &&
      user &&
      (
        (workoutData?.createdBy && (
          String(workoutData.createdBy?._id || workoutData.createdBy) === String(user._id)
        )) ||
        (username && user.username && username.toLowerCase() === user.username.toLowerCase()) ||
        user.workouts?.some((w) => String(typeof w === "string" ? w : w?._id) === String(id))
      )
  );
  const [editMode, setEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const textareaRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);

  const { isMetric, weightUnit, weightStep, defaultExerciseWeight } = useUnitPreference();

  // Connect to persistent Redux active session
  const globalActiveWorkout = useSelector(selectActiveWorkout);
  const isMatchingGlobalSession = Boolean(globalActiveWorkout?.isActive && globalActiveWorkout?.workoutId === id);

  const shouldAutoStart =
    isMatchingGlobalSession ||
    location.pathname.endsWith("/session") ||
    new URLSearchParams(location.search).get("session") === "true";

  const [activeSession, setActiveSession] = useState(shouldAutoStart);
  const [sessionExercises, setSessionExercises] = useState(
    isMatchingGlobalSession && globalActiveWorkout?.sessionExercises ? globalActiveWorkout.sessionExercises : {}
  );
  const [seconds, setSeconds] = useState(
    isMatchingGlobalSession && globalActiveWorkout?.elapsedSeconds ? globalActiveWorkout.elapsedSeconds : 0
  );
  const [showSummary, setShowSummary] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);
  const [totalSets, setTotalSets] = useState(0);

  // Rest Timer State
  const [restDuration, setRestDuration] = useState(
    isMatchingGlobalSession && globalActiveWorkout?.restTimer?.restDuration ? globalActiveWorkout.restTimer.restDuration : 60
  );
  const [restTimeLeft, setRestTimeLeft] = useState(
    isMatchingGlobalSession && globalActiveWorkout?.restTimer?.restTimeLeft ? globalActiveWorkout.restTimer.restTimeLeft : 0
  );
  const [isRestActive, setIsRestActive] = useState(
    isMatchingGlobalSession ? Boolean(globalActiveWorkout?.restTimer?.isRestActive) : false
  );
  const [isRestPaused, setIsRestPaused] = useState(
    isMatchingGlobalSession ? Boolean(globalActiveWorkout?.restTimer?.isRestPaused) : false
  );
  const [restBannerNotice, setRestBannerNotice] = useState(false);
  const [showCustomRestModal, setShowCustomRestModal] = useState(false);
  const [customRestMins, setCustomRestMins] = useState("1");
  const [customRestSecs, setCustomRestSecs] = useState("0");

  // Gym Experience State Variables
  const [showWarmupModal, setShowWarmupModal] = useState(false);
  const [showCooldownModal, setShowCooldownModal] = useState(false);
  const [showPlateModal, setShowPlateModal] = useState(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState(60);
  const [swapTargetExercise, setSwapTargetExercise] = useState(null);
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [exerciseNotes, setExerciseNotes] = useState(
    isMatchingGlobalSession && globalActiveWorkout?.exerciseNotes ? globalActiveWorkout.exerciseNotes : {}
  );
  const [openNotes, setOpenNotes] = useState({});

  // AI Performance Coach & PR State
  const [aiCoachDebrief, setAiCoachDebrief] = useState(null);
  const [loadingAICoach, setLoadingAICoach] = useState(false);
  const [sessionPRsCount, setSessionPRsCount] = useState(0);

  // Compute previous session ghost values for each exercise from user.sessionHistory
  const previousSessionStats = React.useMemo(() => {
    const stats = {};
    const history = user?.sessionHistory || [];
    if (!history.length) return stats;

    history.forEach((session) => {
      (session.exercises || []).forEach((ex) => {
        const exName = (ex.exerciseName || "").toLowerCase().trim();
        const exId = ex.exerciseId;
        const maxWeightSet = (ex.sets || []).reduce((max, s) => {
          const w = Number(s.weight) || 0;
          return w > (Number(max?.weight) || 0) ? s : max;
        }, null);

        if (maxWeightSet) {
          const statData = {
            weight: maxWeightSet.weight,
            reps: maxWeightSet.reps,
            date: session.date,
          };
          if (exId && !stats[exId]) stats[exId] = statData;
          if (exName && !stats[exName]) stats[exName] = statData;
        }
      });
    });

    return stats;
  }, [user?.sessionHistory]);

  const handleApplyCustomRest = (totalSecs) => {
    const validSecs = Math.max(5, Math.min(600, totalSecs));
    setRestDuration(validSecs);
    if (isRestActive) {
      setRestTimeLeft(validSecs);
    }
    setShowCustomRestModal(false);
    toast.success(`Rest timer set to ${formatTime(validSecs)}`);
  };

  const handleTogglePrivacy = async () => {
    if (!workoutData || !isOwner) return;
    const updatedPrivate = !workoutData.isPrivate;

    dispatch(
      workoutActions.setWorkoutData({
        ...workoutData,
        isPrivate: updatedPrivate,
      })
    );

    try {
      await updateWorkout(dispatch, id, {
        ...workoutData,
        isPrivate: updatedPrivate,
      });
      toast.info(updatedPrivate ? "Workout is now Private" : "Workout is now Public & Shareable");
    } catch (err) {
      console.error("Failed to update privacy:", err);
      dispatch(
        workoutActions.setWorkoutData({
          ...workoutData,
          isPrivate: !updatedPrivate,
        })
      );
      toast.error("Failed to update workout privacy");
    }
  };

  const [isSavingWorkout, setIsSavingWorkout] = useState(false);
  const [plannedTargets, setPlannedTargets] = useState(() => {
    try {
      const saved = localStorage.getItem(`planned_targets_${id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleUpdatePlannedTarget = (exerciseId, field, value) => {
    setPlannedTargets((prev) => {
      const current = prev[exerciseId] || { setsCount: 3, weight: defaultExerciseWeight, reps: 10 };
      const updated = {
        ...prev,
        [exerciseId]: {
          ...current,
          [field]: value,
        },
      };
      try {
        localStorage.setItem(`planned_targets_${id}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const isAlreadySaved = Boolean(
    user?.workouts?.some(
      (w) =>
        w._id === id ||
        (w.name && workoutData?.name && w.name.toLowerCase().replace(/ \(copy\)$/i, "").trim() === workoutData.name.toLowerCase().trim())
    )
  );

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (isLoggedIn && user?.username) {
      navigate(`/${user.username}/myworkouts`);
    } else {
      navigate("/workouts?tab=explore");
    }
  };

  const handleCloneCurrentWorkout = async () => {
    if (!isLoggedIn || !user) {
      dispatch(portalActions.setPortalOpen());
      toast.info("Please log in or sign up to save this routine to your library!");
      return;
    }
    setIsSavingWorkout(true);
    try {
      const clonedId = await cloneWorkout(dispatch, id);
      if (clonedId) {
        toast.success(`"${workoutData?.name || "Workout"}" saved to your workouts!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save workout.");
    } finally {
      setIsSavingWorkout(false);
    }
  };

  const handleCopyLink = () => {
    const slug = workoutData?.name ? workoutData.name.replace(/\s+/g, "-") : "";
    const shareUrl = `${window.location.origin}/share/workout/${id}-${slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Workout link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleStartSession = () => {
    if (!isLoggedIn || !user) {
      dispatch(portalActions.setPortalOpen());
      toast.info("Please log in or sign up to track and log your live workout sessions!");
      return;
    }
    if (!workoutData?.exercises?.length) return;
    const initialSession = {};
    workoutData.exercises.forEach((ex) => {
      // If user had previous stats, prefill intelligently
      const prev = previousSessionStats[ex._id] || previousSessionStats[(ex.name || "").toLowerCase().trim()];
      const target = plannedTargets[ex._id];
      const count = Number(target?.setsCount) || 3;
      const initialWeight = target?.weight !== undefined && target?.weight !== "" ? Number(target.weight) : (prev?.weight !== undefined ? prev.weight : defaultExerciseWeight);
      const initialReps = target?.reps !== undefined && target?.reps !== "" ? Number(target.reps) : (prev?.reps !== undefined ? prev.reps : 10);

      initialSession[ex._id] = Array.from({ length: Math.min(Math.max(count, 1), 10) }, (_, i) => ({
        setNum: i + 1,
        weight: initialWeight,
        reps: initialReps,
        completed: false,
        tag: "N",
      }));
    });
    setSessionExercises(initialSession);
    setSeconds(0);
    setRestTimeLeft(0);
    setIsRestActive(false);
    setActiveSession(true);

    dispatch(
      activeWorkoutActions.startActiveWorkout({
        workoutId: id,
        workoutName: workoutData?.name || "Active Workout",
        sessionExercises: initialSession,
        restDuration,
        exerciseNotes,
      })
    );
  };

  // Sync auto-started sessions or sessions loaded from URL
  useEffect(() => {
    if (activeSession && workoutData?.exercises?.length && Object.keys(sessionExercises).length === 0) {
      const initialSession = {};
      workoutData.exercises.forEach((ex) => {
        const prev = previousSessionStats[ex._id] || previousSessionStats[(ex.name || "").toLowerCase().trim()];
        const initialWeight = prev?.weight || defaultExerciseWeight;
        const initialReps = prev?.reps || 10;

        initialSession[ex._id] = [
          { setNum: 1, weight: initialWeight, reps: initialReps, completed: false, tag: "N" },
          { setNum: 2, weight: initialWeight, reps: initialReps, completed: false, tag: "N" },
          { setNum: 3, weight: initialWeight, reps: initialReps, completed: false, tag: "N" },
        ];
      });
      setSessionExercises(initialSession);
      dispatch(
        activeWorkoutActions.startActiveWorkout({
          workoutId: id,
          workoutName: workoutData?.name || "Active Workout",
          sessionExercises: initialSession,
          restDuration,
          exerciseNotes,
        })
      );
    }
  }, [activeSession, workoutData, sessionExercises, previousSessionStats, defaultExerciseWeight, id, restDuration, exerciseNotes, dispatch]);

  // Sync session exercises changes to global store
  useEffect(() => {
    if (activeSession && Object.keys(sessionExercises).length > 0) {
      dispatch(activeWorkoutActions.updateActiveExercises(sessionExercises));
    }
  }, [sessionExercises, activeSession, dispatch]);

  // Sync notes changes to global store
  useEffect(() => {
    if (activeSession && Object.keys(exerciseNotes).length > 0) {
      dispatch(activeWorkoutActions.updateActiveNotes(exerciseNotes));
    }
  }, [exerciseNotes, activeSession, dispatch]);

  const handleToggleSetTag = (exerciseId, index) => {
    const currentSets = [...(sessionExercises[exerciseId] || [])];
    const tags = ["N", "W", "D", "F"]; // Normal, Warmup, Drop Set, Failure
    const currentTag = currentSets[index].tag || "N";
    const nextTag = tags[(tags.indexOf(currentTag) + 1) % tags.length];

    currentSets[index] = {
      ...currentSets[index],
      tag: nextTag,
    };
    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: currentSets,
    });
    triggerHaptic([20]);
  };

  const handleSwapConfirm = (oldExId, newExercise) => {
    if (!workoutData || !newExercise) return;

    const updatedExercises = (workoutData.exercises || []).map((ex) =>
      ex._id === oldExId ? { ...newExercise, _id: newExercise._id } : ex
    );

    dispatch(
      workoutActions.setWorkoutData({
        ...workoutData,
        exercises: updatedExercises,
      })
    );

    // Transfer session sets to new exercise ID
    if (sessionExercises[oldExId]) {
      const existingSets = sessionExercises[oldExId];
      const newSession = { ...sessionExercises };
      delete newSession[oldExId];
      newSession[newExercise._id] = existingSets;
      setSessionExercises(newSession);
    }

    toast.success(`Swapped to ${newExercise.name}!`);
  };

  // Active workout duration stopwatch
  useEffect(() => {
    let interval = null;
    if (activeSession && !showSummary) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!activeSession) {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeSession, showSummary]);

  // Rest Timer countdown interval
  useEffect(() => {
    let restInterval = null;
    if (activeSession && isRestActive && !isRestPaused && restTimeLeft > 0) {
      restInterval = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(restInterval);
            setIsRestActive(false);
            playRestCompleteSound();
            setRestBannerNotice(true);
            setTimeout(() => setRestBannerNotice(false), 4000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [activeSession, isRestActive, isRestPaused, restTimeLeft]);

  const handleAddActiveSet = (exerciseId) => {
    const currentSets = sessionExercises[exerciseId] || [];
    const lastSet = currentSets[currentSets.length - 1];
    const newSet = {
      setNum: currentSets.length + 1,
      weight: lastSet ? lastSet.weight : defaultExerciseWeight,
      reps: lastSet ? lastSet.reps : 10,
      completed: false,
    };
    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: [...currentSets, newSet],
    });
    triggerHaptic([30]);
  };

  const handleRemoveActiveSet = (exerciseId) => {
    const currentSets = sessionExercises[exerciseId] || [];
    if (currentSets.length <= 1) return;
    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: currentSets.slice(0, currentSets.length - 1),
    });
    triggerHaptic([30]);
  };

  const isExerciseMatch = (prName, currentExName) => {
    if (!prName || !currentExName) return false;
    const p = prName.toLowerCase().replace(/[()_,-]/g, " ").replace(/\s+/g, " ").trim();
    const c = currentExName.toLowerCase().replace(/[()_,-]/g, " ").replace(/\s+/g, " ").trim();
    if (p === c) return true;
    if (p.length >= 4 && c.includes(p)) return true;
    if (c.length >= 4 && p.includes(c)) return true;

    // Check core compound lifts
    const compounds = [
      "deadlift",
      "bench press",
      "squat",
      "overhead press",
      "shoulder press",
      "barbell row",
      "pull up",
      "chin up",
      "dip",
      "leg press",
      "lat pulldown"
    ];
    for (const compound of compounds) {
      if (p.includes(compound) && c.includes(compound)) return true;
    }
    return false;
  };

  const checkAndSyncPRsAndGoals = async (exerciseId, weightVal) => {
    const numWeight = Number(weightVal);
    if (!numWeight || numWeight <= 0 || !user) return;
    const exObj = workoutData?.exercises?.find((e) => e._id === exerciseId);
    const exName = exObj?.name || "";
    if (!exName) return;

    const prList = user.prs || [];
    // Smart match with user's manually tracked PRs/Goals
    const matchingPrIndex = prList.findIndex((p) => isExerciseMatch(p.exercise, exName));

    // If not manually tracked by the user, do NOT auto-add it to achievements/PRs
    if (matchingPrIndex === -1) return;

    const currentPR = prList[matchingPrIndex];
    const previousMax = Number(currentPR.maxWeight) || 0;
    const targetGoal = Number(currentPR.goalWeight) || 0;

    if (numWeight > previousMax || (targetGoal > 0 && numWeight >= targetGoal)) {
      const hitGoal = targetGoal > 0 && numWeight >= targetGoal;

      if (hitGoal) {
        toast.success(
          `🎉 GOAL ACHIEVED! You set a target goal of ${targetGoal} ${weightUnit} on ${currentPR.exercise || exName}, and you just crushed it with ${numWeight} ${weightUnit}!`,
          { autoClose: 7000 }
        );
      } else {
        toast.success(`🏆 NEW PERSONAL RECORD! ${numWeight} ${weightUnit} on ${currentPR.exercise || exName}!`, {
          autoClose: 4000,
        });
      }

      setSessionPRsCount((prev) => prev + 1);

      const updatedPrs = prList.map((pr, idx) => {
        if (idx === matchingPrIndex) {
          return {
            ...pr,
            maxWeight: Math.max(numWeight, previousMax),
            unit: weightUnit,
          };
        }
        return pr;
      });

      if (isLoggedIn) {
        try {
          await updatePRs(dispatch, updatedPrs);
        } catch (err) {
          console.error("Failed to sync PR update to DB:", err);
        }
      }
    }
  };

  const handleToggleSetCompleted = (exerciseId, index) => {
    const currentSets = [...(sessionExercises[exerciseId] || [])];
    const willBeCompleted = !currentSets[index].completed;

    let isNewPR = false;
    if (willBeCompleted) {
      const exObj = (workoutData?.exercises || []).find((e) => e._id === exerciseId);
      const exName = exObj?.name || "";
      const loggedWeight = Number(currentSets[index].weight) || 0;

      const existingPr = (user?.prs || []).find(
        (p) => p.exercise?.toLowerCase().trim() === exName.toLowerCase().trim()
      );
      if (loggedWeight > 0 && existingPr && loggedWeight > (existingPr.maxWeight || 0)) {
        isNewPR = true;
      }
    }

    currentSets[index] = {
      ...currentSets[index],
      completed: willBeCompleted,
      isPR: isNewPR,
    };

    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: currentSets,
    });

    if (willBeCompleted) {
      playSetCompleteSound();
      checkAndSyncPRsAndGoals(exerciseId, currentSets[index].weight);
      // Auto-start rest timer
      setRestTimeLeft(restDuration);
      setIsRestActive(true);
      setIsRestPaused(false);
      dispatch(activeWorkoutActions.startActiveRest(restDuration));
      toast.info(`⏳ Rest mode: ${restDuration}s countdown started`, {
        icon: "⏱️",
        autoClose: 2000,
      });
    }
  };

  const handleGetAICoachDebrief = async () => {
    setLoadingAICoach(true);
    try {
      const summary = await fetchAICoachSummary({
        workoutName: workoutData?.name || "Training Session",
        duration: formatTime(seconds),
        totalVolume,
        completedSets,
        prsCount: sessionPRsCount,
        weightUnit,
      });
      setAiCoachDebrief(summary);
    } catch (err) {
      toast.error("Could not generate AI coach summary.");
    } finally {
      setLoadingAICoach(false);
    }
  };

  const handleActiveSetChange = (exerciseId, index, field, value) => {
    const currentSets = [...(sessionExercises[exerciseId] || [])];
    currentSets[index] = {
      ...currentSets[index],
      [field]: Math.max(0, Number(value) || 0),
    };
    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: currentSets,
    });
  };

  const handleAdjustValue = (exerciseId, index, field, delta) => {
    const currentSets = [...(sessionExercises[exerciseId] || [])];
    if (currentSets[index].completed) return; // don't modify completed sets
    const currentVal = Number(currentSets[index][field]) || 0;
    const minVal = field === "reps" ? 1 : 0;
    const newVal = Math.max(minVal, currentVal + delta);
    currentSets[index] = {
      ...currentSets[index],
      [field]: newVal,
    };
    setSessionExercises({
      ...sessionExercises,
      [exerciseId]: currentSets,
    });
    triggerHaptic([20]);
  };

  const handleAdjustRestTime = (secondsDelta) => {
    setRestTimeLeft((prev) => Math.max(0, prev + secondsDelta));
    triggerHaptic([20]);
  };

  const handleFinishWorkout = async () => {
    let volumeSum = 0;
    let completedCount = 0;
    let totalCount = 0;
    Object.keys(sessionExercises).forEach((exId) => {
      const sets = sessionExercises[exId] || [];
      totalCount += sets.length;
      sets.forEach((set) => {
        if (set.completed) {
          completedCount += 1;
          volumeSum += set.weight * set.reps;
        }
      });
    });

    setTotalVolume(volumeSum);
    setCompletedSets(completedCount);
    setTotalSets(totalCount);
    setShowSummary(true);
    setIsRestActive(false);
    playWorkoutCompleteSound();

    const exercisesBreakdown = (workoutData?.exercises || []).map((ex) => {
      const sets = sessionExercises[ex._id] || [];
      return {
        exerciseId: ex._id,
        exerciseName: ex.name,
        targetMuscle: ex.target || ex.bodyPart || "",
        gifUrl: ex.gifUrl || "",
        sets: sets.map((s, idx) => ({
          setNum: idx + 1,
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0,
          completed: Boolean(s.completed),
        })),
      };
    });

    const now = new Date();
    const logPayload = {
      workoutId: id,
      workoutName: workoutData.name,
      duration: formatTime(seconds),
      totalVolume: volumeSum,
      completedSets: completedCount,
      totalSets: totalCount,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: now.getTime(),
      exercises: exercisesBreakdown,
    };

    try {
      await logWorkoutSession(dispatch, logPayload);
    } catch (err) {
      console.error("Failed to log workout session in DB:", err);
    }

    // Immediately clear active workout from Redux and localStorage
    dispatch(activeWorkoutActions.completeActiveWorkout());
    try {
      localStorage.removeItem("fithub_active_session");
    } catch (e) {
      // ignore
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setActiveSession(false);
    dispatch(activeWorkoutActions.completeActiveWorkout());
    try {
      localStorage.removeItem("fithub_active_session");
    } catch (e) {
      // ignore
    }
    navigate(`/${username || "user"}/dashboard`);
  };

  const handleShareSummary = () => {
    const badge = getEarnedBadge(totalVolume);
    const summaryText = `🏆 Workout Completed: ${workoutData?.name || "Routine"}\n⏱️ Time: ${formatTime(seconds)}\n🏋️ Volume: ${totalVolume.toLocaleString()} ${weightUnit}\n✅ Sets: ${completedSets}/${totalSets}\n🎖️ Badge: ${badge}\nLogged with FitHub 💪`;
    navigator.clipboard.writeText(summaryText);
    setSummaryCopied(true);
    toast.success("Workout summary copied to clipboard!");
    setTimeout(() => setSummaryCopied(false), 2500);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const getEarnedBadge = (volume) => {
    if (isMetric) {
      if (volume >= 5500) return "💪 Hercules Tier (5.5k+ kg volume)";
      if (volume >= 3500) return "🔥 Iron Warrior (3.5k+ kg volume)";
      if (volume >= 1400) return "⚡ Gym Beast (1.4k+ kg volume)";
      return "✨ Fitness Champion";
    }
    if (volume >= 12000) return "💪 Hercules Tier (12k+ lbs volume)";
    if (volume >= 7500) return "🔥 Iron Warrior (7.5k+ lbs volume)";
    if (volume >= 3000) return "⚡ Gym Beast (3k+ lbs volume)";
    return "✨ Fitness Champion";
  };

  useEffect(() => {
    fetchWorkout(dispatch, id);
  }, [dispatch, id]);

  useEffect(() => {
    if (!isOwner && editMode) {
      setEditMode(false);
    }
  }, [editMode, isOwner]);

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(
      workoutActions.setWorkoutData({
        ...workoutData,
        [name]: value,
      })
    );
    if (name === "description" && editMode && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }

  useEffect(() => {
    if (editMode && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editMode]);

  // ACTIVE SESSION VIEW
  if (activeSession) {
    let totalSetsCount = 0;
    let completedSetsCount = 0;
    Object.keys(sessionExercises).forEach((exId) => {
      const sets = sessionExercises[exId] || [];
      totalSetsCount += sets.length;
      completedSetsCount += sets.filter((s) => s.completed).length;
    });
    const progressPercent = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

    return (
      <div className="workout-page active-session-page">
        {/* Discard Session Confirmation Modal */}
        {showCancelModal && (
          <ConfirmationPopup
            title="Discard Active Workout?"
            message="Are you sure you want to cancel this session? Any unsaved sets and progress will be lost."
            confirmText="Discard Session"
            cancelText="Keep Working Out"
            onClose={() => setShowCancelModal(false)}
            onConfirm={() => {
              setShowCancelModal(false);
              setActiveSession(false);
              setIsRestActive(false);
              dispatch(activeWorkoutActions.discardActiveWorkout());
              toast.info("Workout session cancelled");
            }}
          />
        )}
        
        {/* Pre-Workout Warmup & Mobility Guide Modal */}
        <PreWorkoutWarmupModal
          open={showWarmupModal}
          onClose={() => setShowWarmupModal(false)}
          routineName={workoutData?.name}
          exercises={workoutData?.exercises}
          weightUnit={weightUnit}
        />

        {/* Post-Workout Cooldown & Nutrition Modal */}
        <PostWorkoutCooldownModal
          open={showCooldownModal}
          onClose={() => {
            setShowCooldownModal(false);
            handleCloseSummary();
          }}
          onBackToSummary={() => {
            setShowCooldownModal(false);
            setShowSummary(true);
          }}
          routineName={workoutData?.name}
          duration={formatTime(seconds)}
          totalVolume={totalVolume}
          completedSets={completedSets}
          weightUnit={weightUnit}
          exercises={workoutData?.exercises}
          onShare={handleShareSummary}
        />

        {/* Barbell Plate Calculator Modal */}
        <PlateCalculatorModal
          open={showPlateModal}
          onClose={() => setShowPlateModal(false)}
          initialWeight={plateCalcWeight}
          unit={weightUnit}
        />

        {/* Exercise Swap / Alternative Modal */}
        <ExerciseSwapModal
          open={Boolean(swapTargetExercise)}
          onClose={() => setSwapTargetExercise(null)}
          currentExercise={swapTargetExercise}
          onSwapConfirm={handleSwapConfirm}
        />

        {/* Gym Tools & Set Types Legend Modal */}
        <GymSessionLegendModal
          open={showLegendModal}
          onClose={() => setShowLegendModal(false)}
        />

        {/* Workout Complete Summary Modal */}
        {showSummary && createPortal(
          <div className="active-summary-overlay">
            <div className="active-summary-modal">
              <div className="modal-header">
                <EmojiEventsIcon className="trophy-gold" />
                <h2>Workout Completed!</h2>
                <p>Outstanding effort! Here is your training session breakdown:</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{formatTime(seconds)}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Volume Lifted</span>
                  <span className="stat-value">{totalVolume.toLocaleString()} <span className="stat-unit">{weightUnit}</span></span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Sets Completed</span>
                  <span className="stat-value">{completedSets} / {totalSets}</span>
                </div>
              </div>
              <div className="badge-unlock-section">
                <span className="badge-label">Earned Achievement</span>
                <span className="badge-name">{getEarnedBadge(totalVolume)}</span>
              </div>

              {/* Token-Efficient 1-Tap AI Performance Coach Debrief */}
              <div className="summary-ai-coach-section">
                {!aiCoachDebrief ? (
                  <button
                    className="ai-coach-trigger-btn"
                    onClick={handleGetAICoachDebrief}
                    disabled={loadingAICoach}
                  >
                    <AutoAwesomeIcon style={{ color: "#00f0ff", fontSize: "1.1rem" }} />
                    <span>{loadingAICoach ? "Coach is analyzing session..." : "🤖 1-Tap AI Coach Debrief"}</span>
                  </button>
                ) : (
                  <div className="ai-coach-debrief-card">
                    <div className="debrief-card-header">
                      <AutoAwesomeIcon style={{ color: "#00f0ff", fontSize: "1.1rem" }} />
                      <strong>FitHub AI Coach Debrief</strong>
                    </div>
                    <p className="debrief-card-text">{aiCoachDebrief}</p>
                  </div>
                )}
              </div>

              <div className="summary-actions-row">
                <button
                  className="cooldown-launch-btn"
                  onClick={() => {
                    setShowSummary(false);
                    setShowCooldownModal(true);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "linear-gradient(135deg, #00e676 0%, #00f0ff 100%)",
                    color: "#050811",
                    fontWeight: 900,
                    fontSize: "0.92rem",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "12px",
                    cursor: "pointer",
                  }}
                >
                  <SpaIcon style={{ fontSize: "1.1rem" }} /> Start Cooldown & Stretch
                </button>
                <button className="share-summary-btn" onClick={handleShareSummary}>
                  <ShareIcon style={{ fontSize: "1.1rem" }} />
                  <span>{summaryCopied ? "Copied!" : "Share"}</span>
                </button>
                <button className="finish-dismiss-btn" onClick={handleCloseSummary}>
                  Dashboard
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Top Session Header */}
        <div className="workout-page-header">
          <div className="active-timer-section">
            <TimerIcon className="timer-icon" />
            <span className="active-timer-display">{formatTime(seconds)}</span>
          </div>
          <div className="active-header-actions">
            <button
              className="gym-guide-trigger-btn"
              type="button"
              onClick={() => setShowLegendModal(true)}
              title="Learn what Set Types (N, W, D, F) and Gym Tools mean"
            >
              <HelpOutlineIcon style={{ fontSize: "1.05rem" }} />
              <span>Guide & Legend</span>
            </button>
            <button className="finish-workout-btn" onClick={handleFinishWorkout}>
              <CheckIcon style={{ fontSize: "1.1rem" }} /> Finish Workout
            </button>
            <button className="cancel-workout-btn" onClick={() => setShowCancelModal(true)}>
              Cancel
            </button>
          </div>
        </div>

        <div className="workout-page-meta">
          <span className="active-status-badge">Session In Progress</span>
          <h1 className="workout-page-title">{workoutData?.name}</h1>
        </div>

        {/* Pre-Workout Warmup & Mobility Banner */}
        <div className="pre-workout-warmup-banner">
          <div className="banner-left">
            <div className="banner-fire-wrap">
              <WhatshotIcon />
            </div>
            <div className="banner-text">
              <span className="banner-title">Dynamic Warm-up & Mobility</span>
              <span className="banner-sub">Prime joints and muscles before heavy lifting</span>
            </div>
          </div>
          <button
            className="start-warmup-pill-btn"
            onClick={() => setShowWarmupModal(true)}
            type="button"
          >
            <PlayArrowIcon style={{ fontSize: "1rem" }} /> Start Warm-up Guide
          </button>
        </div>

        {/* Rest Banner Notification (When timer reaches 0) */}
        {restBannerNotice && (
          <div className="rest-notice-banner">
            <BoltIcon className="rest-notice-icon" />
            <span>Rest period complete! Get ready for your next set.</span>
          </div>
        )}

        {/* Floating / Embedded Rest Timer HUD */}
        <div className={`rest-timer-hud ${isRestActive ? "active" : "idle"}`}>
          <div className="rest-timer-top-row">
            <div className="rest-timer-title-group">
              <HourglassEmptyIcon className={`hourglass-icon ${isRestActive && !isRestPaused ? "spinning" : ""}`} />
              <span className="rest-timer-label">
                {isRestActive ? (isRestPaused ? "Rest Paused" : "Rest Timer") : "Rest Interval Preset"}
              </span>
            </div>
            <div className="rest-timer-presets">
              {[30, 60, 90, 120, 180].map((durationSec) => (
                <button
                  key={durationSec}
                  className={`preset-btn ${restDuration === durationSec ? "active" : ""}`}
                  onClick={() => {
                    setRestDuration(durationSec);
                    if (!isRestActive) {
                      setRestTimeLeft(durationSec);
                    }
                  }}
                >
                  {durationSec}s
                </button>
              ))}
              <button
                className={`preset-btn custom-preset-btn ${![30, 60, 90, 120, 180].includes(restDuration) ? "active" : ""}`}
                onClick={() => {
                  setCustomRestMins(String(Math.floor(restDuration / 60)));
                  setCustomRestSecs(String(restDuration % 60));
                  setShowCustomRestModal(true);
                }}
                title="Set custom rest interval"
              >
                <EditIcon style={{ fontSize: "0.75rem" }} />
                <span>{![30, 60, 90, 120, 180].includes(restDuration) ? `${restDuration}s` : "Custom"}</span>
              </button>
            </div>
          </div>

          {isRestActive ? (
            <div className="rest-countdown-row">
              <div
                className="rest-time-display clickable"
                onClick={() => {
                  setCustomRestMins(String(Math.floor(restTimeLeft / 60)));
                  setCustomRestSecs(String(restTimeLeft % 60));
                  setShowCustomRestModal(true);
                }}
                title="Click to manually edit rest time"
              >
                <span className="time-number">{formatTime(restTimeLeft)}</span>
                <EditIcon className="time-edit-hint" style={{ fontSize: "0.85rem" }} />
              </div>
              <div className="rest-controls-row">
                <button className="rest-adjust-btn" onClick={() => handleAdjustRestTime(-15)}>
                  -15s
                </button>
                <button className="rest-adjust-btn" onClick={() => handleAdjustRestTime(15)}>
                  +15s
                </button>
                <button
                  className="rest-pause-btn"
                  onClick={() => setIsRestPaused(!isRestPaused)}
                  title={isRestPaused ? "Resume Rest" : "Pause Rest"}
                >
                  {isRestPaused ? <PlayArrowIcon style={{ fontSize: "1.1rem" }} /> : <PauseIcon style={{ fontSize: "1.1rem" }} />}
                </button>
                <button
                  className="rest-skip-btn"
                  onClick={() => {
                    setIsRestActive(false);
                    setRestTimeLeft(0);
                  }}
                  title="Skip Rest"
                >
                  <SkipNextIcon style={{ fontSize: "1.1rem" }} /> Skip
                </button>
              </div>
            </div>
          ) : (
            <div className="rest-idle-hint">
              <span>Checking a set will automatically trigger your {restDuration}s rest timer.</span>
              <button
                className="start-rest-manual-btn"
                onClick={() => {
                  setRestTimeLeft(restDuration);
                  setIsRestActive(true);
                  setIsRestPaused(false);
                }}
              >
                Start Rest Now
              </button>
            </div>
          )}
        </div>

        {/* Custom Rest Timer Duration Modal */}
        {showCustomRestModal && createPortal(
          <div className="custom-rest-modal-overlay" onClick={() => setShowCustomRestModal(false)}>
            <div className="custom-rest-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-top">
                <HourglassEmptyIcon className="modal-icon" />
                <h3>Custom Rest Timer</h3>
                <p>Select a quick duration or enter minutes and seconds:</p>
              </div>

              <div className="quick-select-chips">
                {[15, 30, 45, 60, 90, 120, 180, 240, 300].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`quick-chip ${Number(customRestMins) * 60 + Number(customRestSecs) === s ? "active" : ""}`}
                    onClick={() => {
                      setCustomRestMins(String(Math.floor(s / 60)));
                      setCustomRestSecs(String(s % 60));
                    }}
                  >
                    {s >= 60 ? `${s / 60}m` : `${s}s`}
                  </button>
                ))}
              </div>

              {/* Direct Minutes / Seconds Inputs */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const total = (Number(customRestMins) || 0) * 60 + (Number(customRestSecs) || 0);
                  handleApplyCustomRest(total);
                }}
                className="custom-time-inputs-form"
              >
                <div className="inputs-pair">
                  <div className="input-unit-group">
                    <label>Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={customRestMins}
                      onChange={(e) => setCustomRestMins(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <span className="colon-separator">:</span>
                  <div className="input-unit-group">
                    <label>Seconds</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customRestSecs}
                      onChange={(e) => setCustomRestSecs(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowCustomRestModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-apply-btn">
                    Apply Timer
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

        {/* Active Exercises List */}
        <div className="active-exercises-list">
          {workoutData?.exercises?.map((exercise) => {
            const sets = sessionExercises[exercise._id] || [];
            const prevStats =
              previousSessionStats[exercise._id] ||
              previousSessionStats[(exercise.name || "").toLowerCase().trim()];
            const firstSetWeight = sets[0]?.weight || 60;
            const isNotesOpen = Boolean(openNotes[exercise._id]);

            return (
              <div key={exercise._id} className="active-exercise-card">
                <div className="exercise-header">
                  <div className="header-title-group">
                    <FitnessCenterIcon className="ex-icon" />
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
                      className="ex-tool-btn plate-calc-tool"
                      onClick={() => {
                        setPlateCalcWeight(firstSetWeight);
                        setShowPlateModal(true);
                      }}
                      title="Open Barbell Plate Calculator"
                      type="button"
                    >
                      <CalculateIcon style={{ fontSize: "1rem" }} />
                      <span>Plates</span>
                    </button>

                    <button
                      className="ex-tool-btn swap-tool"
                      onClick={() => setSwapTargetExercise(exercise)}
                      title="Swap exercise if equipment is busy"
                      type="button"
                    >
                      <SwapHorizIcon style={{ fontSize: "1rem" }} />
                      <span>Swap</span>
                    </button>

                    <button
                      className={`ex-tool-btn notes-tool ${isNotesOpen ? "active" : ""}`}
                      onClick={() =>
                        setOpenNotes((prev) => ({
                          ...prev,
                          [exercise._id]: !prev[exercise._id],
                        }))
                      }
                      title="Add seat/pin height or form cue"
                      type="button"
                    >
                      <NoteAltIcon style={{ fontSize: "1rem" }} />
                    </button>
                  </div>
                </div>

                {/* Optional Expandable Form Cue / Seat Notes */}
                {isNotesOpen && (
                  <div className="exercise-notes-field">
                    <input
                      type="text"
                      placeholder="Form cues or machine pin/seat height (e.g. Pin #4, wide grip)..."
                      value={exerciseNotes[exercise._id] || ""}
                      onChange={(e) =>
                        setExerciseNotes((prev) => ({
                          ...prev,
                          [exercise._id]: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}

                <div className="sets-table">
                  <div className="table-header-row">
                    <span
                      className="col-num clickable-header-guide"
                      onClick={() => setShowLegendModal(true)}
                      title="Click to view Set Types & Tools Guide (N = Normal, W = Warmup, D = Drop Set, F = Failure)"
                    >
                      <span>SET</span>
                      <HelpOutlineIcon className="header-info-icon" />
                    </span>
                    <span className="col-weight">Weight ({weightUnit})</span>
                    <span className="col-reps">Reps</span>
                    <span className="col-check">Done</span>
                  </div>
                  {sets.map((set, idx) => {
                    const tag = set.tag || "N";
                    return (
                      <div key={idx} className={`set-row ${set.completed ? "completed" : ""}`}>
                        <span className="col-num">
                          <span className="set-num-text">#{set.setNum}</span>
                          <button
                            type="button"
                            className={`set-tag-badge tag-${tag.toLowerCase()}`}
                            onClick={() => handleToggleSetTag(exercise._id, idx)}
                            title={`Set Tag: ${tag === "N" ? "Normal" : tag === "W" ? "Warmup" : tag === "D" ? "Drop Set" : "Failure"} (Click to cycle)`}
                            disabled={set.completed}
                          >
                            {tag}
                          </button>
                          {set.isPR && (
                            <span className="pr-celebration-badge" title="All-Time Personal Record!">
                              🏆 PR
                            </span>
                          )}
                        </span>
                        <span className="col-weight">
                          <div className="stepper-input-wrapper">
                            <button
                              type="button"
                              className="step-btn"
                              onClick={() => handleAdjustValue(exercise._id, idx, "weight", -weightStep)}
                              disabled={set.completed}
                            >
                              <RemoveIcon style={{ fontSize: "0.9rem" }} />
                            </button>
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => handleActiveSetChange(exercise._id, idx, "weight", e.target.value)}
                              disabled={set.completed}
                            />
                            <button
                              type="button"
                              className="step-btn"
                              onClick={() => handleAdjustValue(exercise._id, idx, "weight", weightStep)}
                              disabled={set.completed}
                            >
                              <AddIcon style={{ fontSize: "0.9rem" }} />
                            </button>
                          </div>
                        </span>
                        <span className="col-reps">
                          <div className="stepper-input-wrapper">
                            <button
                              type="button"
                              className="step-btn"
                              onClick={() => handleAdjustValue(exercise._id, idx, "reps", -1)}
                              disabled={set.completed}
                            >
                              <RemoveIcon style={{ fontSize: "0.9rem" }} />
                            </button>
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => handleActiveSetChange(exercise._id, idx, "reps", e.target.value)}
                              disabled={set.completed}
                            />
                            <button
                              type="button"
                              className="step-btn"
                              onClick={() => handleAdjustValue(exercise._id, idx, "reps", 1)}
                              disabled={set.completed}
                            >
                              <AddIcon style={{ fontSize: "0.9rem" }} />
                            </button>
                          </div>
                        </span>
                        <span className="col-check">
                          <button
                            className={`set-check-btn ${set.completed ? "checked" : ""}`}
                            onClick={() => handleToggleSetCompleted(exercise._id, idx)}
                            title={set.completed ? "Mark Set Incomplete" : "Complete Set & Start Rest"}
                          >
                            {set.completed ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                          </button>
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="sets-row-controls">
                  <button className="add-set-btn" onClick={() => handleAddActiveSet(exercise._id)}>
                    <AddTwoToneIcon style={{ fontSize: "1.1rem" }} /> Add Set
                  </button>
                  <button className="remove-set-btn" onClick={() => handleRemoveActiveSet(exercise._id)}>
                    <RemoveIcon style={{ fontSize: "1.1rem" }} /> Remove Set
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Sticky Bottom Rest Mode Island */}
        {isRestActive && restTimeLeft > 0 && (
          <div className="floating-rest-island">
            <div className="island-left">
              <HourglassEmptyIcon className={`hourglass-spin ${!isRestPaused ? "active" : ""}`} />
              <div className="island-text-group">
                <span className="island-label">{isRestPaused ? "REST PAUSED" : "REST MODE ACTIVE"}</span>
                <span className="island-time">{formatTime(restTimeLeft)}</span>
              </div>
            </div>

            <div className="island-progress-track">
              <div
                className="island-progress-fill"
                style={{
                  width: `${Math.max(0, Math.min(100, (restTimeLeft / (restDuration || 60)) * 100))}%`,
                }}
              ></div>
            </div>

            <div className="island-actions">
              <button
                className="island-adjust-btn"
                onClick={() => handleAdjustRestTime(15)}
                title="Add 15 seconds"
              >
                +15s
              </button>
              <button
                className="island-pause-btn"
                onClick={() => {
                  if (isRestPaused) {
                    dispatch(activeWorkoutActions.resumeActiveRest());
                  } else {
                    dispatch(activeWorkoutActions.pauseActiveRest());
                  }
                  setIsRestPaused(!isRestPaused);
                }}
                title={isRestPaused ? "Resume Rest" : "Pause Rest"}
              >
                {isRestPaused ? <PlayArrowIcon style={{ fontSize: "1rem" }} /> : <PauseIcon style={{ fontSize: "1rem" }} />}
              </button>
              <button
                className="island-skip-btn"
                onClick={() => {
                  setIsRestActive(false);
                  setRestTimeLeft(0);
                  dispatch(activeWorkoutActions.stopActiveRest());
                }}
                title="Skip Rest"
              >
                <SkipNextIcon style={{ fontSize: "1rem" }} /> Skip
              </button>
            </div>
          </div>
        )}

        {/* Sticky Progress Footer */}
        <div className="active-progress-footer">
          <div className="progress-text-row">
            <span>Overall Session Progress</span>
            <span>{progressPercent}% ({completedSetsCount} / {totalSetsCount} sets completed)</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD ROUTINE OVERVIEW VIEW
  return (
    <div className="workout-page">
      {showConfirmation && (
        <ConfirmationPopup
          title="Delete Workout Routine?"
          message="Are you sure you want to delete this workout routine? This cannot be undone."
          confirmText="Delete Workout"
          cancelText="Cancel"
          onClose={() => setShowConfirmation(false)}
          onDelete={async () => {
            await deleteWorkout(dispatch, id);
            setShowConfirmation(false);
            toast.success("Workout deleted successfully");
            navigate(`/${username}/myworkouts`);
          }}
        />
      )}

      <div className="workout-page-header">
        <span className="workout-page-back-btn" onClick={handleGoBack}>
          <ArrowBackIcon style={{ fontSize: "1.1rem" }} /> Back
        </span>
        <div className="workout-page-actions">
          {isOwner ? (
            <>
              <button
                className={`privacy-toggle-btn ${workoutData?.isPrivate ? "private" : "public"}`}
                onClick={handleTogglePrivacy}
                title={workoutData?.isPrivate ? "Make routine Public to share" : "Routine is Public. Click to make Private."}
              >
                {workoutData?.isPrivate ? <LockIcon style={{ fontSize: "1.1rem" }} /> : <PublicIcon style={{ fontSize: "1.1rem" }} />}
                <span>{workoutData?.isPrivate ? "Private" : "Public"}</span>
              </button>

              {!workoutData?.isPrivate && (
                <button className="workout-share-btn" onClick={handleCopyLink}>
                  <ContentCopyIcon style={{ fontSize: "1.1rem" }} />
                  <span>{copied ? "Copied!" : "Share Link"}</span>
                </button>
              )}

              {workoutData?.exercises?.length > 0 && (
                <button className="start-session-btn" onClick={handleStartSession}>
                  <PlayArrowIcon style={{ fontSize: "1.1rem" }} />
                  <span>Start Workout</span>
                </button>
              )}

              {editMode ? (
                <button
                  onClick={async () => {
                    setEditMode(false);
                    await updateWorkout(dispatch, id, workoutData);
                    await fetchWorkout(dispatch, id);
                    toast.success("Workout updated successfully!");
                  }}
                  title="Save Changes"
                  className="workout-page-save-info-btn"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  title="Edit Title/Description"
                  className="workout-page-edit-btn"
                >
                  <EditIcon style={{ fontSize: "1rem" }} /> Edit
                </button>
              )}
              <button
                onClick={() => setShowConfirmation(true)}
                title="Delete Workout"
                className="workout-page-delete-btn"
              >
                <DeleteTwoToneIcon style={{ fontSize: "1rem" }} /> Delete
              </button>
            </>
          ) : (
            <>
              <button className="workout-share-btn" onClick={handleCopyLink} title="Share Workout Link">
                <ContentCopyIcon style={{ fontSize: "1.1rem" }} />
                <span>{copied ? "Copied!" : "Share Link"}</span>
              </button>

              <button
                className="workout-clone-cta-btn"
                onClick={handleCloneCurrentWorkout}
                disabled={isSavingWorkout}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: isAlreadySaved ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.08)",
                  border: isAlreadySaved ? "1px solid rgba(0, 240, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.15)",
                  color: isAlreadySaved ? "#00f0ff" : "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {isAlreadySaved ? (
                  <BookmarkIcon style={{ fontSize: "1.1rem", color: "#00f0ff" }} />
                ) : (
                  <BookmarkBorderIcon style={{ fontSize: "1.1rem" }} />
                )}
                <span>{isAlreadySaved ? "Saved in Library" : "Save to My Workouts"}</span>
              </button>

              {workoutData?.exercises?.length > 0 && (
                <button className="start-session-btn" onClick={handleStartSession}>
                  <PlayArrowIcon style={{ fontSize: "1.1rem" }} />
                  <span>Start Workout</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="workout-page-meta">
        {editMode ? (
          <input
            name="name"
            value={workoutData?.name || ""}
            onChange={(e) => handleChange(e)}
            className="workout-page-title-input"
            placeholder="Workout Name"
          />
        ) : (
          <h1 className="workout-page-title">{workoutData?.name}</h1>
        )}
        <div className="workout-page-stats-badge">
          <span>{workoutData?.exercises?.length || 0}</span> Exercises Included
        </div>
      </div>

      <div className="workout-page-description">
        <h3 className="description-heading">Overview & Guidelines</h3>
        {editMode ? (
          <>
            <textarea
              name="description"
              ref={textareaRef}
              maxLength={WORKOUT_DESCRIPTION_MAX_LENGTH}
              value={workoutData?.description || ""}
              onChange={(e) => handleChange(e)}
              placeholder="Provide a description or guidelines for this workout..."
              className="workout-page-content-input"
            />
            <div className="workout-description-count">
              {(workoutData?.description || "").length} / {WORKOUT_DESCRIPTION_MAX_LENGTH}
            </div>
          </>
        ) : (
          <div className="workout-page-content">
            {workoutData?.description ? (
              renderFormattedDescription(workoutData?.description)
            ) : (
              <p className="empty-description-placeholder">
                No description provided. Click edit to add guidelines.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="workout-page-exercises-section">
        <div className="exercises-section-header">
          <h2 className="exercises-section-title">Workout Routine</h2>
          <span className="exercises-limit-badge">
            {workoutData?.exercises?.length || 0} / 10 Exercises
          </span>
        </div>
        {workoutData?.exercises?.length > 0 ? (
          <div className="workout-page-exercises-container">
            {workoutData?.exercises?.map((exercise) => {
              const target = plannedTargets[exercise._id] || {};
              const setsCount = Number(target.setsCount) || 3;
              const prev = previousSessionStats[exercise._id] || previousSessionStats[(exercise.name || "").toLowerCase().trim()];
              const plannedWeight = target.weight !== undefined ? target.weight : (prev?.weight !== undefined ? prev.weight : defaultExerciseWeight);
              const plannedReps = target.reps !== undefined ? target.reps : (prev?.reps !== undefined ? prev.reps : 10);

              return (
                <div key={exercise._id} className="overview-exercise-item-wrapper">
                  <ExerciseCard
                    animation={isOwner}
                    removeBtn={isOwner}
                    exerciseData={exercise}
                  />
                  <div className="exercise-plan-config-bar">
                    <div className="config-item">
                      <span className="config-label">SETS</span>
                      <div className="config-counter">
                        <button
                          type="button"
                          onClick={() => handleUpdatePlannedTarget(exercise._id, "setsCount", Math.max(setsCount - 1, 1))}
                          className="counter-btn"
                          title="Decrease Planned Sets"
                        >
                          -
                        </button>
                        <span className="counter-val">{setsCount}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdatePlannedTarget(exercise._id, "setsCount", Math.min(setsCount + 1, 10))}
                          className="counter-btn"
                          title="Increase Planned Sets"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="config-item">
                      <span className="config-label">TARGET WT</span>
                      <div className="config-input-group">
                        <input
                          type="number"
                          value={plannedWeight}
                          onChange={(e) => handleUpdatePlannedTarget(exercise._id, "weight", e.target.value)}
                          className="config-input"
                          min="0"
                          step="2.5"
                          placeholder="0"
                        />
                        <span className="config-unit">{weightUnit}</span>
                      </div>
                    </div>

                    <div className="config-item">
                      <span className="config-label">TARGET REPS</span>
                      <div className="config-input-group">
                        <input
                          type="number"
                          value={plannedReps}
                          onChange={(e) => handleUpdatePlannedTarget(exercise._id, "reps", e.target.value)}
                          className="config-input"
                          min="1"
                          max="100"
                          placeholder="10"
                        />
                        <span className="config-unit">reps</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {isOwner && workoutData?.exercises?.length < 10 && (
              <div
                className="workout-page-add-exercise-placeholder-card"
                onClick={() => navigate("/exercises/all")}
              >
                <AddTwoToneIcon className="add-placeholder-icon" />
                <span className="add-placeholder-text">Add More Exercises</span>
                <span className="add-placeholder-slots">
                  ({10 - (workoutData?.exercises?.length || 0)} slots available)
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-exercises-state">
            <p>No exercises in this workout routine yet.</p>
            {isOwner && (
              <button className="browse-exercises-btn" onClick={() => navigate("/exercises/all")}>
                Explore & Add Exercises
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;
