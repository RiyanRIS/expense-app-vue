const Expense = require('../models/Expense');
const { asyncHandler } = require('../middlewares/errorHandler');
const {
  NotFoundError,
  ValidationError
} = require('../middlewares/errorHandler');
const { logger } = require('../config/logger');

/**
 * Expense Controller
 * Handle expense operations: create, read, update, delete
 */

/**
 * @desc    Get all expenses for authenticated user
 * @route   GET /api/expenses
 * @access  Private
 */
exports.getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.userId }).sort({ _id: -1 }).limit(200);
  res.json({
    success: true, 
    count: expenses.length, 
    expenses: expenses
  })
});

/**
 * @desc    Get single expense by ID
 * @route   GET /api/expenses/:id
 * @access  Private
 */
exports.getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.userId });
  if (!expense) {
    throw new NotFoundError('Expense');
  }
  res.json(expense);
});

/**
 * @desc    Create new expense
 * @route   POST /api/expenses
 * @access  Private
 */
exports.createExpense = asyncHandler(async (req, res) => {
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
  
  const expense = new Expense(payload);
  await expense.save();
  
  logger.info('Expense created', { id: expense._id, item: expense.item, userId: req.userId });
  res.status(201).json(expense);
});

/**
 * @desc    Update expense
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
exports.updateExpense = asyncHandler(async (req, res) => {
  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  
  if (!updated) {
    throw new NotFoundError('Expense');
  }
  
  logger.info('Expense updated', { id: updated._id, userId: req.userId });
  res.json(updated);
});

/**
 * @desc    Delete expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
exports.deleteExpense = asyncHandler(async (req, res) => {
  const deleted = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
  
  if (!deleted) {
    throw new NotFoundError('Expense');
  }
  
  logger.info('Expense deleted', { id: req.params.id, userId: req.userId });
  res.json({ success: true });
});