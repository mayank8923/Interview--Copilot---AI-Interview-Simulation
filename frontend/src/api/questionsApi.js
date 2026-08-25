import axiosClient from './axiosClient';

export const getQuestions = async (type = '', difficulty = '') => {
  const params = {};
  if (type) params.type = type;
  if (difficulty) params.difficulty = difficulty;
  const response = await axiosClient.get('/questions', { params });
  return response.data;
};

export const getQuestionById = async (id) => {
  const response = await axiosClient.get(`/questions/${id}`);
  return response.data;
};

export const submitPracticeAnswer = async (questionId, answerText) => {
  const response = await axiosClient.post('/practice/submit', { questionId, answerText });
  return response.data;
};

