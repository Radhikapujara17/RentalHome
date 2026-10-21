const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readAt: Date
}, { timestamps: true });

module.exports = {
  Conversation: mongoose.model('Conversation', conversationSchema),
  Message: mongoose.model('Message', messageSchema)
};
