// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers
} = require('../controllers/userController');

// Search route (public)
router.get('/search', searchUsers);

// Get all users (protected - any authenticated user)
router.get('/', protect, getAllUsers);

// Get user by ID (protected)
router.get('/:id', protect, getUserById);

// Create user (admin only)
router.post('/', protect, authorize('admin'), createUser);

// Update user (user can update themselves, admin can update anyone)
router.put('/:id', protect, updateUser);

// Delete user (admin only)
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;