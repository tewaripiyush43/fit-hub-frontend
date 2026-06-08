import { configureStore, createSlice } from "@reduxjs/toolkit";
import { clearAccessToken } from "../utils/tokenService";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "{}");
      } catch (e) {
        return {};
      }
    })(),
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", "true");
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = {};
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sidebar-pinned");
      clearAccessToken();
    },
    setUser(state, action) {
      state.user = action.payload;
      if (action.payload && Object.keys(action.payload).length > 0) {
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("isLoggedIn", "true");
      } else {
        localStorage.removeItem("user");
      }
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

export const authActions = authSlice.actions;
export const portalActions = portalSlice.actions;
export const workoutActions = workoutSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    portal: portalSlice.reducer,
    workout: workoutSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
