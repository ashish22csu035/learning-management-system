
import api from './axiosConfig';

export const enrollmentService = {
  
  enrollInCourse: async (courseId) => {
    const response = await api.post(`/enrollments/${courseId}`);
    return response.data;
  },

  
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-courses');
    return response.data;
  },

  
  checkEnrollment: async (courseId) => {
    const response = await api.get(`/enrollments/check/${courseId}`);
    return response.data;
  },

  
  updateProgress: async (enrollmentId, progress) => {
    const response = await api.put(`/enrollments/${enrollmentId}/progress`, {
      progress,
    });
    return response.data;
  },

  
  getCourseEnrollments: async (courseId) => {
    const response = await api.get(`/enrollments/course/${courseId}`);
    return response.data;
  },
};