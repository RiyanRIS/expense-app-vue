import { body, param, validationResult } from 'express-validator';

/**
 * Middleware untuk menangani hasil validasi
 * Jika ada error, return 400 dengan detail error
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

/**
 * Validasi untuk POST /api/expenses
 */
const validateCreateExpense = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Format tanggal harus ISO8601 (YYYY-MM-DD)'),
  
  body('store')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Nama toko maksimal 200 karakter')
    .escape(),
  
  body('item')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Nama barang maksimal 200 karakter')
    .escape(),
  
  body('amount')
    .optional()
    .trim()
    .custom((value) => {
      // Cek apakah bisa dikonversi ke number
      const num = parseFloat(value);
      if (isNaN(num)) {
        throw new Error('Jumlah harus berupa angka');
      }
      if (num < 0) {
        throw new Error('Jumlah tidak boleh negatif');
      }
      return true;
    }),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Kategori maksimal 100 karakter')
    .escape(),
  
  body('payment_source')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Sumber pembayaran maksimal 100 karakter')
    .escape(),
  
  body('input_date')
    .optional()
    .isISO8601()
    .withMessage('Format input_date harus ISO8601 (YYYY-MM-DD)'),
  
  body('input_time')
    .optional()
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Format input_time harus HH:MM:SS'),
  
  handleValidationErrors
];

/**
 * Validasi untuk PUT /api/expenses/:id
 */
