

const mongoose = require('mongoose');


const enrollmentSchema = new mongoose.Schema(
  {
    
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },

    
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },

    
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'dropped'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },

    
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
    },

    
    completedAt: {
      type: Date,
    },

    
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });


enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });


const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;