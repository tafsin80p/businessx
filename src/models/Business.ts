import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const Business = mongoose.models.Business || mongoose.model('Business', BusinessSchema);
