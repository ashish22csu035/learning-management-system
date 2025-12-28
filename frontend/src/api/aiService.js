// src/api/aiService.js

import api from './axiosConfig';

export const aiService = {
  // Generate full course content
  generateCourse: async (data) => {
    const response = await api.post('/ai/generate-course', data);
    return response.data;
  },

  // Generate description only
  generateDescription: async (data) => {
    const response = await api.post('/ai/generate-description', data);
    return response.data;
  },

  // Generate learning outcomes
  generateOutcomes: async (data) => {
    const response = await api.post('/ai/generate-outcomes', data);
    return response.data;
  },

  // Enhance content
  enhanceContent: async (data) => {
    const response = await api.post('/ai/enhance', data);
    return response.data;
  },
};