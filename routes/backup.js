const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const { protect } = require('../middlewares/auth');
const { validateRestore } = require('../middlewares/validation');

// All backup routes require authentication
router.use(protect);

router.get('/backup', backupController.getBackup);
router.post('/restore', validateRestore, backupController.restoreBackup);

module.exports = router;