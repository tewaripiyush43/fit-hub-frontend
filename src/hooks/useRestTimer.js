import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeWorkoutActions, selectActiveWorkout } from "../store/index";
import { playGymTimerChime } from "../utils/gymExperienceUtils";
import { toast } from "../helpers/errorPopUp";

/**
 * Custom hook to manage active gym rest intervals, countdown ticks,
 * audio chime triggers, and Redux active session sync.
 */
export const useRestTimer = () => {
  const dispatch = useDispatch();
  const globalActiveWorkout = useSelector(selectActiveWorkout);

  const [restDuration, setRestDuration] = useState(
    globalActiveWorkout?.restTimer?.restDuration || 60
  );
  const [restTimeLeft, setRestTimeLeft] = useState(
    globalActiveWorkout?.restTimer?.restTimeLeft || 0
  );
  const [isRestActive, setIsRestActive] = useState(
    Boolean(globalActiveWorkout?.restTimer?.isRestActive)
  );
  const [isRestPaused, setIsRestPaused] = useState(
    Boolean(globalActiveWorkout?.restTimer?.isRestPaused)
  );
  const [restBannerNotice, setRestBannerNotice] = useState(false);
  const [showCustomRestModal, setShowCustomRestModal] = useState(false);
  const [customRestMins, setCustomRestMins] = useState("1");
  const [customRestSecs, setCustomRestSecs] = useState("0");

  const timerRef = useRef(null);

  // Sync rest timer state into global Redux active session
  useEffect(() => {
    dispatch(
      activeWorkoutActions.updateActiveRestTimer({
        isRestActive,
        isRestPaused,
        restDuration,
        restTimeLeft,
      })
    );
  }, [dispatch, isRestActive, isRestPaused, restDuration, restTimeLeft]);

  // Rest Timer countdown interval
  useEffect(() => {
    if (isRestActive && !isRestPaused && restTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRestActive(false);
            dispatch(activeWorkoutActions.stopActiveRest());
            playGymTimerChime();
            setRestBannerNotice(true);
            setTimeout(() => setRestBannerNotice(false), 5000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dispatch, isRestActive, isRestPaused, restTimeLeft]);

  const startRest = useCallback(
    (durationOverride) => {
      const dur = durationOverride || restDuration || 60;
      setRestDuration(dur);
      setRestTimeLeft(dur);
      setIsRestActive(true);
      setIsRestPaused(false);
      setRestBannerNotice(false);
      dispatch(activeWorkoutActions.startActiveRest(dur));
    },
    [dispatch, restDuration]
  );

  const pauseRest = useCallback(() => {
    setIsRestPaused(true);
    dispatch(activeWorkoutActions.pauseActiveRest());
  }, [dispatch]);

  const resumeRest = useCallback(() => {
    setIsRestPaused(false);
    dispatch(activeWorkoutActions.resumeActiveRest());
  }, [dispatch]);

  const togglePauseRest = useCallback(() => {
    if (isRestPaused) {
      resumeRest();
    } else {
      pauseRest();
    }
  }, [isRestPaused, pauseRest, resumeRest]);

  const skipRest = useCallback(() => {
    setIsRestActive(false);
    setRestTimeLeft(0);
    dispatch(activeWorkoutActions.stopActiveRest());
  }, [dispatch]);

  const adjustRestTime = useCallback(
    (secondsDelta) => {
      setRestTimeLeft((prev) => {
        const next = Math.max(0, prev + secondsDelta);
        if (next === 0) {
          setIsRestActive(false);
          dispatch(activeWorkoutActions.stopActiveRest());
        }
        return next;
      });
      toast.info(
        `${secondsDelta > 0 ? `+${secondsDelta}` : secondsDelta}s adjusted to rest timer`,
        { autoClose: 1200 }
      );
    },
    [dispatch]
  );

  const applyCustomRest = useCallback(
    (totalSecs) => {
      const validSecs = Math.max(5, Math.min(600, totalSecs));
      setRestDuration(validSecs);
      if (isRestActive) {
        setRestTimeLeft(validSecs);
      }
      setShowCustomRestModal(false);
      toast.success(
        `Rest timer preset set to ${Math.floor(validSecs / 60)}m ${validSecs % 60}s`
      );
    },
    [isRestActive]
  );

  return {
    restDuration,
    setRestDuration,
    restTimeLeft,
    setRestTimeLeft,
    isRestActive,
    setIsRestActive,
    isRestPaused,
    setIsRestPaused,
    restBannerNotice,
    showCustomRestModal,
    setShowCustomRestModal,
    customRestMins,
    setCustomRestMins,
    customRestSecs,
    setCustomRestSecs,
    startRest,
    pauseRest,
    resumeRest,
    togglePauseRest,
    skipRest,
    adjustRestTime,
    applyCustomRest,
  };
};
