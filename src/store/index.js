import { configureStore, createSlice } from "@reduxjs/toolkit";
import { clearAccessToken } from "../utils/tokenService";

const persistUserToStorage = (user) => {
  try {
    if (user && user._id) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
    }
  } catch (e) {
    console.error("Failed to persist user to localStorage:", e);
  }
};

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && parsed._id ? parsed : null;
  } catch (e) {
    return null;
  }
};

const initialUser = getInitialUser();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: Boolean(localStorage.getItem("isLoggedIn") === "true" && initialUser),
    user: initialUser,
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", "true");
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sidebar-pinned");
      localStorage.removeItem("fithub_active_session");
      localStorage.removeItem("fithub_body_metrics_history");
      localStorage.removeItem("fithub_bmi_height");
      localStorage.removeItem("fithub_bmi_weight");
      localStorage.removeItem("fithub_bmi_age");
      localStorage.removeItem("fithub_bmi_gender");
      clearAccessToken();
    },
    setUser(state, action) {
      const u = action.payload;
      if (u === undefined) return;
      state.user = u && typeof u === "object" && u._id ? u : null;
      if (state.user) {
        state.isLoggedIn = true;
      }
      persistUserToStorage(state.user);
    },
    updateSettings(state, action) {
      if (!state.user) state.user = {};
      state.user.settings = {
        ...(state.user.settings || {}),
        ...action.payload,
      };
      persistUserToStorage(state.user);
    },
    setBodyMetrics(state, action) {
      if (!state.user) state.user = {};
      state.user.bodyMetrics = action.payload || [];
      persistUserToStorage(state.user);
    },
    addBodyMetric(state, action) {
      if (!state.user) state.user = {};
      if (!state.user.bodyMetrics) state.user.bodyMetrics = [];

      const newEntry = {
        ...action.payload,
        timestamp: action.payload.timestamp || Date.now(),
        id: action.payload.id || action.payload._id || Date.now().toString(),
      };

      state.user.bodyMetrics.push(newEntry);

      state.user.bodyMetrics.sort(
        (a, b) => (a.timestamp || new Date(a.date).getTime()) - (b.timestamp || new Date(b.date).getTime())
      );

      if (newEntry.weight) state.user.weight = newEntry.weight;
      if (newEntry.height) state.user.height = newEntry.height;

      persistUserToStorage(state.user);
    },
    deleteBodyMetric(state, action) {
      if (!state.user || !state.user.bodyMetrics) return;
      const idToDelete = action.payload;
      state.user.bodyMetrics = state.user.bodyMetrics.filter(
        (m) => m._id !== idToDelete && m.id !== idToDelete
      );
      persistUserToStorage(state.user);
    },
    updatePRs(state, action) {
      if (!state.user) state.user = {};
      state.user.prs = action.payload;
      persistUserToStorage(state.user);
    },
    updateSessionHistory(state, action) {
      if (!state.user) state.user = {};
      const { sessionHistory, streak } = action.payload;
      if (sessionHistory !== undefined) state.user.sessionHistory = sessionHistory;
      if (streak !== undefined) state.user.streak = streak;
      persistUserToStorage(state.user);
    },
    updateFavorites(state, action) {
      if (!state.user) state.user = {};
      state.user.favoriteExercises = action.payload;
      persistUserToStorage(state.user);
    },
    updateWorkouts(state, action) {
      if (!state.user) state.user = {};
      state.user.workouts = action.payload;
      persistUserToStorage(state.user);
    },
    updateGoals(state, action) {
      if (!state.user) state.user = {};
      state.user.goals = action.payload;
      persistUserToStorage(state.user);
    },
  },
});

const portalSlice = createSlice({
  name: "portal",
  initialState: {
    isPortalOpen: false,
    portalType: "Login",
  },
  reducers: {
    setPortalOpen(state) {
      document.documentElement.classList.add("modal-open");
      state.isPortalOpen = true;
    },
    setPortalClose(state) {
      document.documentElement.classList.remove("modal-open");
      state.isPortalOpen = false;
    },
    setPortalTypeLogin(state) {
      state.portalType = "Login";
    },
    setPortalTypeSignup(state) {
      state.portalType = "Signup";
    },
    setPortalTypeForgotPassword(state) {
      state.portalType = "ForgotPassword";
    },
  },
});

const workoutSlice = createSlice({
  name: "workout",
  initialState: { workoutData: {} },
  reducers: {
    setWorkoutData(state, action) {
      state.workoutData = action.payload;
    },
  },
});

const loadPersistedActiveSession = () => {
  try {
    const raw = localStorage.getItem("fithub_active_session");
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.isActive && data.workoutId) {
        // Calculate real elapsed time from start timestamp
        if (data.startTimestamp) {
          const now = Date.now();
          data.elapsedSeconds = Math.max(0, Math.floor((now - data.startTimestamp) / 1000));
        }
        // Calculate remaining rest timer if active
        if (data.restTimer?.isRestActive && data.restTimer?.restEndTime) {
          const timeLeft = Math.max(0, Math.round((data.restTimer.restEndTime - Date.now()) / 1000));
          data.restTimer.restTimeLeft = timeLeft;
          if (timeLeft <= 0) {
            data.restTimer.isRestActive = false;
          }
        }
        return data;
      }
    }
  } catch (e) {
    console.error("Failed to load active session from localStorage:", e);
  }
  return {
    isActive: false,
    workoutId: null,
    workoutName: "",
    startTimestamp: null,
    elapsedSeconds: 0,
    sessionExercises: {},
    restTimer: {
      isRestActive: false,
      restStartTime: null,
      restEndTime: null,
      restDuration: 60,
      restTimeLeft: 0,
      isRestPaused: false,
    },
    exerciseNotes: {},
  };
};

