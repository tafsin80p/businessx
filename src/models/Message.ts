import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: String, required: true },
  text: { type: String },
  mediaUrl: { type: String },
  isFromBusiness: { type: Boolean, default: false }, // true if sent by our app, false if sent by customer
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
