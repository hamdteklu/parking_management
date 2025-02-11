// controllers/residentController.js
import { Resident } from '../models/Resident.js';
import Property from '../models/Property.js';
import ParkingSpot from '../models/ParkingSpot.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose'; // Import mongoose for ObjectId conversion

dotenv.config();

// Get resident's vehicles
export const getVehicles = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const residentId = decoded.id;
    const resident = await Resident.findById(residentId).populate('vehicles');
    if (!resident) return res.status(404).json({ message: 'Resident not found' });
    res.status(200).json(resident.vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Add a new vehicle
export const addVehicle = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const residentId = decoded.id;
    const { licensePlate, make, model } = req.body;

    // Validate input
    if (!licensePlate || !make || !model) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const resident = await Resident.findById(residentId);
    if (!resident) return res.status(404).json({ message: 'Resident not found' });

    resident.vehicles.push({ licensePlate, make, model });
    await resident.save();
    res.status(201).json(resident.vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Update a vehicle
export const updateVehicle = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const residentId = decoded.id;
    const { id } = req.params;
    const { licensePlate, make, model } = req.body;

    const resident = await Resident.findById(residentId);
    if (!resident) return res.status(404).json({ message: 'Resident not found' });

    const vehicle = resident.vehicles.id(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    vehicle.licensePlate = licensePlate || vehicle.licensePlate;
    vehicle.make = make || vehicle.make;
    vehicle.model = model || vehicle.model;

    await resident.save();
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Delete a vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const residentId = decoded.id;
    const { id } = req.params;

    const resident = await Resident.findById(residentId);
    if (!resident) return res.status(404).json({ message: 'Resident not found' });

    resident.vehicles.pull(id);
    await resident.save();
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Get assigned parking spot
export const getParkingSpot = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const residentId = decoded.id;

    const resident = await Resident.findById(residentId).populate('parkingSpot');
    if (!resident) return res.status(404).json({ message: 'Resident not found' });

    res.status(200).json(resident.parkingSpot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Update resident profile
export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const residentId = decoded.id;
    const { name, email, phone } = req.body;

    const resident = await Resident.findByIdAndUpdate(
      residentId,
      { name, email, phone },
      { new: true }
    );

    if (!resident) return res.status(404).json({ message: 'Resident not found' });

    res.status(200).json(resident);
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Create a new resident (for property managers)
export const createResident = async (req, res) => {
  console.log('propertyController::createProperty: --- start ---');
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const managerId = decoded.id;
    const { name, email, password, propertyId } = req.body;

    console.log('Creating resident with data:', { name, email, password, propertyId }); // Debugging line

    // Convert propertyId to ObjectId
    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    console.log('Converted propertyId to ObjectId:', propertyObjectId); // Debugging line

    // Validate propertyId
    const property = await Property.findOne({ _id: propertyObjectId, userId: managerId });
    if (!property) {
      console.error('Invalid property or unauthorized access:', { propertyId, managerId }); // Debugging line
      return res.status(400).json({ message: 'Invalid property or unauthorized access' });
    }

    console.log('Property validation passed:', property); // Debugging line

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully:', hashedPassword); // Debugging line

    // Create resident
    const resident = new Resident({ name, email, password: hashedPassword, propertyId: propertyObjectId });
    console.log('Resident object created:', resident); // Debugging line

    await resident.save();
    console.log('Resident saved successfully:', resident); // Debugging line

    res.status(201).json(resident);
  } catch (error) {
    console.error('Error creating resident:', error.message); // Log the exact error
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

/** USE THIS NEW FUNTION BELOW!!, CHECK*/
/**
 * Create a new resident (only accessible by property managers).
 *
export const createResident = async (req, res) => {
  try {
    const { name, email, password, phone, vehicles, parkingSpot, propertyId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !propertyId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the resident
    const newResident = new Resident({
      name,
      email,
      password,
      phone,
      vehicles,
      parkingSpot,
      propertyId,
    });

    // Save to the database
    const savedResident = await newResident.save();
    res.status(201).json(savedResident);
  } catch (error) {
    console.error('Error creating resident:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};*/

/**
 * Fetch all residents (only accessible by property managers).
 */
export const getResidents = async (req, res) => {
  console.log('ResidentController::getResidents: --- start ---');
  try {
    // Fetch all residents and populate property details
    const residents = await Resident.find().populate('propertyId');
    res.status(200).json(residents);
  } catch (error) {
    console.error(' ResidentController::getResidents(): Error fetching residents:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

/**
 * Fetch all residents associated with the given property IDs.
 */
export const getResidentsByProperties = async (req, res) => {
  console.log('ResidentController::getResidentsByProperties: --- start ---');

  try {
    const { propertyIds } = req.body; // Array of property IDs
    if (!propertyIds || propertyIds.length === 0) {
      return res.status(400).json({ message: 'No property IDs provided' });
    }

    const residents = await Resident.find({ propertyId: { $in: propertyIds } }).populate('propertyId');
    res.status(200).json(residents);
  } catch (error) {
    console.error('Error fetching residents:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

/*export const getResidentsByProperties = async (req, res) => {
  console.log('ResidentController::getResidentsByProperties: --- start ---');
  try {
    const { propertyIds } = req.body; // Array of property IDs

    // Debugging: Log the incoming propertyIds
    console.log('Received propertyIds:', propertyIds);

    // Validate input
    if (!propertyIds || propertyIds.length === 0) {
      console.error('No property IDs provided'); // Debugging line
      return res.status(400).json({ message: 'No property IDs provided' });
    }

    // Convert propertyIds to ObjectIds
    const objectIdArray = propertyIds.map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error(`Invalid ObjectId: ${id}`); // Debugging line
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    // Fetch residents associated with the given property IDs
    const residents = await Resident.find({ propertyId: { $in: objectIdArray } }).populate('propertyId');

    // Debugging: Log the fetched residents
    console.log('Fetched residents:', residents);

    // Return the result
    res.status(200).json(residents);
  } catch (error) {
    console.error('Error fetching residents:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};*/