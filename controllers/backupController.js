const Expense = require('../models/Expense');
const Category = require('../models/Category');
const PaymentSource = require('../models/PaymentSource');
const QuickAddItem = require('../models/QuickAddItem');
const { asyncHandler } = require('../middlewares/errorHandler');
const {
  ValidationError
} = require('../middlewares/errorHandler');
const { logger } = require('../config/logger');

/**
 * Backup/Restore Controller
 * Handle backup and restore operations for user data
 */

/**
 * @desc    Get backup data for authenticated user
 * @route   GET /api/backup
 * @access  Private
 */
exports.getBackup = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.userId });
  const categories = (await Category.find({ user: req.userId })).map((c) => c.name);
  const paymentSources = (await PaymentSource.find({ user: req.userId })).map((p) => p.name);
  const quickAddItems = await QuickAddItem.find({ user: req.userId });
  
  logger.info('Backup data retrieved', {
    userId: req.userId,
    expensesCount: expenses.length,
    categoriesCount: categories.length,
    paymentSourcesCount: paymentSources.length,
    quickAddItemsCount: quickAddItems.length
  });
  
  res.json({ expenses, categories, paymentSources, quickAddItems });
});

/**
 * @desc    Restore user data from backup
 * @route   POST /api/restore
 * @access  Private
 */
exports.restoreBackup = asyncHandler(async (req, res) => {
  const {
    expenses = [],
    categories = [],
    paymentSources = [],
    quickAddItems = [],
  } = req.body || {};

  if (!Array.isArray(expenses) || !Array.isArray(categories) || 
      !Array.isArray(paymentSources) || !Array.isArray(quickAddItems)) {
    throw new ValidationError('Invalid backup data format');
  }

  // Delete existing user data before restore
  await Expense.deleteMany({ user: req.userId });
  await Category.deleteMany({ user: req.userId });
  await PaymentSource.deleteMany({ user: req.userId });
  await QuickAddItem.deleteMany({ user: req.userId });

  let categoriesUpserted = 0;
  for (const name of categories) {
    if (!name) continue;
    const existing = await Category.findOne({ name, user: req.userId });
    if (!existing) {
      const cat = new Category({ name, user: req.userId });
      await cat.save();
      categoriesUpserted++;
    }
  }

  let paymentSourcesUpserted = 0;
  for (const name of paymentSources) {
    if (!name) continue;
    const existing = await PaymentSource.findOne({ name, user: req.userId });
    if (!existing) {
      const ps = new PaymentSource({ name, user: req.userId });
      await ps.save();
      paymentSourcesUpserted++;
    }
  }

  let quickAddItemsUpserted = 0;
  for (const item of quickAddItems) {
    if (!item.name || !item.amount) continue;
    const existing = await QuickAddItem.findOne({ name: item.name, user: req.userId });
    if (!existing) {
      const qai = new QuickAddItem({
        name: item.name,
        amount: item.amount,
        category: item.category,
        paymentSource: item.paymentSource,
        user: req.userId
      });
      await qai.save();
      quickAddItemsUpserted++;
    }
  }

  // Restore expenses
  const now = new Date();
  const gmt7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const expensesToInsert = expenses.map((payload) => {
    const copy = { ...payload };
    delete copy._id;
    delete copy.id;
    delete copy.createdAt;
    delete copy._local;
    copy.user = req.userId; // Set user ID
    copy.input_date = copy.input_date || gmt7.toISOString().split("T")[0];
    copy.input_time =
      copy.input_time || gmt7.toISOString().split("T")[1].split(".")[0];
    return copy;
  });

  let expensesInserted = 0;
  if (expensesToInsert.length) {
    const inserted = await Expense.insertMany(expensesToInsert, {
      ordered: false,
    });
    expensesInserted = inserted.length;
  }

  logger.info('Data restored from backup', {
    userId: req.userId,
    expensesInserted,
    categoriesUpserted,
    paymentSourcesUpserted,
    quickAddItemsUpserted
  });

  res.json({ 
    expensesInserted, 
    categoriesUpserted, 
    paymentSourcesUpserted, 
    quickAddItemsUpserted 
  });
});