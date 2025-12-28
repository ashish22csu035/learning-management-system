// src/routes/enrollmentRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
  updateProgress,
  getCourseEnrollments,
} = require('../controllers/enrollmentController');

/**
 * Enrollment Routes
 */

// Get my enrollments
router.get('/my-courses', protect, getMyEnrollments);

// Check if enrolled in specific course
router.get('/check/:courseId', protect, checkEnrollment);

// Enroll in a course
router.post('/:courseId', protect, authorize('student'), enrollInCourse);

// Update progress
router.put('/:enrollmentId/progress', protect, updateProgress);

// Get course enrollments (instructor/admin only)
router.get(
  '/course/:courseId',
  protect,
  authorize('instructor', 'admin'),
  getCourseEnrollments
);

module.exports = router;