// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Resident } from '../models/Resident.js';
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

    // TODO: 

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
/*export const login = async (req, res) => {
  console.error(' authController::login() :   ---   start   --- ');
  try {
    const { email, password } = req.body;

    // Check if user exists - property manager
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

  console.error(' authController::login() :   ---   exit   --- ');
};*/

export const login = async (req, res) => {
  console.log('authController::login(): --- start ---');
  try {
    const { email, password } = req.body;

    // Step 1: Check if the user exists in the User collection (managers, guests)
    let user = await User.findOne({ email });
    if (user) {
      console.log('authController::login(): Found user in User collection:', user);

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.error('authController::login(): Invalid password for email:', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      // Save refresh token in the database
      user.refreshToken = refreshToken;
      await user.save();

      console.log('authController::login(): Login successful for user:', user.name);

      return res.status(200).json({
        accessToken,
        refreshToken,
        role: user.role,
        name: user.name,
      });
    }

    // Step 2: Check if the user exists in the Resident collection
    const resident = await Resident.findOne({ email });
    if (resident) {
      console.log('authController::login(): Found resident in Resident collection:', resident);

      // Compare password
      const isMatch = await bcrypt.compare(password, resident.password);
      if (!isMatch) {
        console.error('authController::login(): Invalid password for email:', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { id: resident._id, role: 'resident' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { id: resident._id, role: 'resident' },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      // Save refresh token in the database
      resident.refreshToken = refreshToken;
      await resident.save();

      console.log('authController::login(): Login successful for resident:', resident.name);

      return res.status(200).json({
        accessToken,
        refreshToken,
        role: 'resident',
        name: resident.name,
      });
    }

    // Step 3: If no user or resident is found, return an error
    console.error('authController::login(): No user or resident found for email:', email);
    return res.status(400).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('authController::login(): Error during login:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// authController.js
/*export const residentLogin = async (req, res) => {
  console.log('authController::residentLogin(): --- start ---');
  try {
    const { email, password } = req.body;

    // Check if user exists and is a resident
    const user = await User.findOne({ email, role: 'resident' });
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
};*/

/*export const residentLogin = async (req, res) => {
  console.log('authController::residentLogin(): --- start ---');
  try {
    const { email, password } = req.body;

    // Check if the resident exists in the Resident collection
    const resident = await Resident.findOne({ email });
    if (!resident) {
      console.error('authController::residentLogin(): Resident not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('authController::residentLogin(): Found resident:', resident);

    // Compare the password
    const isMatch = await bcrypt.compare(password, resident.password);
    if (!isMatch) {
      console.error('authController::residentLogin(): Invalid password for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: resident._id, role: 'resident' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Access token expires in 15 minutes
    );
    const refreshToken = jwt.sign(
      { id: resident._id, role: 'resident' },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } // Refresh token expires in 7 days
    );

    // Save refresh token in the database
    resident.refreshToken = refreshToken;
    await resident.save();

    console.log('authController::residentLogin(): Login successful for resident:', resident.name);

    res.status(200).json({
      accessToken,
      refreshToken,
      role: 'resident',
      name: resident.name,
    });
  } catch (error) {
    console.error('authController::residentLogin(): Error during login:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};*/
