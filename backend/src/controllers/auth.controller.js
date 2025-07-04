import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import { generateToken } from '../lib/utils.js';
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { name, email, password, gender, age } = req.body;

  if (!name || !email || !password || !gender || !age) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      // Location will be updated later (e.g. on map load)
    });

    await newUser.save();
    generateToken(newUser._id, res); // Sets JWT in cookie

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        profilePicture: newUser.profilePicture,
      },
    });

  } catch (error) {
    console.log("signup controller error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" }); // ✅ return added
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" }); // ✅ return added
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log("login controller error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development", // Same settings as when it was set
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("logout controller error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req,res) => {
   try {
      const {profilePic}=req.body;
      const userId=req.user._id;

      if(!profilePic) return res.status(400).json({message:"Profile pic is required"});

      const uploadResponse=await cloudinary.uploader.upload(profilePic);
      const updatedUser=await User.findByIdAndUpdate(
        userId,
        {profilePicture:uploadResponse.secure_url},
        {new:true}
      );

      res.status(200).json(upadatedUser);
   } catch (error) {
    console.log("Error in updatrProfile",error);
    res.status(500).json({message:"Internal server error"});
   }
}

export const checkAuth = async(req,res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller",error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}