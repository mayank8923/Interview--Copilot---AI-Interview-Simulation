import axiosClient from './axiosClient';

export const startChatInterview = async (topic, persona, useResume = false) => {
  const response = await axiosClient.post('/chat-interview/start', { topic, persona, useResume });
  return response.data;
};

export const sendChatMessage = async (sessionId, content) => {
  const response = await axiosClient.post(`/chat-interview/${sessionId}/message`, { content });
  return response.data;
};

export const getChatSession = async (sessionId) => {
  const response = await axiosClient.get(`/chat-interview/${sessionId}`);
  return response.data;
};

export const concludeChatSession = async (sessionId) => {
  const response = await axiosClient.post(`/chat-interview/${sessionId}/conclude`);
  return response.data;
};
