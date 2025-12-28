// src/routes/courseRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  togglePublishCourse
} = require('../controllers/courseController');

// My courses route (must be before /:id)
router.get('/my-courses', protect, authorize('instructor', 'admin'), getMyCourses);

// Main routes
router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('instructor', 'admin'), createCourse);

// Publish route - MUST be before /:id route
router.patch('/:id/publish', protect, authorize('instructor', 'admin'), togglePublishCourse);

// Dynamic :id routes - MUST be last
router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;