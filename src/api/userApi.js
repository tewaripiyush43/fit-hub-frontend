import api from "./client";
import { authActions } from "../store/index";

export const logWorkoutSession = async (dispatch, payload) => {
  const res = await api.post("/user/log-session", payload);
  if (res.status === 200) {
    dispatch(authActions.setUser(res.data));
  }
  return res.data;
};

export const addToFavorites = async (dispatch, exerciseId) => {
  const res = await api.put(`/user/addToFavorites/${exerciseId}`, {});
  if (res.status === 201) {
    dispatch(authActions.setUser(res.data.user));
  }
  return res.data;
};

export const removeFromFavorites = async (dispatch, exerciseId) => {
  const res = await api.put(`/user/removeFromFavorites/${exerciseId}`, {});
  if (res.status === 201) {
    dispatch(authActions.setUser(res.data.user));
  }
  return res.data;
};

export const updateUserInfo = async (dispatch, profileInfo) => {
  const res = await api.put("/user/updateUserInfo", profileInfo);
  dispatch(authActions.setUser(res.data));
  return res.data;
};

export const clearSessionHistory = async (dispatch) => {
  const res = await api.post("/user/clear-session-history", {});
  if (res.status === 200) {
    dispatch(authActions.setUser(res.data));
  }
  return res.data;
};

export const updatePRs = async (dispatch, prs) => {
  const res = await api.put("/user/update-prs", { prs });
  if (res.status === 200) {
    dispatch(authActions.setUser(res.data));
  }
  return res.data;
};
