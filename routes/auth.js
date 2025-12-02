const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/auth');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/reactivate', authController.reactivateAccount);

// Protected routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);
router.delete('/account', protect, authController.deleteAccount);



// Admin only routes
router.get('/users', protect, restrictTo('admin'), authController.getAllUsers);
router.get('/stats', protect, restrictTo('admin'), authController.getUserStats);

// Account reactivation
router.post('/reactivate', authController.reactivateAccount);

// Temporary testing endpoint - remove in production  
router.post('/test-suspend/:email', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = 'suspended';
    await user.save();
    res.json({ message: 'User suspended for testing', userId: user._id, status: user.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;