
import api from './axiosConfig';

export const aiService = {
  
  generateCourse: async (data) => {
    const response = await api.post('/ai/generate-course', data);
    return response.data;
  },

  
  generateDescription: async (data) => {
    const response = await api.post('/ai/generate-description', data);
    return response.data;
  },

  
  generateOutcomes: async (data) => {
    const response = await api.post('/ai/generate-outcomes', data);
    return response.data;
  },

  
  enhanceContent: async (data) => {
    const response = await api.post('/ai/enhance', data);
    return response.data;
  },
};