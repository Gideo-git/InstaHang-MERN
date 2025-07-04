import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    profilePicture: { type: String, default: '' },

    location: {
    type: { type: String, enum: ['Point']},
    coordinates: { type: [Number] }, // or just remove `required: true`
    },

    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

     pastHangouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hangout' }],
  hangoutCount: { type: Number, default: 0 }, // ✅ new
  averageRating: { type: Number, default: 0 },

    // Optional additions
    bio: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    socketId: { type: String, default: '' },
  },
  { timestamps: true }
);

// Required for geolocation queries
userSchema.index({ location: '2dsphere' });

const User = mongoose.model("User", userSchema);
export default User;
