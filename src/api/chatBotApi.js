import api from "./client";

export const sendMessage = async (payload) => {
  if (!payload) throw new Error("Payload missing");
  const res = await api.post("/ai/chat", payload);
  return res.data.reply;
};