const validateUpdateExpense = [
  param('id')
    .isMongoId()
    .withMessage('ID expense tidak valid'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Format tanggal harus ISO8601 (YYYY-MM-DD)'),
  
  body('store')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Nama toko maksimal 200 karakter')
    .escape(),
  
  body('item')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Nama barang maksimal 200 karakter')
    .escape(),
  
  body('amount')
    .optional()
    .trim()
    .custom((value) => {
      const num = parseFloat(value);
      if (isNaN(num)) {
        throw new Error('Jumlah harus berupa angka');
      }
      if (num < 0) {
        throw new Error('Jumlah tidak boleh negatif');
      }
      return true;
    }),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Kategori maksimal 100 karakter')
    .escape(),
  
  body('payment_source')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Sumber pembayaran maksimal 100 karakter')
    .escape(),
  
  handleValidationErrors
];

/**
 * Validasi untuk GET/DELETE /api/expenses/:id
 */
const validateExpenseId = [
  param('id')
    .isMongoId()
    .withMessage('ID expense tidak valid'),
  
  handleValidationErrors
];

/**
 * Validasi untuk POST /api/categories
 */
const validateCreateCategory = [
  body('name')
    .notEmpty()
    .withMessage('Nama kategori tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nama kategori harus antara 1-100 karakter')
    .escape()
    .custom((value) => {
      // Cek karakter yang tidak diizinkan
      if (/<script|javascript:|on\w+=/i.test(value)) {
        throw new Error('Nama kategori mengandung karakter yang tidak diizinkan');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validasi untuk PUT /api/categories/:name
 */
const validateUpdateCategory = [
  param('name')
    .trim()
    .notEmpty()
    .withMessage('Nama kategori tidak boleh kosong'),
  
  body('newName')
    .notEmpty()
    .withMessage('Nama kategori baru tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nama kategori baru harus antara 1-100 karakter')
    .escape()
    .custom((value) => {
      if (/<script|javascript:|on\w+=/i.test(value)) {
        throw new Error('Nama kategori mengandung karakter yang tidak diizinkan');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validasi untuk DELETE /api/categories/:name
 */
const validateCategoryName = [
  param('name')
    .trim()
    .notEmpty()
    .withMessage('Nama kategori tidak boleh kosong'),
  
  handleValidationErrors
];

/**
 * Validasi untuk POST /api/payment-sources
 */
const validateCreatePaymentSource = [
  body('name')
    .notEmpty()
    .withMessage('Nama sumber pembayaran tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nama sumber pembayaran harus antara 1-100 karakter')
    .escape()
    .custom((value) => {
      if (/<script|javascript:|on\w+=/i.test(value)) {
        throw new Error('Nama sumber pembayaran mengandung karakter yang tidak diizinkan');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validasi untuk PUT /api/payment-sources/:name
 */
const validateUpdatePaymentSource = [
  param('name')
    .trim()
    .notEmpty()
    .withMessage('Nama sumber pembayaran tidak boleh kosong'),
  
  body('newName')
    .notEmpty()
    .withMessage('Nama sumber pembayaran baru tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nama sumber pembayaran baru harus antara 1-100 karakter')
    .escape()
    .custom((value) => {
      if (/<script|javascript:|on\w+=/i.test(value)) {
        throw new Error('Nama sumber pembayaran mengandung karakter yang tidak diizinkan');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validasi untuk DELETE /api/payment-sources/:name
 */
const validatePaymentSourceName = [
  param('name')
    .trim()
    .notEmpty()
    .withMessage('Nama sumber pembayaran tidak boleh kosong'),
  
  handleValidationErrors
];

/**
 * Validasi untuk POST /api/quick-add-items
 */
const validateCreateQuickAddItem = [
  body('name')
    .notEmpty()
    .withMessage('Nama item tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Nama item harus antara 1-200 karakter')
    .escape()
    .custom((value) => {
      if (/<script|javascript:|on\w+=/i.test(value)) {
        throw new Error('Nama item mengandung karakter yang tidak diizinkan');
      }
      return true;
    }),

  body('amount')
    .notEmpty()
    .withMessage('Jumlah tidak boleh kosong')
    .isNumeric()
    .withMessage('Jumlah harus berupa angka')
    .custom((value) => {
      const num = parseFloat(value);
      if (num < 0) {
        throw new Error('Jumlah tidak boleh negatif');
      }
      if (num > 10000000) {
        throw new Error('Jumlah maksimal 10.000.000');
      }
      return true;
    }),

  body('category')
    .notEmpty()
    .withMessage('Kategori tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Kategori harus antara 1-100 karakter')
    .escape(),

  body('paymentSource')
    .notEmpty()
    .withMessage('Sumber pembayaran tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Sumber pembayaran harus antara 1-100 karakter')
    .escape(),

  handleValidationErrors
];

/**
 * Validasi untuk PUT /api/quick-add-items/:id
 */
const validateUpdateQuickAddItem = [
  param('id')
    .isMongoId()
    .withMessage('ID item tidak valid'),

  body('name')
    .optional()
    .notEmpty()
    .withMessage('Nama item tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Nama item harus antara 1-200 karakter')
    .escape()
    .custom((value) => {
      if (/<script|javascript:|on\w+=/i.test(value)) {
        throw new Error('Nama item mengandung karakter yang tidak diizinkan');
      }
      return true;
    }),

  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Jumlah harus berupa angka')
    .custom((value) => {
      const num = parseFloat(value);
      if (num < 0) {
        throw new Error('Jumlah tidak boleh negatif');
      }
      if (num > 10000000) {
        throw new Error('Jumlah maksimal 10.000.000');
      }
      return true;
    }),

  body('category')
    .optional()
    .notEmpty()
    .withMessage('Kategori tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Kategori harus antara 1-100 karakter')
    .escape(),

  body('paymentSource')
    .optional()
    .notEmpty()
    .withMessage('Sumber pembayaran tidak boleh kosong')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Sumber pembayaran harus antara 1-100 karakter')
    .escape(),

  handleValidationErrors
];

/**
 * Validasi untuk DELETE /api/quick-add-items/:id
 */
const validateQuickAddItemId = [
  param('id')
    .isMongoId()
    .withMessage('ID item tidak valid'),

  handleValidationErrors
];

/**
 * Validasi untuk POST /api/restore
 */
const validateRestore = [
  body('expenses')
    .optional()
    .isArray()
    .withMessage('Expenses harus berupa array'),
  
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories harus berupa array'),
  
  body('paymentSources')
    .optional()
    .isArray()
    .withMessage('Payment sources harus berupa array'),
  
  handleValidationErrors
];

/**
 * Validasi untuk POST /api/subscribe
 */
const validateSubscribe = [
  body('endpoint')
    .notEmpty()
    .withMessage('Endpoint tidak boleh kosong')
    .isURL()
    .withMessage('Endpoint harus berupa URL yang valid'),
  
  body('keys.p256dh')
    .notEmpty()
    .withMessage('Key p256dh tidak boleh kosong'),
  
  body('keys.auth')
    .notEmpty()
    .withMessage('Key auth tidak boleh kosong'),
  
  handleValidationErrors
];

/**
 * Validasi untuk POST /api/unsubscribe
 */
const validateUnsubscribe = [
  body('endpoint')
    .notEmpty()
    .withMessage('Endpoint tidak boleh kosong')
    .isURL()
    .withMessage('Endpoint harus berupa URL yang valid'),
  
  handleValidationErrors
];

/**
 * Validasi untuk POST /api/push-notification
 */
const validatePushNotification = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title maksimal 100 karakter')
    .escape(),
  
  body('body')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Body maksimal 500 karakter')
    .escape(),
  
  body('subscription')
    .notEmpty()
    .withMessage('Subscription tidak boleh kosong'),
  
  body('subscription.endpoint')
    .notEmpty()
    .withMessage('Subscription endpoint tidak boleh kosong')
    .isURL()
    .withMessage('Subscription endpoint harus berupa URL yang valid'),
  
  handleValidationErrors
];

export {
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
};
