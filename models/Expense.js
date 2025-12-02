const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  date: { type: String },
  input_date: { type: String },
  input_time: { type: String }
}, { 
  collection: 'expense',
  timestamps: true 
});

// Index untuk optimize query
ExpenseSchema.index({ user: 1, input_date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
