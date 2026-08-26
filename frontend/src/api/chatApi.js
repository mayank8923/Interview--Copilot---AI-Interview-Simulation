import axiosClient from './axiosClient';

export const startChatInterview = async (topic) => {
  const response = await axiosClient.post('/chat-interview/start', { topic });
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

