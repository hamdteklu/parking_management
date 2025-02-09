// routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import authorizeRole from '../middleware/authorizeRole.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Route to refresh token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // New access token expires in 15 minutes
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});

// Example of role-based route protection
router.get('/manager-dashboard', authorizeRole('manager'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the manager dashboard!' });
});

router.get('/resident-dashboard', authorizeRole('resident'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the resident dashboard!' });
});

router.get('/guest-dashboard', authorizeRole('guest'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the guest dashboard!' });
});

export const authRoutes = router; // Named export