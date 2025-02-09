// middleware/authorizeRole.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to authorize roles
const authorizeRole = (role) => (req, res, next) => {
  console.error('authorizeRole::authorizeRole()  req.path= ', req.path);

  // Allow unauthenticated access for specific routes
  if (req.path === '/' && req.method === 'GET') {
    console.log('Skipping authentication for /properties GET request');
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('authorizeRole::authorizeRole() No token provided');
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== role) {
      console.error('No token provided');
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authorizeRole;