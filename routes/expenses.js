const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middlewares/auth');
const {
  validateCreateExpense,
  validateUpdateExpense,
  validateExpenseId
} = require('../middlewares/validation');

// All expense routes require authentication
router.use(protect);

router.route('/')
  .get(expenseController.getAllExpenses)
  .post(validateCreateExpense, expenseController.createExpense);

router.route('/:id')
  .get(validateExpenseId, expenseController.getExpenseById)
  .put(validateUpdateExpense, expenseController.updateExpense)
  .delete(validateExpenseId, expenseController.deleteExpense);

module.exports = router;