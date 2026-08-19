import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { activeWorkoutActions, selectActiveWorkout } from "../store";
import {
  sendWorkoutNotification,
  updateDocumentTitle,
  restoreDocumentTitle,
  requestNotificationPermission,
} from "../utils/workoutNotificationService";
import { playRestCompleteSound } from "../utils/audioFeedback";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CloseIcon from "@mui/icons-material/Close";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import ConfirmationPopup from "./ConfirmationPopUp";
import "../styles/_activeWorkoutBanner.scss";

const formatStopwatch = (totalSecs) => {
  const s = Math.max(0, Number(totalSecs) || 0);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const ActiveWorkoutTopBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const activeWorkout = useSelector(selectActiveWorkout);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Check if currently viewing any workout page or active session
  const isCurrentlyInSession = Boolean(
    location.pathname.includes("/workout/") ||
    location.pathname.includes("/myworkouts/") ||
    location.pathname.endsWith("/session") ||
    (activeWorkout?.workoutId && location.pathname.includes(activeWorkout.workoutId))
  );

  const shouldShowBanner = Boolean(activeWorkout?.isActive && !isCurrentlyInSession);

  // Manage body offset class to prevent navbar overlap
  useEffect(() => {
    if (shouldShowBanner) {
      document.body.classList.add("has-active-workout-banner");
    } else {
      document.body.classList.remove("has-active-workout-banner");
    }
    return () => {
      document.body.classList.remove("has-active-workout-banner");
    };
  }, [shouldShowBanner]);

  // Real-time Cross-Tab Active Workout Synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "fithub_active_session") {
        if (!e.newValue) {
          dispatch(activeWorkoutActions.syncFromStorage(null));
        } else {
          try {
            const parsed = JSON.parse(e.newValue);
            dispatch(activeWorkoutActions.syncFromStorage(parsed));
          } catch (err) {
            console.error("Failed to parse synced active session:", err);
          }
        }
      }
    };

    const handleWindowFocus = () => {
      // Re-verify localStorage state on tab switch
      const stored = localStorage.getItem("fithub_active_session");
      if (!stored && activeWorkout?.isActive) {
        dispatch(activeWorkoutActions.syncFromStorage(null));
      } else if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.isActive !== activeWorkout?.isActive || parsed.workoutId !== activeWorkout?.workoutId) {
            dispatch(activeWorkoutActions.syncFromStorage(parsed));
          }
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [dispatch, activeWorkout?.isActive, activeWorkout?.workoutId]);

  // Global background ticking for Stopwatch and Rest Timer
  useEffect(() => {
    if (!activeWorkout?.isActive) {
      restoreDocumentTitle();
      return;
    }

    // Request notification permission once session starts
    requestNotificationPermission();

    const interval = setInterval(() => {
      dispatch(activeWorkoutActions.tickActiveSeconds());

      if (activeWorkout.restTimer?.isRestActive && !activeWorkout.restTimer?.isRestPaused) {
        dispatch(activeWorkoutActions.tickActiveRest());

        // Check if rest just completed
        if (activeWorkout.restTimer.restTimeLeft <= 1) {
          playRestCompleteSound();
          sendWorkoutNotification("💪 Rest Complete!", {
            body: `Time for your next set in "${activeWorkout.workoutName}"!`,
            url: `/workout/${activeWorkout.workoutId}/session`,
          });
        }
      }

      // Update browser tab document title
      if (activeWorkout.restTimer?.isRestActive && activeWorkout.restTimer.restTimeLeft > 0) {
        updateDocumentTitle(`[⏳ ${formatStopwatch(activeWorkout.restTimer.restTimeLeft)} Rest] ${activeWorkout.workoutName}`);
      } else {
        updateDocumentTitle(`[${formatStopwatch(activeWorkout.elapsedSeconds)}] ⚡ ${activeWorkout.workoutName}`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activeWorkout?.isActive, activeWorkout?.restTimer?.isRestActive, activeWorkout?.restTimer?.isRestPaused, activeWorkout?.restTimer?.restTimeLeft, activeWorkout?.elapsedSeconds, activeWorkout?.workoutName, activeWorkout?.workoutId, dispatch]);

  if (!activeWorkout?.isActive || isCurrentlyInSession) {
    return null;
  }

  // Calculate completed sets across all exercises
  let completedSetsCount = 0;
  let totalSetsCount = 0;
  Object.values(activeWorkout.sessionExercises || {}).forEach((sets) => {
    if (Array.isArray(sets)) {
      totalSetsCount += sets.length;
      completedSetsCount += sets.filter((s) => s.completed).length;
    }
  });

  const handleResumeWorkout = () => {
    navigate(`/workout/${activeWorkout.workoutId}/session`);
  };

  const handleDiscard = () => {
    dispatch(activeWorkoutActions.discardActiveWorkout());
    setShowDiscardConfirm(false);
    restoreDocumentTitle();
  };

  return (
    <>
      {showDiscardConfirm && (
        <ConfirmationPopup
          title="Discard Active Workout?"
          message="Are you sure you want to stop this workout session? Your logged sets for this session will be discarded."
          confirmText="Discard Session"
          cancelText="Keep Training"
          onClose={() => setShowDiscardConfirm(false)}
          onDelete={handleDiscard}
        />
      )}

      <div className="active-workout-top-banner" onClick={handleResumeWorkout}>
        <div className="banner-left">
          <div className="live-pulse-container">
            <span className="live-pulse-dot"></span>
            <WhatshotIcon className="live-flame-icon" />
          </div>

          <div className="workout-meta-group">
            <span className="banner-workout-title">{activeWorkout.workoutName}</span>
            <span className="banner-status-tag">In Progress</span>
          </div>
        </div>

        <div className="banner-center">
          <div className="stopwatch-pill">
            <span className="stopwatch-label">SESSION:</span>
            <span className="stopwatch-time">{formatStopwatch(activeWorkout.elapsedSeconds)}</span>
          </div>

          {activeWorkout.restTimer?.isRestActive && activeWorkout.restTimer.restTimeLeft > 0 && (
            <div className="rest-timer-pill active">
              <HourglassEmptyIcon className="rest-icon spin" />
              <span>REST {formatStopwatch(activeWorkout.restTimer.restTimeLeft)}</span>
            </div>
          )}

          {totalSetsCount > 0 && (
            <div className="sets-counter-pill">
              <CheckCircleIcon className="check-icon" />
              <span>{completedSetsCount} / {totalSetsCount} sets</span>
            </div>
          )}
        </div>

        <div className="banner-right" onClick={(e) => e.stopPropagation()}>
          <button className="resume-workout-btn" onClick={handleResumeWorkout}>
            <PlayArrowIcon style={{ fontSize: "1.1rem" }} />
            <span>Resume Workout</span>
          </button>

          <button
            className="discard-workout-btn"
            onClick={() => setShowDiscardConfirm(true)}
            title="Discard Session"
          >
            <CloseIcon style={{ fontSize: "1rem" }} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ActiveWorkoutTopBanner;
