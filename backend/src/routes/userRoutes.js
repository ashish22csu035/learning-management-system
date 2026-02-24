

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


router.get('/search', searchUsers);


router.get('/', protect, getAllUsers);


router.get('/:id', protect, getUserById);


router.post('/', protect, authorize('admin'), createUser);


router.put('/:id', protect, updateUser);


router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;