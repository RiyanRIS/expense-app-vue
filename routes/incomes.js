const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { protect } = require('../middlewares/auth');
const {
  validateCreateIncome,
  validateUpdateIncome,
  validateIncomeId
} = require('../middlewares/validation');

// All income routes require authentication
router.use(protect);

router.route('/')
  .get(incomeController.getAllIncomes)
  .post(validateCreateIncome, incomeController.createIncome);

router.route('/:id')
  .get(validateIncomeId, incomeController.getIncomeById)
  .put(validateUpdateIncome, incomeController.updateIncome)
  .delete(validateIncomeId, incomeController.deleteIncome);

module.exports = router;
