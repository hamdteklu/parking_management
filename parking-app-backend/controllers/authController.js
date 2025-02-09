// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Property from '../models/Property.js';
import dotenv from 'dotenv';
dotenv.config();

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, propertyId } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Validate propertyId for residents and guests
    if (['resident', 'guest'].includes(role)) {
      const property = await Property.findById(propertyId);
      if (!property) return res.status(400).json({ message: 'Invalid property selected' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({ name, email, password: hashedPassword, role, propertyId });
    await user.save();

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Access token expires in 15 minutes
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } // Refresh token expires in 7 days
    );

    // Save refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({ accessToken, refreshToken, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  console.error(' authCOntroller::login() :   --- start   --- ');
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Access token expires in 15 minutes
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } // Refresh token expires in 7 days
    );

    // Save refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};