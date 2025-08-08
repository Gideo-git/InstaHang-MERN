import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only need createdAt for messages
});

export default model('Message', messageSchema);