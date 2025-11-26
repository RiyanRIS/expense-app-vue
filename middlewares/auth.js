const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./errorHandler');
const { UnauthorizedError, ForbiddenError } = require('./errorHandler');
const User = require('../models/User');
const { logger } = require('../config/logger');

/**
 * Authentication Middleware
 * Verifikasi JWT token dan attach user ke request
 */

/**
 * Generate JWT Token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} - JWT token
 */
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
    );
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token has expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid token. Please login again.');
    }
    throw new UnauthorizedError('Authentication failed.');
  }
};

/**
 * Middleware: Protect routes - Require authentication
 * Extract token dari header, verify, dan attach user ke req
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Check if token exists
  if (!token) {
    logger.warn('Access denied - No token provided', {
      url: req.originalUrl,
      ip: req.ip
    });
    throw new UnauthorizedError('You are not logged in. Please log in to access this resource.');
  }

  try {
    // 3. Verify token
    const decoded = verifyToken(token);

    // 4. Check if user still exists
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      logger.warn('Access denied - User no longer exists', {
        userId: decoded.id,
        url: req.originalUrl
      });
      throw new UnauthorizedError('The user belonging to this token no longer exists.');
    }

    // 5. Check if user is active
    if (user.status !== 'active') {
      logger.warn('Access denied - User account is not active', {
        userId: user._id,
        status: user.status,
        url: req.originalUrl
      });
      throw new UnauthorizedError('Your account has been suspended. Please contact support.');
    }

    // 6. Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      logger.warn('Access denied - Password changed after token issued', {
        userId: user._id,
        url: req.originalUrl
      });
      throw new UnauthorizedError('User recently changed password. Please log in again.');
    }

    // 7. Grant access to protected route
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    logger.info('User authenticated', {
      userId: user._id,
      email: user.email,
      role: user.role,
      url: req.originalUrl
    });

    next();
  } catch (error) {
    logger.error('Authentication error', {
      error: error.message,
      url: req.originalUrl,
      ip: req.ip
    });
    
    // If it's already an UnauthorizedError, rethrow it
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    
    // Otherwise, throw generic auth error
    throw new UnauthorizedError('Authentication failed. Please log in again.');
  }
});

/**
 * Middleware: Restrict to specific roles
 * Must be used after protect middleware
 * @param  {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be set by protect middleware)
    if (!req.user) {
      throw new UnauthorizedError('You must be logged in to access this resource.');
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      logger.warn('Access forbidden - Insufficient permissions', {
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles,
        url: req.originalUrl
      });
      
      throw new ForbiddenError(
        `You do not have permission to perform this action. Required role: ${roles.join(' or ')}`
      );
    }

    next();
  };
};

/**
 * Middleware: Optional authentication
 * Attach user if token exists, but don't require it
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, just continue without user
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Get user
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && user.status === 'active') {
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;
    }
  } catch (error) {
    // Silent fail - continue without user
    logger.debug('Optional auth failed', { error: error.message });
  }

  next();
});

/**
 * Middleware: Check if user owns the resource
 * Must be used after protect middleware
 * @param {string} resourceField - Field name that contains user ID (default: 'user')
 */
const checkOwnership = (resourceField = 'user') => {
  return async (req, res, next) => {
    // This middleware assumes you have the resource loaded
    // You might need to fetch it first in your route handler
    
    if (!req.user) {
      throw new UnauthorizedError('You must be logged in.');
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check ownership in params (e.g., /api/users/:userId)
    if (req.params.userId && req.params.userId !== req.user._id.toString()) {
      throw new ForbiddenError('You can only access your own resources.');
    }

    next();
  };
};

/**
 * Create and send JWT token in response
 * @param {Object} user - User document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 * @param {Object} additionalData - Additional data to send
 */
const sendTokenResponse = (user, statusCode, res, additionalData = {}) => {
  // Generate token
  const token = generateToken(user._id, user.role);

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict' // CSRF protection
  };

  // Send response
  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      ...additionalData
    });
};

module.exports = {
  generateToken,
  verifyToken,
  protect,
  restrictTo,
  optionalAuth,
  checkOwnership,
  sendTokenResponse
};
