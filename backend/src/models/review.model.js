import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  hangout: {
    type: Schema.Types.ObjectId,
    ref: 'Hangout',
    required: true,
  },
  reviewer: { // The user who is writing the review
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewee: { // The user who is being reviewed
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// A user should only be able to review another user once per hangout
reviewSchema.index({ hangout: 1, reviewer: 1, reviewee: 1 }, { unique: true });

export default model('Review', reviewSchema);