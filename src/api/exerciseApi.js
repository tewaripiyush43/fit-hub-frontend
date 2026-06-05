import api from "./client";

export const fetchCarouselDataHome = async () => {
  const res = await api.get("/exercise/fetchCarouselDataHome");
  return res.data;
};

export const findExerciseById = async (id) => {
  const res = await api.get(`/exercise/findex/${id}`);
  return res.data;
};

export const findExercisesByBodyPart = async (bodyPart) => {
  const res = await api.get(`/exercise/exercises/bodyParts/${bodyPart}`);
  return res.data;
};

export const findExercisesByMuscle = async (muscle) => {
  const res = await api.get(`/exercise/exercises/${muscle}`);
  return res.data;
};

export const fetchExerciseCount = async (searchValue) => {
  const res = await api.get(`/exercise/fetchCount?exercise=${searchValue}`);
  return res.data;
};

export const fetchExercises = async (searchValue, page) => {
  const res = await api.get(`/exercise/exercises?exercise=${searchValue}&page=${page}`);
  return res.data;
};

export const fetchExerciseNames = async () => {
  const res = await api.get("/exercise/fetchnames");
  return res.data;
};
