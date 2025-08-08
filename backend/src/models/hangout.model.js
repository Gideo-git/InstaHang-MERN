import { Schema, model } from 'mongoose';

const hangoutSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export default model('Hangout', hangoutSchema);