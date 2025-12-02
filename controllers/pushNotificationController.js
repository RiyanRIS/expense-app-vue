const webpush = require("web-push");
const PushSubscription = require('../models/PushSubscription');
const { asyncHandler } = require('../middlewares/errorHandler');
const {
  ValidationError
} = require('../middlewares/errorHandler');
const { logger } = require('../config/logger');

/**
 * Push Notification Controller
 * Handle push notification subscription and sending
 */

/**
 * @desc    Subscribe to push notifications
 * @route   POST /api/subscribe
 * @access  Private
 */
exports.subscribe = asyncHandler(async (req, res) => {
  const subscription = req.body;
  
  if (!subscription || !subscription.endpoint) {
    throw new ValidationError('Invalid subscription data');
  }

  const existingSubscription = await PushSubscription.findOne({
    endpoint: subscription.endpoint,
  });
  
  if (existingSubscription) {
    return res.status(200).json({ message: "Subscription already exists." });
  }
  
  const newSubscription = new PushSubscription(subscription);
  await newSubscription.save();
  
  logger.info('Push subscription saved', { 
    endpoint: subscription.endpoint,
    userId: req.userId 
  });
  
  res.status(201).json({ message: "Subscription saved." });
});

/**
 * @desc    Unsubscribe from push notifications
 * @route   POST /api/unsubscribe
 * @access  Private
 */
exports.unsubscribe = asyncHandler(async (req, res) => {
  const { endpoint } = req.body;
  
  if (!endpoint) {
    throw new ValidationError('Endpoint is required');
  }

  const deleted = await PushSubscription.findOneAndDelete({ endpoint });
  
  if (deleted) {
    logger.info('Push subscription removed', { 
      endpoint,
      userId: req.userId 
    });
    res.status(200).json({ message: "Subscription removed." });
  } else {
    res.status(404).json({ message: "Subscription not found." });
  }
});

/**
 * @desc    Send push notification
 * @route   POST /api/push-notification
 * @access  Private
 */
exports.sendPushNotification = asyncHandler(async (req, res) => {
  const { title, body, subscription } = req.body;

  if (!subscription) {
    throw new ValidationError("Subscription is required.");
  }

  if (!title && !body) {
    throw new ValidationError("Title or body is required.");
  }

  const notificationPayload = JSON.stringify({ title, body });

  const pushSubscription = {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  };
  
  try {
    await webpush.sendNotification(pushSubscription, notificationPayload);
    
    logger.info('Push notification sent', {
      endpoint: subscription.endpoint,
      title,
      userId: req.userId
    });
    
    res.status(200).json({ message: "Push notification sent." });
  } catch (error) {
    logger.error("Error sending push notification", { 
      error: error.message,
      endpoint: subscription.endpoint,
      userId: req.userId
    });
    
    // If subscription is invalid/expired, remove it from database
    if (error.statusCode === 410) {
      await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
    }
    
    throw error;
  }
});