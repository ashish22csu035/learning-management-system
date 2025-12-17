// src/controllers/userController.js

const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public (we'll add authentication later)
 */
const getAllUsers = async (req, res) => {
  try {
    // Find all users in database
    const users = await User.find({});
    
    // Send response
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserById = async (req, res) => {
  try {
    // req.params.id comes from URL: /api/users/123
    const user = await User.findById(req.params.id);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Send response
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
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
 * @desc    Create new user
 * @route   POST /api/users
 * @access  Public
 */
const createUser = async (req, res) => {
  try {
    // req.body contains the data sent from client
    const { name, email, password, role, bio } = req.body;
    
    // Validation - check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      bio
    });
    
    // Send response (password is automatically excluded due to select: false)
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    // Handle validation errors from Mongoose
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
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (user can only update themselves)
 */
const updateUser = async (req, res) => {
  try {
    // Fields that can be updated
    const { name, bio, avatar } = req.body;
    
    // Build update object (only include provided fields)
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;
    
    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,           // Return updated document
        runValidators: true  // Run schema validators
      }
    );
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
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
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Search users by name or email
 * @route   GET /api/users/search?q=query
 * @access  Public
 */
const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    
    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }
    
    // Search in name and email fields using regex (case-insensitive)
    const users = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Export all controller functions
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers
};