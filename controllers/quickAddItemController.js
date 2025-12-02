const QuickAddItem = require('../models/QuickAddItem');
const { asyncHandler } = require('../middlewares/errorHandler');
const {
  ValidationError,
  NotFoundError
} = require('../middlewares/errorHandler');
const { logger } = require('../config/logger');

/**
 * QuickAddItem Controller
 * Handle quick add item operations: create, read, update, delete
 */

/**
 * @desc    Get all quick add items for authenticated user
 * @route   GET /api/quick-add-items
 * @access  Private
 */
exports.getAllQuickAddItems = asyncHandler(async (req, res) => {
  const quickAddItems = await QuickAddItem.find({ user: req.userId });
  res.json({
    success: true,
    count: quickAddItems.length,
    quickAddItems: quickAddItems
  });
});

/**
 * @desc    Create new quick add item
 * @route   POST /api/quick-add-items
 * @access  Private
 */
exports.createQuickAddItem = asyncHandler(async (req, res) => {
  const { name, amount, category, paymentSource } = req.body;

  if (!name || !amount) {
    throw new ValidationError("Name and amount are required");
  }

  // Check if quick add item already exists for this user
  const existingItem = await QuickAddItem.findOne({ name, user: req.userId });
  if (existingItem) {
    throw new ValidationError("Quick add item with this name already exists");
  }

  const newItem = new QuickAddItem({
    name,
    amount,
    category,
    paymentSource,
    user: req.userId
  });

  await newItem.save();
  
  logger.info('Quick add item created', { name, amount, userId: req.userId });
  res.status(201).json(newItem);
});

/**
 * @desc    Update quick add item
 * @route   PUT /api/quick-add-items/:id
 * @access  Private
 */
exports.updateQuickAddItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // If name is being updated, check for duplicates
  if (updates.name) {
    const existingItem = await QuickAddItem.findOne({
      name: updates.name,
      user: req.userId,
      _id: { $ne: id } // Exclude current item from duplicate check
    });
    
    if (existingItem) {
      throw new ValidationError("Quick add item with this name already exists");
    }
  }

  const updated = await QuickAddItem.findOneAndUpdate(
    { _id: id, user: req.userId },
    updates,
    { new: true }
  );

  if (!updated) {
    throw new NotFoundError('Quick add item');
  }

  logger.info('Quick add item updated', { id, userId: req.userId });
  res.json(updated);
});

/**
 * @desc    Delete quick add item
 * @route   DELETE /api/quick-add-items/:id
 * @access  Private
 */
exports.deleteQuickAddItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await QuickAddItem.findOneAndDelete({
    _id: id,
    user: req.userId
  });

  if (!deleted) {
    throw new NotFoundError('Quick add item');
  }

  logger.info('Quick add item deleted', { id, userId: req.userId });
  res.json({ success: true });
});