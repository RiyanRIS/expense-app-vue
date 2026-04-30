import mongoose from 'mongoose';

const PaymentSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  collection: 'payment_source',
  timestamps: true
});

// Compound index untuk unique name per user
PaymentSourceSchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.model('PaymentSource', PaymentSourceSchema);