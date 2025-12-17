// src/utils/jwt.js

const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * @param {string} userId - User's MongoDB ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // Payload (data to encode)
    process.env.JWT_SECRET,   // Secret key
    { expiresIn: '30d' }      // Token expires in 30 days
  );
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token data
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};