import axiosClient from './axiosClient';

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosClient.post('/resume/upload', formData, {
    transformRequest: [(data, headers) => {
      // Delete the default application/json header so Axios generates the multipart boundary
      delete headers['Content-Type'];
      return data;
    }]
  });
  
  // axiosClient interceptor returns the ApiResponse wrapper, so we return .data
  return response.data;
};

export const getLatestResumeAnalysis = async () => {
  const response = await axiosClient.get('/resume/latest');
  return response.data;
};

