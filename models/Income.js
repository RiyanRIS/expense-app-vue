const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
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
  source: {
    type: String,
    required: false,
    default: ''
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  date: { type: String },
  input_date: { type: String },
  input_time: { type: String }
}, { 
  collection: 'income',
  timestamps: true 
});

// Index untuk optimize query
IncomeSchema.index({ user: 1, input_date: -1 });
IncomeSchema.index({ user: 1, category: 1 });
IncomeSchema.index({ user: 1, source: 1 });

module.exports = mongoose.model('Income', IncomeSchema);
