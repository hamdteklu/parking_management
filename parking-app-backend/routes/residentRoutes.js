// routes/residentRoutes.js
import express from 'express';
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getParkingSpot,
  updateProfile,
  createResident,
  getResidents,
  getResidentsByProperties,
} from '../controllers/residentController.js';
import authorizeRole from '../middleware/authorizeRole.js';

const router = express.Router();

// Get resident's vehicles (only for residents)
router.get('/vehicles', authorizeRole('resident'), getVehicles);

// Add a new vehicle (only for residents)
router.post('/vehicles', authorizeRole('resident'), addVehicle);

// Update a vehicle (only for residents)
router.put('/vehicles/:id', authorizeRole('resident'), updateVehicle);

// Delete a vehicle (only for residents)
router.delete('/vehicles/:id', authorizeRole('resident'), deleteVehicle);

// Get assigned parking spot (only for residents)
router.get('/parking-spot', authorizeRole('resident'), getParkingSpot);

// Update resident profile (only for residents)
router.put('/profile', authorizeRole('resident'), updateProfile);

// Create a new resident (only for property managers)
router.post('/residents', authorizeRole('manager'), createResident);

// Get all residents (only for property managers)
router.get('/residents', authorizeRole('manager'), getResidents);

// Fetch all residents associated with the given property IDs
router.post('/by-properties', authorizeRole('manager'), getResidentsByProperties);

// Fetch all residents associated with the given property IDs
//router.post('/residents', authorizeRole('manager'), getResidentsByProperties);

export const residentRoutes = router;