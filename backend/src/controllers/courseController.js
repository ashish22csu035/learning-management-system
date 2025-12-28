// src/controllers/courseController.js

const Course = require('../models/Course');
const User = require('../models/User');

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
const getAllCourses = async (req, res) => {
  try {
    // Query filters
    const {
      category,
      level,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = { isPublished: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'rating') sortOption.averageRating = -1;
    else if (sort === 'popular') sortOption.enrollmentCount = -1;
    else sortOption.createdAt = -1; // Default: newest first

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar')  // Get instructor details
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: courses
    });

  } catch (error) {
    console.error('Get All Courses Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get single course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email avatar bio');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Only show published courses to public (unless you're the instructor or admin)
    if (!course.isPublished && 
        req.user?.role !== 'admin' && 
        req.user?._id.toString() !== course.instructor._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private (Instructor/Admin)
 */
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      price,
      discountPrice,
      thumbnail,
      duration,
      language,
      learningOutcomes,
      prerequisites,
      requirements
    } = req.body;

    // Validation
    if (!title || !description || !category || !level || price === undefined || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, level, price, duration'
      });
    }

    // Create course with instructor as logged-in user
    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,  // From auth middleware
      category,
      level,
      price,
      discountPrice,
      thumbnail,
      duration,
      language,
      learningOutcomes,
      prerequisites,
      requirements,
      isPublished: true
    });

    // Populate instructor details
    await course.populate('instructor', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });

  } catch (error) {
    console.error('Create Course Error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private (Course instructor or Admin)
 */
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership (only course instructor or admin can update)
    if (course.instructor.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this course'
      });
    }

    // Update course
    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('instructor', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });

  } catch (error) {
    console.error('Update Course Error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private (Course instructor or Admin)
 */
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this course'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('Delete Course Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get courses by logged-in instructor
 * @route   GET /api/courses/my-courses
 * @access  Private (Instructor)
 */
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });

  } catch (error) {
    console.error('Get My Courses Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Publish/Unpublish course
 * @route   PATCH /api/courses/:id/publish
 * @access  Private (Course instructor or Admin)
 */
const togglePublishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to publish/unpublish this course'
      });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: course
    });

  } catch (error) {
    console.error('Toggle Publish Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  togglePublishCourse
};