const express = require('express');
const router = express.Router();
const pushNotificationController = require('../controllers/pushNotificationController');
const { protect } = require('../middlewares/auth');
const {
  validateSubscribe,
  validateUnsubscribe,
  validatePushNotification
} = require('../middlewares/validation');

// All push notification routes require authentication
router.use(protect);

router.post('/subscribe', validateSubscribe, pushNotificationController.subscribe);
router.post('/unsubscribe', validateUnsubscribe, pushNotificationController.unsubscribe);
router.post('/push-notification', validatePushNotification, pushNotificationController.sendPushNotification);

module.exports = router;