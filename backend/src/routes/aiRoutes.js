// src/routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  generateCourse,
  generateDescription,
  generateOutcomes,
  enhanceContent,
} = require('../controllers/aiController');

/**
 * AI Routes - All protected, Instructor/Admin only
 */

// Generate full course content
router.post(
  '/generate-course',
  protect,
  authorize('instructor', 'admin'),
  generateCourse
);

// Generate description only
router.post(
  '/generate-description',
  protect,
  authorize('instructor', 'admin'),
  generateDescription
);

// Generate learning outcomes
router.post(
  '/generate-outcomes',
  protect,
  authorize('instructor', 'admin'),
  generateOutcomes
);

// Enhance content
router.post(
  '/enhance',
  protect,
  authorize('instructor', 'admin'),
  enhanceContent
);

module.exports = router;