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
      console.log("user from state ", state.user);
    },
  },
});

const portalSlice = createSlice({
  name: "portal",
  initialState: { isPortalOpen: false, isPortalTypeLogin: true },
  reducers: {
    openPortal(state) {
      state.isPortalOpen = true;
    },
    closePortal(state) {
      state.isPortalOpen = false;
    },
    loginPortal(state) {
      state.isPortalTypeLogin = true;
    },
    signupPortal(state) {
      state.isPortalTypeLogin = false;
    },
  },
});

export const authActions = authSlice.actions;
export const portalActions = portalSlice.actions;

export const store = configureStore({
  //create reducers
  reducer: {
    auth: authSlice.reducer,
    portal: portalSlice.reducer,
  },
});
