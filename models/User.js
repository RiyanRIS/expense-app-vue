const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model untuk Authentication
 * 
 * Features:
 * - Email & password authentication
 * - Password hashing dengan bcrypt
 * - Role-based access (user, admin)
 * - Account status (active, suspended)
 * - Timestamps (createdAt, updatedAt)
 */

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name must not exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  avatar: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  passwordChangedAt: {
    type: Date,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  lastPasswordUpdate: {
    type: Date,
    default: null
  },
  previousPassword: {
    type: String,
    default: null,
    select: false // Don't return by default for security
  }
}, {
  timestamps: true, // Auto add createdAt & updatedAt
  collection: 'users'
});

/**
 * Pre-save middleware: Hash password before saving
 * Only hash jika password dimodifikasi atau baru
 */
UserSchema.pre('save', async function(next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: Compare password
 * @param {string} candidatePassword - Password dari user input
 * @returns {Promise<boolean>} - True jika password match
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Strict validation
    if (!candidatePassword || typeof candidatePassword !== 'string') {
      return false;
    }

    if (!this.password || typeof this.password !== 'string') {
      return false;
    }

    // CRITICAL: Use bcrypt compare - this is the security boundary
    const result = await bcrypt.compare(candidatePassword, this.password);
    
    // ENSURE we return exactly boolean true or false
    return result === true;
    
  } catch (error) {
    // Always return false on error for security
    return false;
  }
};

/**
 * Instance method: Check if password was changed after token was issued
 * @param {number} JWTTimestamp - JWT issued timestamp
 * @returns {boolean} - True jika password berubah setelah token issued
 */
UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

/**
 * Instance method: Generate password reset token
 * @returns {string} - Plain text reset token
 */
UserSchema.methods.createPasswordResetToken = function() {
  const crypto = require('crypto');
  
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and save to database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expiry (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  // Return plain text token (to send via email)
  return resetToken;
};

/**
 * Static method: Find active user by email
 * @param {string} email - User email
 * @returns {Promise<User>} - User document
 */
UserSchema.statics.findActiveByEmail = function(email) {
  return this.findOne({
    email: email.toLowerCase(),
    status: 'active'
  });
};

/**
 * Static method: Get user statistics
 * @returns {Promise<Object>} - User stats
 */
UserSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const total = await this.countDocuments();
  
  return {
    total,
    byStatus: stats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

/**
 * Virtual: Full name dengan capitalize
 */
UserSchema.virtual('displayName').get(function() {
  return this.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
});

/**
 * Method: toJSON override - Remove sensitive data
 */
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  
  // Remove sensitive fields
  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.__v;
  
  return user;
};

/**
 * Index untuk optimasi query
 */
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', UserSchema);
