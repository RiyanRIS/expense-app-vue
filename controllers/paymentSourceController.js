const PaymentSource = require('../models/PaymentSource');
const { asyncHandler } = require('../middlewares/errorHandler');
const {
  ValidationError,
  NotFoundError
} = require('../middlewares/errorHandler');
const { logger } = require('../config/logger');

/**
 * PaymentSource Controller
 * Handle payment source operations: create, read, update, delete
 */

/**
 * @desc    Get all payment sources for authenticated user
 * @route   GET /api/payment-sources
 * @access  Private
 */
exports.getAllPaymentSources = asyncHandler(async (req, res) => {
  const paymentSources = await PaymentSource.find({ user: req.userId });
  res.json({
    success: true,
    count: paymentSources.length,
    paymentSources: paymentSources
  });
});

/**
 * @desc    Create new payment source
 * @route   POST /api/payment-sources
 * @access  Private
 */
exports.createPaymentSource = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    throw new ValidationError("Payment source name is required");
  }

  // Check if payment source already exists for this user
  const existingPaymentSource = await PaymentSource.findOne({ name, user: req.userId });
  if (existingPaymentSource) {
    throw new ValidationError("Payment source already exists");
  }
  
  const newPaymentSource = new PaymentSource({ name, user: req.userId });
  await newPaymentSource.save();
  
  logger.info('Payment source created', { name, userId: req.userId });
  res.status(201).json(newPaymentSource);
});

/**
 * @desc    Update payment source name
 * @route   PUT /api/payment-sources/:name
 * @access  Private
 */
exports.updatePaymentSource = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { name: newName } = req.body;
  
  if (!newName) {
    throw new ValidationError("New payment source name is required");
  }

  // Check if new name already exists
  const existingPaymentSource = await PaymentSource.findOne({ name: newName, user: req.userId });
  if (existingPaymentSource) {
    throw new ValidationError("Payment source with new name already exists");
  }
  
  const updated = await PaymentSource.findOneAndUpdate(
    { name, user: req.userId },
    { name: newName },
    { new: true }
  );
  
  if (!updated) {
    throw new NotFoundError('Payment source');
  }
  
  logger.info('Payment source updated', { oldName: name, newName, userId: req.userId });
  res.json(updated);
});

/**
 * @desc    Delete payment source
 * @route   DELETE /api/payment-sources/:name
 * @access  Private
 */
exports.deletePaymentSource = asyncHandler(async (req, res) => {
  const { name } = req.params;
  
  const deleted = await PaymentSource.findOneAndDelete({ name, user: req.userId });
  
  if (!deleted) {
    throw new NotFoundError('Payment source');
  }
  
  logger.info('Payment source deleted', { name, userId: req.userId });
  res.json({ success: true });
});