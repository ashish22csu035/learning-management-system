

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');


const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');

/**
 * Auth Routes:
 * POST   /api/auth/register  - Register new user
 * POST   /api/auth/login     - Login user
 * GET    /api/auth/me        - Get current user (protected)
 * POST   /api/auth/logout    - Logout user (protected)
 */

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;