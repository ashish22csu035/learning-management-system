// src/models/Course.js

const mongoose = require('mongoose');

/**
 * Course Schema Definition
 */
const courseSchema = new mongoose.Schema(
  {
    // Course basic info
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },

    description: {
      type: String,
      required: [true, 'Course description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },

    // Course instructor (reference to User model)
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to User model
      required: [true, 'Instructor is required']
    },

    // Course category
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Web Development',
          'Mobile Development',
          'Data Science',
          'Machine Learning',
          'Cloud Computing',
          'Cybersecurity',
          'UI/UX Design',
          'DevOps',
          'Blockchain',
          'Other'
        ],
        message: '{VALUE} is not a valid category'
      }
    },

    // Course level
    level: {
      type: String,
      required: [true, 'Course level is required'],
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: '{VALUE} is not a valid level'
      }
    },

    // Course pricing
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0
    },

    // Discounted price (optional)
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator: function(value) {
          // Discount price should be less than original price
          return value < this.price;
        },
        message: 'Discount price should be less than original price'
      }
    },

    // Course thumbnail/image
    thumbnail: {
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Course+Thumbnail'
    },

    // Course duration in hours
    duration: {
      type: Number,
      required: [true, 'Course duration is required'],
      min: [1, 'Duration must be at least 1 hour']
    },

    // Course language
    language: {
      type: String,
      required: [true, 'Language is required'],
      default: 'English'
    },

    // What students will learn
    learningOutcomes: {
      type: [String],
      validate: {
        validator: function(array) {
          return array.length > 0;
        },
        message: 'At least one learning outcome is required'
      }
    },

    // Prerequisites
    prerequisites: {
      type: [String],
      default: []
    },

    // Course requirements
    requirements: {
      type: [String],
      default: []
    },

    // Is course published?
    isPublished: {
      type: Boolean,
      default: false
    },

    // Enrollment count
    enrollmentCount: {
      type: Number,
      default: 0,
      min: [0, 'Enrollment count cannot be negative']
    },

    // Average rating
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },

    // Total ratings
    ratingsCount: {
      type: Number,
      default: 0,
      min: [0, 'Ratings count cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ========== INDEXES ==========

// Index for faster queries
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ isPublished: 1 });

// ========== VIRTUAL PROPERTIES ==========

/**
 * Virtual property to get final price (considering discount)
 */
courseSchema.virtual('finalPrice').get(function() {
  return this.discountPrice || this.price;
});

/**
 * Virtual property to check if course has discount
 */
courseSchema.virtual('hasDiscount').get(function() {
  return this.discountPrice && this.discountPrice < this.price;
});

/**
 * Virtual property to calculate discount percentage
 */
courseSchema.virtual('discountPercentage').get(function() {
  if (!this.hasDiscount) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

// ========== INSTANCE METHODS ==========

/**
 * Get course summary (without sensitive data)
 */
courseSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    instructor: this.instructor,
    category: this.category,
    level: this.level,
    price: this.price,
    finalPrice: this.finalPrice,
    thumbnail: this.thumbnail,
    duration: this.duration,
    averageRating: this.averageRating,
    enrollmentCount: this.enrollmentCount
  };
};

// ========== STATIC METHODS ==========

/**
 * Get courses by instructor
 */
courseSchema.statics.findByInstructor = function(instructorId) {
  return this.find({ instructor: instructorId });
};

/**
 * Get published courses
 */
courseSchema.statics.findPublished = function() {
  return this.find({ isPublished: true });
};

/**
 * Search courses by text
 */
courseSchema.statics.searchCourses = function(searchQuery) {
  return this.find({
    $text: { $search: searchQuery },
    isPublished: true
  });
};

// Create and export model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
