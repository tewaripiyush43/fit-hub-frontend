import api from "./client";

export const fetchGoals = async () => {
  const res = await api.get("/goal/");
  return res.data;
};

export const updateGoals = async (goals) => {
  const res = await api.put("/goal/updateGoals", goals);
  return res.data;
};
