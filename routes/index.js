const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const expenseRoutes = require('./expenses');
const incomeRoutes = require('./incomes');
const categoryRoutes = require('./categories');
const paymentSourceRoutes = require('./paymentSources');
const quickAddItemRoutes = require('./quickAddItems');
const backupRoutes = require('./backup');
const pushNotificationRoutes = require('./pushNotifications');

// Mount routes
router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/incomes', incomeRoutes);
router.use('/categories', categoryRoutes);
router.use('/payment-sources', paymentSourceRoutes);
router.use('/quick-add-items', quickAddItemRoutes);
router.use('/', backupRoutes); // backup and restore routes
router.use('/', pushNotificationRoutes); // push notification routes

module.exports = router;