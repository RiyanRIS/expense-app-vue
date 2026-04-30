import logger from '../config/logger.js';

/**
 * Custom Error Classes
 * Untuk membuat error yang lebih spesifik dan terstruktur
 */

class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500, false);
    this.name = 'DatabaseError';
  }
}

/**
 * Async Error Handler Wrapper
 * Wrap async route handlers untuk auto catch errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found Handler
 * Handle 404 errors untuk routes yang tidak ditemukan
 */
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  next(error);
};

/**
 * Development Error Response
 * Detailed error untuk debugging
 */
const sendErrorDev = (err, req, res) => {
  logger.logError(err, req);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      status: err.status,
      stack: err.stack,
      details: err.details || null
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      params: req.params,
      query: req.query
    }
  });
};

/**
 * Production Error Response
 * Minimal error info untuk security
 */
const sendErrorProd = (err, req, res) => {
  // Operational errors (yang kita expect)
  if (err.isOperational) {
    logger.logError(err, req);
    
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode
      }
    });
  } 
  // Programming errors atau unknown errors
  else {
    // Log full error untuk debugging
    logger.error('CRITICAL ERROR:', {
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack
      },
      request: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
      }
    });
    
    // Send generic message ke client
    res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong. Please try again later.',
        statusCode: 500
      }
    });
  }
};

/**
 * Handle Mongoose CastError (invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ValidationError(message);
};

/**
 * Handle Mongoose Duplicate Key Error
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value '${value}' for field '${field}'. Please use another value.`;
  return new ConflictError(message);
};

/**
 * Handle Mongoose Validation Error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ValidationError(message);
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => {
  return new UnauthorizedError('Invalid token. Please log in again.');
};

const handleJWTExpiredError = () => {
  return new UnauthorizedError('Your token has expired. Please log in again.');
};

/**
 * Global Error Handler Middleware
 * Harus dipanggil terakhir setelah semua routes
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  } else {
    // Fallback jika NODE_ENV tidak di-set
    sendErrorDev(err, req, res);
  }
};

/**
 * Handle Unhandled Promise Rejections
 */
const handleUnhandledRejection = (server) => {
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', {
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack
      }
    });
    
    // Graceful shutdown
    server.close(() => {
      process.exit(1);
    });
  });
};

/**
 * Handle Uncaught Exceptions
 */
const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack
      }
    });
    
    // Exit immediately
    process.exit(1);
  });
};

/**
 * Handle SIGTERM (Graceful Shutdown)
 */
const handleSIGTERM = (server) => {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Process terminated.');
    });
  });
};

export {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  DatabaseError,

  asyncHandler,
  notFoundHandler,
  errorHandler,

  handleUnhandledRejection,
  handleUncaughtException,
  handleSIGTERM
};
