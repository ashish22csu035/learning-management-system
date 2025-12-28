// src/api/courseService.js

import api from './axiosConfig';

export const courseService = {
  // Get all courses with filters
  getAllCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  // Get single course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Create new course
  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Get instructor's courses
  getMyCourses: async () => {
    const response = await api.get('/courses/my-courses');
    return response.data;
  },

  // Publish/Unpublish course
  togglePublish: async (id) => {
    const response = await api.patch(`/courses/publish/${id}`);
    return response.data;
  },
};
