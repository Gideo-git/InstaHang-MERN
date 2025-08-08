import User from '../models/user.model.js';

//  Get current user's profile
export const getMyProfile = async (req, res) => {
  try {
    // req.user.id is attached from the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//  Update current user's profile and location
export const updateMyProfile = async (req, res) => {
  const { bio, profilePicture, location } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields if they are provided
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;
    if (location) user.location = location; // Assumes location is a valid GeoJSON object

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//  Get users within a certain radius
export const getNearbyUsers = async (req, res) => {
  const { lat, lon, dist = 5000 } = req.query; // distance in meters (default 5km)
  
  if (!lat || !lon) {
    return res.status(400).json({ msg: 'Latitude and Longitude are required' });
  }

  const longitude = parseFloat(lon);
  const latitude = parseFloat(lat);

  try {
    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: parseInt(dist),
        },
      },
      // Exclude the current user from the results
      _id: { $ne: req.user.id }, 
    }).select('-password');

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//  Get a specific user's public profile by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};