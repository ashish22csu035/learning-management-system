// src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

/**
 * User Schema Definition
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },

    role: {
      type: String,
      enum: {
        values: ['student', 'instructor', 'admin'],
        message: '{VALUE} is not a valid role'
      },
      default: 'student'
    },

    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },

    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

// ========== MIDDLEWARE ==========

/**
 * Hash password before saving
 * FIXED: Removed next parameter - Mongoose 6+ doesn't need it
 */
userSchema.pre('save', async function() {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    
    console.log(`✅ Password hashed for user: ${this.email}`);
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    throw error;
  }
});

// ========== INSTANCE METHODS ==========

/**
 * Compare entered password with hashed password
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Get public profile
 */
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    bio: this.bio,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt
  };
};

// ========== STATIC METHODS ==========

/**
 * Find user by email
 */
userSchema.statics.findByEmail = async function(email) {
  return await this.findOne({ email: email.toLowerCase() });
};

// Create and export model
const User = mongoose.model('User', userSchema);

module.exports = User;