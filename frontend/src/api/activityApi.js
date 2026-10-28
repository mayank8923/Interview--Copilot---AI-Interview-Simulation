import axiosClient from './axiosClient';

export const getUserStreak = async () => {
  const response = await axiosClient.get('/activity/streak');
  return response.data;
};

export const pingUserActivity = async () => {
  const response = await axiosClient.post('/activity/ping');
  return response.data;
};

