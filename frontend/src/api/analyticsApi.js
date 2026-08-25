import axiosClient from './axiosClient';

export const getDashboardAnalytics = async () => {
  const response = await axiosClient.get('/analytics/dashboard');
  return response.data;
};

