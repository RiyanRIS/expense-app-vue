require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const webpush = require("web-push");
const PushSubscription = require("./models/PushSubscription");

const Expense = require("./models/Expense");
const Category = require("./models/Category");
const PaymentSource = require("./models/PaymentSource");
const QuickAddItem = require("./models/QuickAddItem");
const User = require("./models/User");

// Import logger
const { logger, morganStream } = require("./config/logger");

// Import auth middleware
const { protect, restrictTo } = require("./middlewares/auth");

// Import auth controller
const authController = require("./controllers/authController");

// Import validation middleware
const {
  validateCreateExpense,
  validateUpdateExpense,
  validateExpenseId,
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryName,
  validateCreatePaymentSource,
  validateUpdatePaymentSource,
  validatePaymentSourceName,
  validateCreateQuickAddItem,
  validateUpdateQuickAddItem,
  validateQuickAddItemId,
  validateRestore,
  validateSubscribe,
  validateUnsubscribe,
  validatePushNotification
} = require("./middlewares/validation");

// Import error handler
const {
  asyncHandler,
  notFoundHandler,
  errorHandler,
  handleUncaughtException,
  handleUnhandledRejection,
  handleSIGTERM,
  NotFoundError,
  DatabaseError
} = require("./middlewares/errorHandler");

// Handle uncaught exceptions BEFORE anything else
// handleUncaughtException();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Add size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging dengan Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Console output di development
}
app.use(morgan('combined', { stream: morganStream })); // File logging untuk semua environment

app.use(express.static(path.join(__dirname, "public")));

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CLUSTER = process.env.DB_CLUSTER;
const DB_NAME = process.env.DB_NAME || "riyanris";
const PORT = process.env.PORT || 3000;

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto:example@example.com",
  publicVapidKey,
  privateVapidKey
);

const mongoUri = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(
  DB_PASSWORD
)}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('MongoDB connected successfully', {
      database: DB_NAME,
      cluster: DB_CLUSTER
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection error", {
      error: err.message,
      stack: err.stack
    });
    process.exit(1);
  });

// ================== AUTH ROUTES ==================
// Public routes
app.post("/api/auth/signup", authController.signup);
app.post("/api/auth/login", authController.login);
app.post("/api/auth/forgot-password", authController.forgotPassword);
app.post("/api/auth/reset-password/:token", authController.resetPassword);

// Protected routes
app.post("/api/auth/logout", protect, authController.logout);
app.get("/api/auth/me", protect, authController.getMe);
app.put("/api/auth/profile", protect, authController.updateProfile);
app.put("/api/auth/change-password", protect, authController.changePassword);
app.delete("/api/auth/account", protect, authController.deleteAccount);

// Admin only routes
app.get("/api/auth/users", protect, restrictTo('admin'), authController.getAllUsers);
app.get("/api/auth/stats", protect, restrictTo('admin'), authController.getUserStats);

// ================== EXPENSE ROUTES ==================
// Protected: All expense routes require authentication
app.get("/api/expenses", protect, asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.userId }).sort({ _id: -1 }).limit(200);
  logger.info('Fetched expenses', { count: expenses.length, userId: req.userId });
  res.json(expenses);
}));

app.get("/api/expenses/:id", protect, validateExpenseId, asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.userId });
  if (!expense) {
    throw new NotFoundError('Expense');
  }
  res.json(expense);
}));

app.post("/api/expenses", protect, validateCreateExpense, asyncHandler(async (req, res) => {
  const payload = req.body;
  const now = new Date();
  const gmt7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  payload.user = req.userId; // Add user ID
  payload.input_date = payload.input_date || gmt7.toISOString().split("T")[0];
  payload.input_time =
    payload.input_time || gmt7.toISOString().split("T")[1].split(".")[0];
  delete payload.id;
  delete payload.createdAt;
  delete payload._local;
  const expense = new Expense(payload);
  await expense.save();
  logger.info('Expense created', { id: expense._id, item: expense.item });
  res.status(201).json(expense);
}));

app.put("/api/expenses/:id", protect, validateUpdateExpense, asyncHandler(async (req, res) => {
  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  if (!updated) {
    throw new NotFoundError('Expense');
  }
  logger.info('Expense updated', { id: updated._id, userId: req.userId });
  res.json(updated);
}));

app.delete("/api/expenses/:id", protect, validateExpenseId, asyncHandler(async (req, res) => {
  const deleted = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!deleted) {
    throw new NotFoundError('Expense');
  }
  logger.info('Expense deleted', { id: req.params.id, userId: req.userId });
  res.json({ success: true });
}));

// ================== CATEGORY & PAYMENT SOURCE ROUTES ==================
// Protected: require authentication
app.get("/api/categories", protect, asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.userId });
  res.json(categories);
}));

app.get("/api/payment-sources", protect, asyncHandler(async (req, res) => {
  const paymentSources = await PaymentSource.find({ user: req.userId });
  res.json(paymentSources);
}));

app.post("/api/categories", protect, validateCreateCategory, asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ValidationError("Category name is required");
  }
  const newCategory = new Category({ name, user: req.userId });
  await newCategory.save();
  res.status(201).json(newCategory);
}));

