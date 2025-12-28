// src/models/Enrollment.js

const mongoose = require('mongoose');

/**
 * Enrollment Schema
 */
const enrollmentSchema = new mongoose.Schema(
  {
    // Student
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },

    // Course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },

    // Enrollment status
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'dropped'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },

    // Progress tracking
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
    },

    // Completion date
    completedAt: {
      type: Date,
    },

    // Last accessed
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index - prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Index for queries
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });

// Create and export model
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;