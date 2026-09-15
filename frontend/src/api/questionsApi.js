import axiosClient from './axiosClient';

export const getQuestions = async (type = '', difficulty = '', topic = '', search = '') => {
  const params = {};
  if (type) params.type = type;
  if (difficulty) params.difficulty = difficulty;
  if (topic) params.topic = topic;
  if (search) params.search = search;
  const response = await axiosClient.get('/questions', { params });
  return response.data;
};

export const getQuestionById = async (id) => {
  const response = await axiosClient.get(`/questions/${id}`);
  return response.data;
};

export const generateAiQuestions = async (payload) => {
  const response = await axiosClient.post('/questions/ai-generate', payload);
  return response.data;
};

export const submitPracticeAnswer = async (questionId, answerText) => {
  const response = await axiosClient.post('/practice/submit', { questionId, answerText });
  return response.data;
};

