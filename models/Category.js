import mongoose from 'mongoose';

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
}, {
  collection: 'category',
  timestamps: true
});

// Compound index untuk unique name per user
CategorySchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.model('Category', CategorySchema);