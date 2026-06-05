import api from "./client";
import { authActions, portalActions } from "../store/index";
import { setAccessToken, clearAccessToken } from "../utils/tokenService";

export const getUser = async (dispatch) => {
  try {
    const response = await api.get("/auth/private");
    const { data } = response;
    const { user, accessToken: newAccessToken } = data;
    dispatch(authActions.setUser(user));
    dispatch(authActions.login());
    if (newAccessToken) {
      setAccessToken(newAccessToken);
    }
    dispatch(portalActions.setPortalClose());
  } catch (error) {
    dispatch(authActions.setUser({}));
    dispatch(authActions.logout());
    clearAccessToken();
  }
};

export const login = async (dispatch, inputs) => {
  const response = await api.post("/auth/login", {
    emailOrUsername: inputs.emailOrUsername.toLocaleLowerCase(),
    password: inputs.password,
  });
  const { data } = response;
  setAccessToken(data.accessToken);
  dispatch(authActions.login());
  dispatch(authActions.setUser(data.user));
  dispatch(portalActions.setPortalClose());
  return data;
};

export const register = async (dispatch, inputs) => {
  const response = await api.post("/auth/register", {
    username: inputs.username.toLocaleLowerCase(),
    email: inputs.email.toLowerCase(),
    password: inputs.password,
  });
  const { data } = response;
  setAccessToken(data.accessToken);
  dispatch(authActions.login());
  dispatch(authActions.setUser(data.user));
  dispatch(portalActions.setPortalClose());
  return data;
};

export const logout = async (dispatch) => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.clear();
    clearAccessToken();
    dispatch(authActions.logout());
    dispatch(authActions.setUser({}));
  }
};

export const deleteAccount = async (dispatch) => {
  try {
    await api.delete("/auth/delete");
  } finally {
    localStorage.clear();
    clearAccessToken();
    dispatch(authActions.logout());
    dispatch(authActions.setUser({}));
  }
};
