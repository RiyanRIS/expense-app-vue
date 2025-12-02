require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const webpush = require("web-push");

// Import logger
const { logger, morganStream } = require("./config/logger");

// Import routes
const apiRoutes = require('./routes');

// Import error handler
const {
  notFoundHandler,
  errorHandler,
  handleUncaughtException,
  handleUnhandledRejection,
  handleSIGTERM
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

// ================== API ROUTES ==================
app.use('/api', apiRoutes);

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

