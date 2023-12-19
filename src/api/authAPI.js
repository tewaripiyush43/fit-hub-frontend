import axios from "axios";
import { authActions, portalActions } from "../store/index";

let isRefreshing = false;
let refreshPromise = null;

export const getUser = async (dispatch, REACT_APP_BASE_URL) => {
  try {
    const accessToken = localStorage.accessToken;
    if (!accessToken) {
      throw new Error("Access token not found");
    }
    console.log(accessToken);

    const response = await axios.get(`${REACT_APP_BASE_URL}/auth/private`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    const { data } = response;
    const status = data.error?.status;
    console.log(data, status);
    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = handleTokenRefresh(dispatch, REACT_APP_BASE_URL);
      }

      await refreshPromise;
      isRefreshing = false;
      await getUser(dispatch, REACT_APP_BASE_URL);
    } else if (status === 404) {
      dispatch(authActions.setUser({}));
      dispatch(authActions.logout());
    } else {
      const { user, accessToken } = data;
      dispatch(authActions.setUser(user));
      dispatch(authActions.login());
      dispatch(portalActions.setPortalClose());
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const handleTokenRefresh = async (dispatch, REACT_APP_BASE_URL) => {
  try {
    const response = await axios.post(
      `${REACT_APP_BASE_URL}/auth/refreshToken`,
      {},
      {
        withCredentials: true,
      }
    );

    const { data } = response;
    const status = data.error?.status;
    if (status === 400 || status === 401) {
      if (localStorage.accessToken) delete localStorage.accessToken;
      dispatch(authActions.setUser({}));
      dispatch(authActions.logout());
      throw new Error("Token refresh failed");
    } else {
      console.log(data);
      localStorage.setItem("accessToken", data.accessToken);
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Handle the error or remove the token if needed
    // delete localStorage.accessToken;
    throw error;
  }
};
