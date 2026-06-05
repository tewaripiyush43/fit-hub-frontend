import api from "./client";
import { authActions, workoutActions } from "../store/index";

export const addWorkout = async (dispatch, workoutName) => {
  const response = await api.post("/workout/create", { name: workoutName });
  const { data, status } = response;
  if (status === 201) {
    dispatch(authActions.setUser(data.user));
    return data.workoutId;
  }
};

export const fetchWorkout = async (dispatch, workoutId) => {
  const response = await api.get(`/workout/get/${workoutId}`);
  const { data, status } = response;
  if (status === 201) {
    dispatch(workoutActions.setWorkoutData(data.workout));
  }
};

export const deleteWorkout = async (dispatch, workoutId) => {
  const response = await api.delete(`/workout/remove/${workoutId}`);
  const { data, status } = response;
  if (status === 201) {
    dispatch(authActions.setUser(data.user));
    dispatch(workoutActions.setWorkoutData(null));
  }
};

export const updateWorkout = async (dispatch, workoutId, updatedData) => {
  const response = await api.put(`/workout/update/${workoutId}`, {
    updatedData: {
      name: updatedData.name,
      description: updatedData.description,
      isPrivate: updatedData.isPrivate,
    },
  });
  const { data, status } = response;
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
};

export const addExerciseToWorkout = async (dispatch, workoutId, exerciseId) => {
  const response = await api.put(`/workout/addExercise/${workoutId}`, { exerciseId });
  const { data, status } = response;
  if (status === 201) {
    dispatch(workoutActions.setWorkoutData(data.workout));
    dispatch(authActions.setUser(data.user));
    return true;
  }
  return false;
};

export const removeExerciseFromWorkout = async (dispatch, workoutId, exerciseId) => {
  const response = await api.put(`/workout/removeExercise/${workoutId}`, { exerciseId });
  const { data, status } = response;
  if (status === 201) {
    dispatch(workoutActions.setWorkoutData(data.workout));
    dispatch(authActions.setUser(data.user));
  }
};

export const generateAIWorkout = async (dispatch, payload) => {
  const response = await api.post("/workout/generate-ai", payload);
  const { data, status } = response;
  if (status === 201) {
    dispatch(authActions.setUser(data.user));
    return { workoutId: data.workoutId, workoutName: data.workoutName };
  }
};

export const cloneWorkout = async (dispatch, workoutId) => {
  const response = await api.post(`/workout/clone/${workoutId}`, {});
  const { data, status } = response;
  if (status === 201) {
    dispatch(authActions.setUser(data.user));
    return data.workoutId;
  }
};
