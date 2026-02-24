

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




router.get('/my-courses', protect, getMyEnrollments);


router.get('/check/:courseId', protect, checkEnrollment);


router.post('/:courseId', protect, authorize('student'), enrollInCourse);


router.put('/:enrollmentId/progress', protect, updateProgress);


router.get(
  '/course/:courseId',
  protect,
  authorize('instructor', 'admin'),
  getCourseEnrollments
);

module.exports = router;