const persistActiveSession = (state) => {
  try {
    if (state.isActive) {
      localStorage.setItem("fithub_active_session", JSON.stringify(state));
    } else {
      localStorage.removeItem("fithub_active_session");
    }
  } catch (e) {
    console.error("Failed to persist active session:", e);
  }
};

const activeWorkoutSlice = createSlice({
  name: "activeWorkout",
  initialState: loadPersistedActiveSession(),
  reducers: {
    startActiveWorkout(state, action) {
      const { workoutId, workoutName, sessionExercises, restDuration = 60, exerciseNotes = {} } = action.payload;
      state.isActive = true;
      state.workoutId = workoutId;
      state.workoutName = workoutName || "Active Workout";
      state.startTimestamp = Date.now();
      state.elapsedSeconds = 0;
      state.sessionExercises = sessionExercises || {};
      state.exerciseNotes = exerciseNotes || {};
      state.restTimer = {
        isRestActive: false,
        restStartTime: null,
        restEndTime: null,
        restDuration: restDuration,
        restTimeLeft: 0,
        isRestPaused: false,
      };
      persistActiveSession(state);
    },
    updateActiveExercises(state, action) {
      state.sessionExercises = action.payload;
      persistActiveSession(state);
    },
    updateActiveNotes(state, action) {
      state.exerciseNotes = action.payload;
      persistActiveSession(state);
    },
    tickActiveSeconds(state) {
      if (state.isActive && state.startTimestamp) {
        state.elapsedSeconds = Math.max(0, Math.floor((Date.now() - state.startTimestamp) / 1000));
        persistActiveSession(state);
      }
    },
    startActiveRest(state, action) {
      const duration = Number(action.payload) || state.restTimer.restDuration || 60;
      const now = Date.now();
      state.restTimer = {
        isRestActive: true,
        restStartTime: now,
        restEndTime: now + duration * 1000,
        restDuration: duration,
        restTimeLeft: duration,
        isRestPaused: false,
      };
      persistActiveSession(state);
    },
    tickActiveRest(state) {
      if (state.restTimer?.isRestActive && !state.restTimer?.isRestPaused && state.restTimer?.restEndTime) {
        const remaining = Math.max(0, Math.round((state.restTimer.restEndTime - Date.now()) / 1000));
        state.restTimer.restTimeLeft = remaining;
        if (remaining <= 0) {
          state.restTimer.isRestActive = false;
        }
        persistActiveSession(state);
      }
    },
    pauseActiveRest(state) {
      if (state.restTimer?.isRestActive) {
        state.restTimer.isRestPaused = true;
        persistActiveSession(state);
      }
    },
    resumeActiveRest(state) {
      if (state.restTimer?.isRestActive && state.restTimer?.isRestPaused) {
        state.restTimer.isRestPaused = false;
        state.restTimer.restEndTime = Date.now() + state.restTimer.restTimeLeft * 1000;
        persistActiveSession(state);
      }
    },
    stopActiveRest(state) {
      state.restTimer.isRestActive = false;
      state.restTimer.restTimeLeft = 0;
      state.restTimer.isRestPaused = false;
      persistActiveSession(state);
    },
    updateActiveRestDuration(state, action) {
      state.restTimer.restDuration = action.payload;
      persistActiveSession(state);
    },
    completeActiveWorkout(state) {
      state.isActive = false;
      state.workoutId = null;
      state.workoutName = "";
      state.startTimestamp = null;
      state.elapsedSeconds = 0;
      state.sessionExercises = {};
      state.exerciseNotes = {};
      state.restTimer = {
        isRestActive: false,
        restStartTime: null,
        restEndTime: null,
        restDuration: 60,
        restTimeLeft: 0,
        isRestPaused: false,
      };
      persistActiveSession(state);
    },
    discardActiveWorkout(state) {
      state.isActive = false;
      state.workoutId = null;
      state.workoutName = "";
      state.startTimestamp = null;
      state.elapsedSeconds = 0;
      state.sessionExercises = {};
      state.exerciseNotes = {};
      state.restTimer = {
        isRestActive: false,
        restStartTime: null,
        restEndTime: null,
        restDuration: 60,
        restTimeLeft: 0,
        isRestPaused: false,
      };
      persistActiveSession(state);
    },
    syncFromStorage(state, action) {
      if (action.payload) {
        return {
          ...state,
          ...action.payload,
        };
      }
      return {
        isActive: false,
        workoutId: null,
        workoutName: "",
        startTimestamp: null,
        elapsedSeconds: 0,
        sessionExercises: {},
        restTimer: {
          isRestActive: false,
          restStartTime: null,
          restEndTime: null,
          restDuration: 60,
          restTimeLeft: 0,
          isRestPaused: false,
        },
        exerciseNotes: {},
      };
    },
  },
});

export const authActions = authSlice.actions;
export const portalActions = portalSlice.actions;
export const workoutActions = workoutSlice.actions;
export const activeWorkoutActions = activeWorkoutSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUserSettings = (state) => state.auth.user?.settings || {};
export const selectBodyMetrics = (state) => state.auth.user?.bodyMetrics || [];
export const selectPRs = (state) => state.auth.user?.prs || [];
export const selectSessionHistory = (state) => state.auth.user?.sessionHistory || [];
export const selectStreak = (state) => state.auth.user?.streak || 0;
export const selectUserWorkouts = (state) => state.auth.user?.workouts || [];
export const selectUserGoals = (state) => state.auth.user?.goals || [];
export const selectUserFavorites = (state) => state.auth.user?.favoriteExercises || [];
export const selectActiveWorkout = (state) => state.activeWorkout;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    portal: portalSlice.reducer,
    workout: workoutSlice.reducer,
    activeWorkout: activeWorkoutSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
