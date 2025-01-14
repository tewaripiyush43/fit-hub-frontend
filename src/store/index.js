import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, user: {} },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    setUser(state, action) {
      state.user = action.payload;
      // console.log("user from state ", state.user);
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
});
