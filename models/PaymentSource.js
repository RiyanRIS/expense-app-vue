const mongoose = require('mongoose');

const PaymentSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, { collection: 'payment_source' });

module.exports = mongoose.model('PaymentSource', PaymentSourceSchema);