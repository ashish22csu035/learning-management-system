

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  generateCourse,
  generateDescription,
  generateOutcomes,
  enhanceContent,
} = require('../controllers/aiController');


router.post(
  '/generate-course',
  protect,
  authorize('instructor', 'admin'),
  generateCourse
);


router.post(
  '/generate-description',
  protect,
  authorize('instructor', 'admin'),
  generateDescription
);


router.post(
  '/generate-outcomes',
  protect,
  authorize('instructor', 'admin'),
  generateOutcomes
);


router.post(
  '/enhance',
  protect,
  authorize('instructor', 'admin'),
  enhanceContent
);

module.exports = router;