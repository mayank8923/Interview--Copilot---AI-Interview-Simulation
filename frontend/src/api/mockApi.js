import axiosClient from './axiosClient';

export const startMockSession = async (type, durationMinutes) => {
  const response = await axiosClient.post('/mock/start', { type, durationMinutes });
  return response.data;
};

export const getMockSession = async (id) => {
  const response = await axiosClient.get(`/mock/${id}`);
  return response.data;
};

export const submitMockAnswer = async (id, answer) => {
  const response = await axiosClient.post(`/mock/${id}/answer`, { answer });
  return response.data;
};

export const finishMockSession = async (id) => {
  const response = await axiosClient.post(`/mock/${id}/finish`);
  return response.data;
};

export const getMockReport = async (id) => {
  const response = await axiosClient.get(`/mock/${id}/report`);
  return response.data;
};

