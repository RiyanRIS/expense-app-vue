const Category = require('../models/Category');
const { asyncHandler } = require('../middlewares/errorHandler');
const {
  ValidationError,
  NotFoundError
} = require('../middlewares/errorHandler');
const { logger } = require('../config/logger');

/**
 * Category Controller
 * Handle category operations: create, read, update, delete
 */

/**
 * @desc    Get all categories for authenticated user
 * @route   GET /api/categories
 * @access  Private
 */
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.userId });
  res.json(categories);
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    throw new ValidationError("Category name is required");
  }

  // Check if category already exists for this user
  const existingCategory = await Category.findOne({ name, user: req.userId });
  if (existingCategory) {
    throw new ValidationError("Category already exists");
  }
  
  const newCategory = new Category({ name, user: req.userId });
  await newCategory.save();
  
  logger.info('Category created', { name, userId: req.userId });
  res.status(201).json(newCategory);
});

/**
 * @desc    Update category name
 * @route   PUT /api/categories/:name
 * @access  Private
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;
  
  if (!newName) {
    throw new ValidationError("New category name is required");
  }

  // Check if new name already exists
  const existingCategory = await Category.findOne({ name: newName, user: req.userId });
  if (existingCategory) {
    throw new ValidationError("Category with new name already exists");
  }
  
  const updated = await Category.findOneAndUpdate(
    { name, user: req.userId },
    { name: newName },
    { new: true }
  );
  
  if (!updated) {
    throw new NotFoundError('Category');
  }
  
  logger.info('Category updated', { oldName: name, newName, userId: req.userId });
  res.json(updated);
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:name
 * @access  Private
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { name } = req.params;
  
  const deleted = await Category.findOneAndDelete({ name, user: req.userId });
  
  if (!deleted) {
    throw new NotFoundError('Category');
  }
  
  logger.info('Category deleted', { name, userId: req.userId });
  res.json({ success: true });
});