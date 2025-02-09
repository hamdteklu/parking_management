import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

//import authRoutes from './routes/authRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { propertyRoutes } from './routes/propertyRoutes.js';
import { residentRoutes } from './routes/residentRoutes.js';
import { createResident } from './controllers/residentController.js';
import { guestParkingRulesRoute } from './routes/guestParkingRules.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// back-end-port=5000; added this block of code to accept request from different orgin (front-end-port=3000)
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend
  credentials: true, // Enable cookies or authentication headers if needed
}));

// Middleware to parse JSON
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// Define a test route
app.get('/', (req, res) => {
  res.send('Parking App Backend is running!');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/residents', residentRoutes);

console.error('Registered /api/properties routes');

// Resident Routes
app.post('/api/residents', createResident);

// Use the guest parking rules route
app.use('/api/guest-parking-rules', guestParkingRulesRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ports ${PORT}`);
});