import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

/**
 * Winston Logger Configuration
 * 
 * Features:
 * - Console logging dengan colorize
 * - File logging dengan daily rotation
 * - Separate files untuk error dan combined logs
 * - Timestamp & custom format
 * - Max file size & max days retention
 */

// Custom format untuk log output
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // Tambahkan metadata jika ada
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    // Tambahkan stack trace untuk error
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Transport untuk console (development)
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      let log = `${timestamp} ${level}: ${message}`;
      if (stack) {
        log += `\n${stack}`;
      }
      return log;
    })
  )
});

// Transport untuk file - Combined logs (semua level)
const combinedFileTransport = new DailyRotateFile({
  filename: path.join('logs', 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m', // Max 20MB per file
  maxFiles: '14d', // Keep logs for 14 days
  format: customFormat
});

// Transport untuk file - Error logs only
const errorFileTransport = new DailyRotateFile({
  filename: path.join('logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '30d', // Keep error logs for 30 days
  format: customFormat
});

// Transport untuk file - HTTP logs (untuk Morgan)
const httpFileTransport = new DailyRotateFile({
  filename: path.join('logs', 'http-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '7d', // Keep HTTP logs for 7 days
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, message }) => `${timestamp} ${message}`)
  )
});

// Buat logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [
    errorFileTransport,
    combinedFileTransport
  ],
  // Handle uncaught exceptions - disabled karena menggunakan manual handler
  // exceptionHandlers: [
  //   new DailyRotateFile({
  //     filename: path.join('logs', 'exceptions-%DATE%.log'),
  //     datePattern: 'YYYY-MM-DD',
  //     maxSize: '20m',
  //     maxFiles: '30d'
  //   })
  // ],
  // Handle unhandled promise rejections - disabled karena menggunakan manual handler
  // rejectionHandlers: [
  //   new DailyRotateFile({
  //     filename: path.join('logs', 'rejections-%DATE%.log'),
  //     datePattern: 'YYYY-MM-DD',
  //     maxSize: '20m',
  //     maxFiles: '30d'
  //   })
  // ]
});

// Add console transport di development
if (process.env.NODE_ENV !== 'production') {
  logger.add(consoleTransport);
}

// HTTP Logger untuk Morgan
const httpLogger = winston.createLogger({
  level: 'info',
  transports: [httpFileTransport],
  format: winston.format.printf(({ message }) => message)
});

// Stream untuk Morgan middleware
export const morganStream = {
  write: (message) => {
    httpLogger.info(message.trim());
  }
};

// Helper functions untuk structured logging
logger.logRequest = (req, statusCode, responseTime) => {
  const logData = {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    statusCode,
    responseTime: `${responseTime}ms`
  };
  
  if (statusCode >= 500) {
    logger.error('Server Error', logData);
  } else if (statusCode >= 400) {
    logger.warn('Client Error', logData);
  } else {
    logger.info('Request', logData);
  }
};

logger.logError = (error, req = null) => {
  const logData = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  };
  
  if (req) {
    logData.request = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection.remoteAddress,
      body: req.body,
      params: req.params,
      query: req.query
    };
  }
  
  logger.error('Application Error', logData);
};

logger.logDatabase = (operation, collection, data = {}) => {
  logger.info('Database Operation', {
    operation,
    collection,
    ...data
  });
};

export default logger;
