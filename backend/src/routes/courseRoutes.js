

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


router.get('/my-courses', protect, authorize('instructor', 'admin'), getMyCourses);


router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('instructor', 'admin'), createCourse);


router.patch('/:id/publish', protect, authorize('instructor', 'admin'), togglePublishCourse);


router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;