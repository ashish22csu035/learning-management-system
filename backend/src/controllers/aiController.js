// src/controllers/aiController.js

const aiService = require('../services/aiService');

/**
 * @desc    Generate full course content with AI
 * @route   POST /api/ai/generate-course
 * @access  Private (Instructor/Admin)
 */
const generateCourse = async (req, res) => {
  try {
    const { topic, category, level } = req.body;

    // Validation
    if (!topic || !category || !level) {
      return res.status(400).json({
        success: false,
        message: 'Please provide topic, category, and level',
      });
    }

    console.log(`🤖 Generating course: ${topic} (${category}, ${level})`);

    const result = await aiService.generateCourseContent(topic, category, level);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course content generated successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('Generate Course Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Generate course description only
 * @route   POST /api/ai/generate-description
 * @access  Private (Instructor/Admin)
 */
const generateDescription = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and category',
      });
    }

    const result = await aiService.generateDescription(title, category);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Generate Description Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Generate learning outcomes
 * @route   POST /api/ai/generate-outcomes
 * @access  Private (Instructor/Admin)
 */
const generateOutcomes = async (req, res) => {
  try {
    const { title, level } = req.body;

    if (!title || !level) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and level',
      });
    }

    const result = await aiService.generateLearningOutcomes(title, level);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Generate Outcomes Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Enhance/improve content
 * @route   POST /api/ai/enhance
 * @access  Private (Instructor/Admin)
 */
const enhanceContent = async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide content and type',
      });
    }

    const result = await aiService.enhanceContent(content, type);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Enhance Content Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  generateCourse,
  generateDescription,
  generateOutcomes,
  enhanceContent,
};