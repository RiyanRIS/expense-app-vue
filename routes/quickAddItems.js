const express = require('express');
const router = express.Router();
const quickAddItemController = require('../controllers/quickAddItemController');
const { protect } = require('../middlewares/auth');
const {
  validateCreateQuickAddItem,
  validateUpdateQuickAddItem,
  validateQuickAddItemId
} = require('../middlewares/validation');

// All quick add item routes require authentication
router.use(protect);

router.route('/')
  .get(quickAddItemController.getAllQuickAddItems)
  .post(validateCreateQuickAddItem, quickAddItemController.createQuickAddItem);

router.route('/:id')
  .put(validateUpdateQuickAddItem, quickAddItemController.updateQuickAddItem)
  .delete(validateQuickAddItemId, quickAddItemController.deleteQuickAddItem);

module.exports = router;