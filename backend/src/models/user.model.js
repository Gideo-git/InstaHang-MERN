import { Schema, model } from 'mongoose';

// Schema for storing location data in GeoJSON format
const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  // IMPORTANT: Never store plain text passwords. This field should store a hashed password.
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'default-avatar-url.jpg',
  },
  bio: {
    type: String,
    maxlength: 250,
  },
  location: {
    type: pointSchema,
    // Create a 2dsphere index for efficient geospatial queries
    index: '2dsphere',
  },
  connections: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

export default model('User', userSchema);