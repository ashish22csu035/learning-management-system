// src/api/enrollmentService.js

import api from './axiosConfig';

export const enrollmentService = {
  // Enroll in a course
  enrollInCourse: async (courseId) => {
    const response = await api.post(`/enrollments/${courseId}`);
    return response.data;
  },

  // Get my enrollments
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-courses');
    return response.data;
  },

  // Check if enrolled
  checkEnrollment: async (courseId) => {
    const response = await api.get(`/enrollments/check/${courseId}`);
    return response.data;
  },

  // Update progress
  updateProgress: async (enrollmentId, progress) => {
    const response = await api.put(`/enrollments/${enrollmentId}/progress`, {
      progress,
    });
    return response.data;
  },

  // Get course enrollments (instructor)
  getCourseEnrollments: async (courseId) => {
    const response = await api.get(`/enrollments/course/${courseId}`);
    return response.data;
  },
};