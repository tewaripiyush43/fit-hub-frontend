import api from "./client";
import { authActions, workoutActions } from "../store/index";

export const addWorkout = async (dispatch, workoutName, exerciseId = null) => {
  const payload = { name: workoutName };
  if (exerciseId) {
    payload.exerciseId = exerciseId;
  }
  const response = await api.post("/workout/create", payload);
  const { data, status } = response;
  if (status === 201 || status === 200) {
    dispatch(authActions.setUser(data.user));
    return data.workoutId;
  }
};

export const fetchWorkout = async (dispatch, workoutId) => {
  try {
    const response = await api.get(`/workout/get/${workoutId}`);
    const { data, status } = response;
    if (status === 201 || status === 200) {
      const workout = data.workout || data;
      dispatch(workoutActions.setWorkoutData(workout));
      return workout;
    }
  } catch (error) {
    dispatch(workoutActions.setWorkoutData(null));
    throw error;
  }
};

export const deleteWorkout = async (dispatch, workoutId) => {
  const response = await api.delete(`/workout/remove/${workoutId}`);
  const { data, status } = response;
  if (status === 201 || status === 200) {
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
  if (status === 201 || status === 200) {
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
  if (status === 201 || status === 200) {
    if (data.workout) {
      dispatch(workoutActions.setWorkoutData(data.workout));
    }
    if (data.user) {
      dispatch(authActions.setUser(data.user));
    }
    return true;
  }
  return false;
};

export const removeExerciseFromWorkout = async (dispatch, workoutId, exerciseId) => {
  const response = await api.put(`/workout/removeExercise/${workoutId}`, { exerciseId });
  const { data, status } = response;
  if (status === 201 || status === 200) {
    if (data.workout) {
      dispatch(workoutActions.setWorkoutData(data.workout));
    }
    if (data.user) {
      dispatch(authActions.setUser(data.user));
    }
    return true;
  }
  return false;
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
  if (status === 201 || status === 200) {
    if (dispatch && data.user) {
      dispatch(authActions.setUser(data.user));
    }
    return data.workoutId;
  }
};

export const fetchExploreWorkouts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", params.search);
  if (params.muscle && params.muscle !== "all") queryParams.append("muscle", params.muscle);
  if (params.difficulty && params.difficulty !== "all") queryParams.append("difficulty", params.difficulty);
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  const response = await api.get(`/workout/explore?${queryParams.toString()}`);
  return response.data;
};

export const fetchDailyWOD = async () => {
  const response = await api.get("/workout/daily-wod");
  return response.data;
};

export const fetchOfficialWorkouts = async () => {
  const response = await api.get("/workout/official");
  return response.data;
};

export const fetchAICoachSummary = async (payload) => {
  const response = await api.post("/workout/ai-coach-summary", payload);
  return response.data?.summary;
};

export const fetchAIMuscleCoachAnalysis = async (payload) => {
  const response = await api.post("/workout/ai-muscle-coach", payload);
  return response.data;
};
