import User from '../models/User.js';
import Category from '../models/Category.js';
import PaymentSource from '../models/PaymentSource.js';
import { asyncHandler, ValidationError, UnauthorizedError, ConflictError, NotFoundError } from '../middlewares/errorHandler.js';
import { sendTokenResponse } from '../middlewares/auth.js';
import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Auth Controller
 * Handle authentication operations: signup, login, logout, profile
 */

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  // 1. Validate input
  if (!name || !email || !password) {
    throw new ValidationError('Please provide name, email, and password');
  }

  if (password !== passwordConfirm) {
    throw new ValidationError('Passwords do not match');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters');
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    logger.warn('Signup attempt with existing email', { email });
    throw new ConflictError('User with this email already exists');
  }

  // 3. Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'user' // Default role
  });

  // 4. Create default categories for the user
  const defaultCategories = [
    'Makanan',
    'Transportasi',
    'Belanja',
    'Hiburan',
    'Lainnya'
  ];

  const categoryPromises = defaultCategories.map(categoryName =>
    Category.create({
      name: categoryName,
      user: user._id
    })
  );

  // 5. Create default payment sources for the user
  const defaultPaymentSources = [
    'Tunai',
    'Kartu Debit',
    'Kartu Kredit',
    'E-Wallet',
    'Transfer Bank'
  ];

  const paymentSourcePromises = defaultPaymentSources.map(sourceName =>
    PaymentSource.create({
      name: sourceName,
      user: user._id
    })
  );

  // Wait for all default data to be created
  await Promise.all([...categoryPromises, ...paymentSourcePromises]);

  logger.info('New user registered with default data', {
    userId: user._id,
    email: user.email,
    name: user.name,
    defaultCategories: defaultCategories.length,
    defaultPaymentSources: defaultPaymentSources.length
  });

  // 4. Send token response
  sendTokenResponse(user, 201, res, {
    message: 'User registered successfully'
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    throw new ValidationError('Please provide email and password');
  }

  // 2. Find user and include password
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    logger.warn('Login attempt with non-existent email', { email });
    throw new UnauthorizedError('Invalid email or password');
  }

  // 3. Check if account is active
  if (user.status !== 'active') {
    logger.warn('Login attempt with inactive account', {
      userId: user._id,
      status: user.status
    });
    throw new UnauthorizedError('Your account has been suspended. Please contact support.');
  }

  // 4. Verify password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    logger.warn('Login attempt with incorrect password', {
      userId: user._id,
      email: user.email
    });
    throw new UnauthorizedError('Invalid email or password');
  }

  // 5. Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  logger.info('User logged in successfully', {
    userId: user._id,
    email: user.email,
    ip: req.ip
  });

  // 6. Send token response
  sendTokenResponse(user, 200, res, {
    message: 'Login successful'
  });
});

/**
 * @desc    Logout user (client-side will remove token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // Clear cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  logger.info('User logged out', {
    userId: req.user?._id,
    email: req.user?.email
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  // User is already attached to req by protect middleware
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFoundError('User');
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;

  // Fields to update
  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  );

  if (!user) {
    throw new NotFoundError('User');
  }

  logger.info('User profile updated', {
    userId: user._id,
    updatedFields: Object.keys(fieldsToUpdate)
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { newPassword, newPasswordConfirm } = req.body;

  // 1. Validate input
  if (!newPassword || !newPasswordConfirm) {
    throw new ValidationError('Please provide new password and confirmation');
  }

  if (newPassword !== newPasswordConfirm) {
    throw new ValidationError('New passwords do not match');
  }

  if (newPassword.length < 6) {
    throw new ValidationError('Password must be at least 6 characters');
  }

  // 2. Get user with password and previous password
  const user = await User.findById(req.user._id).select('+password +previousPassword');

  if (!user) {
    throw new NotFoundError('User');
  }

  // 3. Check if new password is different from current password
  const isSameAsCurrent = await user.comparePassword(newPassword);
  if (isSameAsCurrent) {
    throw new ValidationError('New password must be different from current password');
  }

  // 4. Check if new password is same as previous password (if exists)
  if (user.previousPassword) {
    const bcrypt = require('bcryptjs');
    const isSameAsPrevious = await bcrypt.compare(newPassword, user.previousPassword);
    if (isSameAsPrevious) {
      throw new ValidationError('You cannot reuse your previous password');
    }
  }

  // 5. Update password and history
  user.previousPassword = user.password; // Store current password as previous
  user.password = newPassword;
  user.passwordChangedAt = new Date();
  user.lastPasswordUpdate = new Date();
  await user.save();

  logger.info('Password changed successfully', {
    userId: user._id,
    email: user.email
  });

  // 6. Send new token
  sendTokenResponse(user, 200, res, {
    message: 'Password changed successfully'
  });
});

/**
 * @desc    Forgot password - send reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. Validate input
  if (!email) {
    throw new ValidationError('Please provide an email address');
  }

  // 2. Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if email exists or not for security
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  }

  // 3. Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 4. In a real app, send email here
  // For demo purposes, we'll return the token
  // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
  // await sendEmail({
  //   email: user.email,
  //   subject: 'Password Reset Token (valid for 10 minutes)',
  //   message: `Your password reset token is: ${resetToken}\n\nIf you didn't request this, please ignore this email.`
  // });

  logger.info('Password reset token generated', {
    userId: user._id,
    email: user.email,
    resetToken: resetToken // In production, don't log this
  });

  // 5. Send response
  res.status(200).json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
    // For demo purposes only - remove in production
    resetToken: resetToken,
    resetUrl: `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`
  });
});

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { password, passwordConfirm } = req.body;
  const { token } = req.params;

  // 1. Validate input
  if (!password || !passwordConfirm) {
    throw new ValidationError('Please provide password and confirmation');
  }

  if (password !== passwordConfirm) {
    throw new ValidationError('Passwords do not match');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters');
  }

  // 2. Hash token and find user
  const crypto = require('crypto');
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new ValidationError('Token is invalid or has expired');
  }

  // 3. Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  logger.info('Password reset successful', {
    userId: user._id,
    email: user.email
  });

  // 4. Send new token
  sendTokenResponse(user, 200, res, {
    message: 'Password reset successful'
  });
});

/**
 * @desc    Delete account (soft delete)
 * @route   DELETE /api/auth/account
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  // 1. Verify password
  if (!password) {
    throw new ValidationError('Please provide your password to confirm deletion');
  }

  // 2. Get user with password
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw new NotFoundError('User');
  }

  // 3. Verify password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Password is incorrect');
  }

  // 4. Soft delete (change status to deleted)
  user.status = 'deleted';
  await user.save({ validateBeforeSave: false });

  logger.warn('User account deleted', {
    userId: user._id,
    email: user.email
  });

  // 5. Clear cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/auth/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    users
  });
});

/**
 * @desc    Get user statistics (Admin only)
 * @route   GET /api/auth/stats
 * @access  Private/Admin
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.getStats();

  res.status(200).json({
    success: true,
    stats
  });
});
