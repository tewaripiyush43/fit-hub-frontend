import axios from "axios";
import { authActions, portalActions, workoutActions } from "../store/index";

export const addWorkout = async (dispatch, workoutName, REACT_APP_BASE_URL) => {
  try {
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.post(
      `${REACT_APP_BASE_URL}/workout/create`,
      { name: workoutName },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data, status } = response;
    if (data?.error?.status === 401) {
      window.location.reload();
      throw new Error("Unauthorized");
    }
    // console.log(response);
    console.log(data.user, status);
    if (status === 201) {
      dispatch(authActions.setUser(data.user));
      console.log(data.workoutId);
      return data.workoutId;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const fetchWorkout = async (dispatch, workoutId, REACT_APP_BASE_URL) => {
  try {
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.get(
      `${REACT_APP_BASE_URL}/workout/get/${workoutId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data, status } = response;
    if (data?.error?.status === 401) {
      window.location.reload();
      throw new Error("Unauthorized");
    }
    console.log(response);
    // console.log(data, status);
    if (status === 201) {
      dispatch(workoutActions.setWorkoutData(data.workout));
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteWorkout = async (
  dispatch,
  workoutId,
  REACT_APP_BASE_URL
) => {
  try {
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.delete(
      `${REACT_APP_BASE_URL}/workout/remove/${workoutId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data, status } = response;
    if (data?.error?.status === 401) {
      window.location.reload();
      throw new Error("Unauthorized");
    }
    console.log(response);
    // console.log(data, status);
    if (status === 201) {
      dispatch(authActions.setUser(data.user));
      dispatch(workoutActions.setWorkoutData(null));
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateWorkout = async (
  dispatch,
  workoutId,
  updatedData,
  REACT_APP_BASE_URL
) => {
  try {
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.put(
      `${REACT_APP_BASE_URL}/workout/update/${workoutId}`,
      { updatedData },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data, status } = response;
    if (data?.error?.status === 401) {
      window.location.reload();
      throw new Error("Unauthorized");
    }
    console.log(response);
    // console.log(data, status);
    if (status === 201) {
      dispatch(workoutActions.setWorkoutData(data.workout));
      dispatch(authActions.setUser(data.user));
    }
  } catch (err) {
    console.log(err);
  }
};

export const addExerciseToWorkout = async (
  dispatch,
  workoutId,
  exerciseId,
  REACT_APP_BASE_URL
) => {
  try {
    console.log("addExerciseToWorkout");
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.put(
      `${REACT_APP_BASE_URL}/workout/addExercise/${workoutId}`,
      { exerciseId },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data, status } = response;
    if (data?.error?.status === 401) {
      window.location.reload();
      throw new Error("Unauthorized");
    }
    console.log(response);
    // console.log(data, status);
    if (status === 201) {
      dispatch(workoutActions.setWorkoutData(data.workout));
      dispatch(authActions.setUser(data.user));
    }
  } catch (err) {
    console.log(err);
  }
};

export const removeExerciseFromWorkout = async (
  dispatch,
  workoutId,
  exerciseId,
  REACT_APP_BASE_URL
) => {
  try {
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.put(
      `${REACT_APP_BASE_URL}/workout/removeExercise/${workoutId}`,
      { exerciseId },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data, status } = response;
    if (data?.error?.status === 401) {
      window.location.reload();
      throw new Error("Unauthorized");
    }
    console.log(response);
    // console.log(data, status);
    if (status === 201) {
      dispatch(workoutActions.setWorkoutData(data.workout));
      dispatch(authActions.setUser(data.user));
    }
  } catch (err) {
    console.log(err);
  }
};
