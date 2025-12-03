const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense',
    required: true
  }
}, {
  collection: 'category',
  timestamps: true
});

// Compound index untuk unique name per user per type
CategorySchema.index({ name: 1, user: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);