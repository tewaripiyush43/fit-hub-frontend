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
    // console.log(data.user, status);
    if (status === 201) {
      dispatch(authActions.setUser(data.user));
      // console.log(data.workoutId);
      return data.workoutId;
    }
  } catch (error) {
    // console.error("Error fetching user data:", error);
  }
};

export const fetchWorkout = async (dispatch, workoutId, REACT_APP_BASE_URL) => {
  try {
    // console.log("fetchWorkout function called");
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
    // console.log(response);
    // console.log(data, status);
    if (status === 201) {
      dispatch(workoutActions.setWorkoutData(data.workout));
    }
  } catch (err) {
    // console.log(err);
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
    // console.log(response);
    // console.log(data, status);
    if (status === 201) {
      dispatch(authActions.setUser(data.user));
      dispatch(workoutActions.setWorkoutData(null));
    }
  } catch (err) {
    // console.log(err);
  }
};

export const updateWorkout = async (
  dispatch,
  workoutId,
  updatedData,
  REACT_APP_BASE_URL
) => {
  try {
    // console.log("updateWorkout function called");
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.put(
      `${REACT_APP_BASE_URL}/workout/update/${workoutId}`,
      {
        updatedData: {
          name: updatedData.name,
          description: updatedData.description,
          isPrivate: updatedData.isPrivate,
        },
      },
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
    // console.log(data, status);
    if (status === 201) {
      const workoutResult = { ...data.workout };
      const hasPopulatedExercises =
        workoutResult.exercises &&
        workoutResult.exercises.length > 0 &&
        typeof workoutResult.exercises[0] === "object";

      if (!hasPopulatedExercises && updatedData.exercises) {
        workoutResult.exercises = updatedData.exercises;
      }

      dispatch(workoutActions.setWorkoutData(workoutResult));
      dispatch(authActions.setUser(data.user));
    }
  } catch (err) {
    // console.log(err);
  }
};

export const addExerciseToWorkout = async (
  dispatch,
  workoutId,
  exerciseId,
  REACT_APP_BASE_URL
) => {
  try {
    // console.log("addExerciseToWorkout");
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
    // console.log(response);
    // console.log(data, status);
    if (status === 201) {
      dispatch(workoutActions.setWorkoutData(data.workout));
      dispatch(authActions.setUser(data.user));
      return true;
    }
    return false;
  } catch (err) {
    // console.log(err);
    return false;
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
    // console.log(response);
    // console.log(data, status);
    if (status === 201) {
      dispatch(workoutActions.setWorkoutData(data.workout));
      dispatch(authActions.setUser(data.user));
    }
  } catch (err) {
    // console.log(err);
  }
};

export const generateAIWorkout = async (
  dispatch,
  payload,
  REACT_APP_BASE_URL
) => {
  try {
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.post(
      `${REACT_APP_BASE_URL}/workout/generate-ai`,
      payload,
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
    if (status === 201) {
      dispatch(authActions.setUser(data.user));
      return { workoutId: data.workoutId, workoutName: data.workoutName };
    }
  } catch (error) {
    console.error("Error generating AI workout:", error);
    throw error;
  }
};

export const cloneWorkout = async (dispatch, workoutId, REACT_APP_BASE_URL) => {
  try {
    const accessToken = localStorage.accessToken;
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.post(
      `${REACT_APP_BASE_URL}/workout/clone/${workoutId}`,
      {},
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
    if (status === 201) {
      dispatch(authActions.setUser(data.user));
      return data.workoutId;
    }
  } catch (error) {
    console.error("Error cloning workout:", error);
    throw error;
  }
};

