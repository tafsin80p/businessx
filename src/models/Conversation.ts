import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  platform: { type: String, required: true, enum: ['messenger', 'instagram', 'whatsapp'] },
  platformUserId: { type: String, required: true }, // FB/IG/WA user ID
  customerName: { type: String },
  customerAvatar: { type: String },
  lastMessage: { type: String },
  lastMessageTime: { type: Date, default: Date.now },
  unreadCount: { type: Number, default: 0 },
});

export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
