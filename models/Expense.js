const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},
date: { type: String, required: true },
store: { type: String },
item: { type: String },
amount: { type: String },
category: { type: String },
payment_source: { type: String },
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
