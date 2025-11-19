const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
date: { type: String, required: true },
store: { type: String },
item: { type: String },
amount: { type: String },
category: { type: String },
payment_source: { type: String },
input_date: { type: String },
input_time: { type: String }
}, { collection: 'expense' });

module.exports = mongoose.model('Expense', ExpenseSchema);