app.put("/api/categories/:name", protect, validateUpdateCategory, asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;
  if (!newName) {
    throw new ValidationError("New category name is required");
  }
  const updated = await Category.findOneAndUpdate(
    { name, user: req.userId },
    { name: newName },
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ error: "Category not found" });
  }
  res.json(updated);
}));

app.delete("/api/categories/:name", protect, validateCategoryName, asyncHandler(async (req, res) => {
  const { name } = req.params;
  const deleted = await Category.findOneAndDelete({ name, user: req.userId });
  if (!deleted) {
    return res.status(404).json({ error: "Category not found" });
  }
  res.json({ success: true });
}));

app.post("/api/payment-sources", protect, validateCreatePaymentSource, asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ValidationError("Payment source name is required");
  }
  const newPaymentSource = new PaymentSource({ name, user: req.userId });
  await newPaymentSource.save();
  res.status(201).json(newPaymentSource);
}));

app.put("/api/payment-sources/:name", protect, validateUpdatePaymentSource, asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;
  if (!newName) {
    throw new ValidationError("New payment source name is required");
  }
  const updated = await PaymentSource.findOneAndUpdate(
    { name, user: req.userId },
    { name: newName },
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ error: "Payment source not found" });
  }
  res.json(updated);
}));

app.delete("/api/payment-sources/:name", protect, validatePaymentSourceName, asyncHandler(async (req, res) => {
  const { name } = req.params;
  const deleted = await PaymentSource.findOneAndDelete({ name, user: req.userId });
  if (!deleted) {
    return res.status(404).json({ error: "Payment source not found" });
  }
  res.json({ success: true});
}));

// ================== QUICK ADD ITEMS ROUTES ==================
// Protected: require authentication
app.get("/api/quick-add-items", protect, asyncHandler(async (req, res) => {
  const quickAddItems = await QuickAddItem.find({ user: req.userId });
  res.json(quickAddItems);
}));

app.post("/api/quick-add-items", protect, validateCreateQuickAddItem, asyncHandler(async (req, res) => {
  const { name, amount, category, paymentSource } = req.body;

  const newItem = new QuickAddItem({
    name,
    amount,
    category,
    paymentSource,
    user: req.userId
  });

  await newItem.save();
  res.status(201).json(newItem);
}));

app.put("/api/quick-add-items/:id", protect, validateUpdateQuickAddItem, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updated = await QuickAddItem.findOneAndUpdate(
    { _id: id, user: req.userId },
    updates,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ error: "Quick add item not found" });
  }

  res.json(updated);
}));

app.delete("/api/quick-add-items/:id", protect, validateQuickAddItemId, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await QuickAddItem.findOneAndDelete({
    _id: id,
    user: req.userId
  });

  if (!deleted) {
    return res.status(404).json({ error: "Quick add item not found" });
  }

  res.json({ success: true });
}));

app.get("/api/backup", protect, asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.userId });
  const categories = (await Category.find({ user: req.userId })).map((c) => c.name);
  const paymentSources = (await PaymentSource.find({ user: req.userId })).map((p) => p.name);
  const quickAddItems = await QuickAddItem.find({ user: req.userId });
  res.json({ expenses, categories, paymentSources, quickAddItems });
}));

app.post("/api/restore", protect, validateRestore, asyncHandler(async (req, res) => {
  const {
    expenses = [],
    categories = [],
    paymentSources = [],
    quickAddItems = [],
  } = req.body || {};

  // Hapus data milik user sebelum restore
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

  res.json({ expensesInserted, categoriesUpserted, paymentSourcesUpserted, quickAddItemsUpserted });
}));

app.post("/api/subscribe", protect, validateSubscribe, asyncHandler(async (req, res) => {
  const subscription = req.body;
  const existingSubscription = await PushSubscription.findOne({
    endpoint: subscription.endpoint,
  });
  if (existingSubscription) {
    return res.status(200).json({ message: "Subscription already exists." });
  }
  const newSubscription = new PushSubscription(subscription);
  await newSubscription.save();
  res.status(201).json({ message: "Subscription saved." });
}));

app.post("/api/unsubscribe", protect, validateUnsubscribe, asyncHandler(async (req, res) => {
  const { endpoint } = req.body;
  const deleted = await PushSubscription.findOneAndDelete({ endpoint });
  if (deleted) {
    res.status(200).json({ message: "Subscription removed." });
  } else {
    res.status(404).json({ message: "Subscription not found." });
  }
}));

app.post("/api/push-notification", protect, validatePushNotification, asyncHandler(async (req, res) => {
  const { title, body, subscription } = req.body;

  if (!subscription) {
    throw new ValidationError("Subscription is required.");
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
    res.status(200).json({ message: "Push notifications sent." });
  } catch (error) {
    logger.error("Error sending push notification", { error: error.message });
    if (error.statusCode === 410) {
      await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
    }
    throw error;
  }
}));

// 404 Handler - harus sebelum error handler
app.use(notFoundHandler);

// Global Error Handler - harus terakhir
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Handle process termination gracefully
handleUnhandledRejection(server);
handleSIGTERM(server);

