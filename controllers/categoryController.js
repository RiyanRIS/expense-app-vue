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
  const { type } = req.query;
  const query = { user: req.userId };
  
  // Filter by type if provided (expense or income)
  if (type && ['expense', 'income'].includes(type)) {
    query.type = type;
  }
  
  const categories = await Category.find(query);
  res.json({
    success: true,
    count: categories.length,
    categories: categories
  });
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, type = 'expense' } = req.body;
  
  if (!name) {
    throw new ValidationError("Category name is required");
  }
  
  // Validate type
  if (type && !['expense', 'income'].includes(type)) {
    throw new ValidationError("Type must be either 'expense' or 'income'");
  }

  // Check if category already exists for this user with same type
  const existingCategory = await Category.findOne({ name, user: req.userId, type });
  if (existingCategory) {
    throw new ValidationError("Category already exists for this type");
  }
  
  const newCategory = new Category({ name, user: req.userId, type });
  await newCategory.save();
  
  logger.info('Category created', { name, type, userId: req.userId });
  res.status(201).json(newCategory);
});

/**
 * @desc    Update category name
 * @route   PUT /api/categories/:name
 * @access  Private
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { name: newName, type } = req.body;
  
  if (!newName) {
    throw new ValidationError("New category name is required");
  }
  
  // Validate type if provided
  if (type && !['expense', 'income'].includes(type)) {
    throw new ValidationError("Type must be either 'expense' or 'income'");
  }

  // Find the category to update
  const category = await Category.findOne({ name, user: req.userId });
  if (!category) {
    throw new NotFoundError('Category');
  }
  
  // Check if new name already exists with same type
  const existingCategory = await Category.findOne({ 
    name: newName, 
    user: req.userId,
    type: type || category.type,
    _id: { $ne: category._id }
  });
  if (existingCategory) {
    throw new ValidationError("Category with new name already exists for this type");
  }
  
  const updateData = { name: newName };
  if (type) {
    updateData.type = type;
  }
  
  const updated = await Category.findOneAndUpdate(
    { _id: category._id },
    updateData,
    { new: true }
  );
  
  logger.info('Category updated', { oldName: name, newName, type: updated.type, userId: req.userId });
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