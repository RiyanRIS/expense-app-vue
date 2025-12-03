const Income = require('../models/Income');
const { asyncHandler } = require('../middlewares/errorHandler');
const {
  NotFoundError,
  ValidationError
} = require('../middlewares/errorHandler');
const { logger } = require('../config/logger');

/**
 * Income Controller
 * Handle income operations: create, read, update, delete
 */

/**
 * @desc    Get all incomes for authenticated user
 * @route   GET /api/incomes
 * @access  Private
 */
exports.getAllIncomes = asyncHandler(async (req, res) => {
  const incomes = await Income.find({ user: req.userId }).sort({ _id: -1 }).limit(200);
  res.json({
    success: true, 
    count: incomes.length, 
    incomes: incomes
  });
});

/**
 * @desc    Get single income by ID
 * @route   GET /api/incomes/:id
 * @access  Private
 */
exports.getIncomeById = asyncHandler(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.userId });
  if (!income) {
    throw new NotFoundError('Income');
  }
  res.json(income);
});

/**
 * @desc    Create new income
 * @route   POST /api/incomes
 * @access  Private
 */
exports.createIncome = asyncHandler(async (req, res) => {
  const payload = req.body;
  const now = new Date();
  const gmt7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  
  payload.user = req.userId; // Add user ID
  payload.input_date = payload.input_date || gmt7.toISOString().split("T")[0];
  payload.input_time =
    payload.input_time || gmt7.toISOString().split("T")[1].split(".")[0];
  
  // Clean up unwanted fields
  delete payload.id;
  delete payload.createdAt;
  delete payload._local;
  
  const income = new Income(payload);
  await income.save();
  
  logger.info('Income created', { id: income._id, name: income.name, amount: income.amount, userId: req.userId });
  res.status(201).json(income);
});

/**
 * @desc    Update income
 * @route   PUT /api/incomes/:id
 * @access  Private
 */
exports.updateIncome = asyncHandler(async (req, res) => {
  const updated = await Income.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  
  if (!updated) {
    throw new NotFoundError('Income');
  }
  
  logger.info('Income updated', { id: updated._id, userId: req.userId });
  res.json(updated);
});

/**
 * @desc    Delete income
 * @route   DELETE /api/incomes/:id
 * @access  Private
 */
exports.deleteIncome = asyncHandler(async (req, res) => {
  const deleted = await Income.findOneAndDelete({ _id: req.params.id, user: req.userId });
  
  if (!deleted) {
    throw new NotFoundError('Income');
  }
  
  logger.info('Income deleted', { id: req.params.id, userId: req.userId });
  res.json({ success: true });
});
