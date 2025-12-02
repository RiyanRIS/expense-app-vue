const express = require('express');
const router = express.Router();
const paymentSourceController = require('../controllers/paymentSourceController');
const { protect } = require('../middlewares/auth');
const {
  validateCreatePaymentSource,
  validateUpdatePaymentSource,
  validatePaymentSourceName
} = require('../middlewares/validation');

// All payment source routes require authentication
router.use(protect);

router.route('/')
  .get(paymentSourceController.getAllPaymentSources)
  .post(validateCreatePaymentSource, paymentSourceController.createPaymentSource);

router.route('/:name')
  .put(validateUpdatePaymentSource, paymentSourceController.updatePaymentSource)
  .delete(validatePaymentSourceName, paymentSourceController.deletePaymentSource);

module.exports = router;