// src/controllers/enrollmentController.js

const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

/**
 * @desc    Enroll in a course
 * @route   POST /api/enrollments/:courseId
 * @access  Private (Student)
 */
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user._id;

    // Check if course exists and is published
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'This course is not available for enrollment',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    await enrollment.populate('course', 'title thumbnail instructor');

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment,
    });
  } catch (error) {
    console.error('Enroll Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's enrollments
 * @route   GET /api/enrollments/my-courses
 * @access  Private (Student)
 */
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    })
      .populate('course')
      .populate('course.instructor', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    console.error('Get Enrollments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Check if user is enrolled in a course
 * @route   GET /api/enrollments/check/:courseId
 * @access  Private
 */
const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      data: enrollment,
    });
  } catch (error) {
    console.error('Check Enrollment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Update enrollment progress
 * @route   PUT /api/enrollments/:enrollmentId/progress
 * @access  Private (Student)
 */
const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Check ownership
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    enrollment.progress = progress;
    enrollment.lastAccessed = Date.now();

    // Mark as completed if progress is 100%
    if (progress >= 100 && !enrollment.completedAt) {
      enrollment.status = 'completed';
      enrollment.completedAt = Date.now();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated',
      data: enrollment,
    });
  } catch (error) {
    console.error('Update Progress Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get course enrollments (Instructor/Admin)
 * @route   GET /api/enrollments/course/:courseId
 * @access  Private (Instructor/Admin)
 */
const getCourseEnrollments = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if user owns the course or is admin
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const enrollments = await Enrollment.find({
      course: req.params.courseId,
    })
      .populate('student', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    console.error('Get Course Enrollments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
  updateProgress,
  getCourseEnrollments,
};