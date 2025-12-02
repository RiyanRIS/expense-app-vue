const mongoose = require('mongoose');

const QuickAddItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: false,
    default: ''
  },
  payment_source: {
    type: String,
    required: false,
    default: ''
  },
  store: {
    type: String,
    required: false,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  collection: 'quick_add_item',
  timestamps: true
});

// Compound index untuk unique name per user
QuickAddItemSchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('QuickAddItem', QuickAddItemSchema);