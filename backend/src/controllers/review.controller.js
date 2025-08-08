import Review from '../models/Review.js';
import Hangout from '../models/Hangout.js';

// Create a new review
export const createReview = async (req, res) => {
  const { hangoutId, revieweeId, rating, comment } = req.body;
  const reviewerId = req.user.id;
  
  try {
    const hangout = await Hangout.findById(hangoutId);

    // Check 1: Hangout must be completed
    if (!hangout || hangout.status !== 'completed') {
      return res.status(400).json({ msg: 'Reviews can only be left for completed hangouts.' });
    }
    
    // Check 2: Both reviewer and reviewee must have been participants
    const isReviewerParticipant = hangout.participants.includes(reviewerId);
    const isRevieweeParticipant = hangout.participants.includes(revieweeId);

    if (!isReviewerParticipant || !isRevieweeParticipant) {
      return res.status(403).json({ msg: 'Both users must be participants of the hangout to leave a review.' });
    }

    const newReview = new Review({
      hangout: hangoutId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err.message);
    // Handle duplicate key error for unique index
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'You have already reviewed this user for this hangout.' });
    }
    res.status(500).send('Server Error');
  }
};