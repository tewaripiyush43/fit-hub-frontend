import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/index";
import { updateUserSettings } from "../api/userApi";

const STORAGE_KEY = "fithub_unit_preference";

export const getStoredUnitSystem = () => {
  if (typeof window === "undefined") return "metric";
  return localStorage.getItem(STORAGE_KEY) || "metric";
};

export const setStoredUnitSystem = (unitSystem) => {
  if (typeof window === "undefined") return;
  const cleanUnit = unitSystem === "imperial" ? "imperial" : "metric";
  localStorage.setItem(STORAGE_KEY, cleanUnit);
  window.dispatchEvent(new Event("fithub_prefs_changed"));
};

/**
 * Custom React Hook for globally centralized measurement preferences
 * Syncs seamlessly with Redux store and Backend Database when authenticated.
 */
export const useUnitPreference = () => {
  const dispatch = useDispatch();
  const reduxUnit = useSelector((state) => state.auth.user?.settings?.unitPreference);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [unitSystem, setUnitSystemState] = useState(() => reduxUnit || getStoredUnitSystem());

  useEffect(() => {
    if (reduxUnit && reduxUnit !== unitSystem) {
      setUnitSystemState(reduxUnit);
      setStoredUnitSystem(reduxUnit);
    }
  }, [reduxUnit, unitSystem]);

  const syncPreference = useCallback(() => {
    setUnitSystemState(reduxUnit || getStoredUnitSystem());
  }, [reduxUnit]);

  useEffect(() => {
    window.addEventListener("fithub_prefs_changed", syncPreference);
    window.addEventListener("storage", syncPreference);
    return () => {
      window.removeEventListener("fithub_prefs_changed", syncPreference);
      window.removeEventListener("storage", syncPreference);
    };
  }, [syncPreference]);

  const setUnitSystem = useCallback(
    async (newSystem) => {
      const cleanUnit = newSystem === "imperial" ? "imperial" : "metric";
      setStoredUnitSystem(cleanUnit);
      setUnitSystemState(cleanUnit);

      dispatch(authActions.updateSettings({ unitPreference: cleanUnit }));

      if (isLoggedIn) {
        try {
          await updateUserSettings(dispatch, { unitPreference: cleanUnit });
        } catch (err) {
          console.error("Failed to sync unit preference to DB:", err);
        }
      }
    },
    [dispatch, isLoggedIn]
  );

  const isMetric = unitSystem === "metric";
  const weightUnit = isMetric ? "kg" : "lbs";
  const heightUnit = isMetric ? "cm" : "in";
  const distanceUnit = isMetric ? "km" : "mi";
  const weightStep = isMetric ? 2.5 : 5;
  const defaultExerciseWeight = isMetric ? 60 : 135;

  const formatWeight = (val) => `${val || 0} ${weightUnit}`;
  const formatVolume = (val) => `${(val || 0).toLocaleString()} ${weightUnit}`;

  return {
    unitSystem,
    setUnitSystem,
    isMetric,
    weightUnit,
    heightUnit,
    distanceUnit,
    weightStep,
    defaultExerciseWeight,
    formatWeight,
    formatVolume,
  };
};

export default useUnitPreference;
