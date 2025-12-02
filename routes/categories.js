const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middlewares/auth');
const {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryName
} = require('../middlewares/validation');

// All category routes require authentication
router.use(protect);

router.route('/')
  .get(categoryController.getAllCategories)
  .post(validateCreateCategory, categoryController.createCategory);

router.route('/:name')
  .put(validateUpdateCategory, categoryController.updateCategory)
  .delete(validateCategoryName, categoryController.deleteCategory);

module.exports = router;