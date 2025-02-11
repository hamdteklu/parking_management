// controllers/residentRequestController.js
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { ResidentRequest } from '../models/ResidentRequest.js';
import { Resident } from '../models/Resident.js';

export const createResidentRequest = async (req, res) => {
  console.log('residentRequestController::createResidentRequest(): --- start ---');
  try {
    const { name, email, propertyId } = req.body;

    // Create a new resident request
    const request = new ResidentRequest({ name, email, propertyId });
    await request.save();

    res.status(201).json({ message: 'Resident request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  console.log('residentRequestController::getPendingRequests(): --- start ---');
  try {
    const requests = await ResidentRequest.find({ status: 'pending' }).populate('propertyId');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

/*export const acceptResidentRequest = async (req, res) => {
  console.log('residentRequestController::acceptResidentRequest(): --- start ---');
  try {
    const { requestId, password } = req.body;

    // Find the request
    const request = await ResidentRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new resident in the User model
    const newUser = new User({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      role: 'resident',
      propertyId: request.propertyId,
    });
    await newUser.save();

    // Update the request status
    request.status = 'accepted';
    await request.save();

    res.status(200).json({ message: 'Resident request accepted and user created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};*/

/*export const acceptResidentRequest = async (req, res) => {
  console.log('residentRequestController::acceptResidentRequest(): --- start ---');
  try {
    const { requestId, password } = req.body;

    console.log('Request ID:', requestId); // Log the request ID
    console.log('Password:', password); // Log the password

    // Find the request
    const request = await ResidentRequest.findById(requestId);
    if (!request) {
      console.error('Request not found for ID:', requestId);
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log('Found request:', request); // Log the request object

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Create a new resident in the User model
    console.log('Creating new resident...');
    const newUser = new User({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      role: 'resident',
      propertyId: request.propertyId,
    });

    console.log('New resident data:', newUser); // Log the new resident data
    await newUser.save();
    console.log('Resident saved successfully.');

    // Update the request status
    console.log('Updating request status to "accepted"...');
    request.status = 'accepted';
    await request.save();
    console.log('Request status updated successfully.');

    res.status(200).json({ message: 'Resident request accepted and user created' });
  } catch (error) {
    console.error('Error accepting resident request:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};*/

/*export const acceptResidentRequest = async (req, res) => {
  console.log('residentRequestController::acceptResidentRequest(): --- start ---');
  try {
    const { requestId, password } = req.body;

    console.log('Request ID:', requestId); // Log the request ID
    console.log('Password:', password); // Log the password

    // Find the request
    const request = await ResidentRequest.findById(requestId);
    if (!request) {
      console.error('Request not found for ID:', requestId);
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log('Found request:', request); // Log the request object

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Create a new resident in the User model
    console.log('Creating new resident...');
    const newUser = new User({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      role: 'resident',
      propertyId: request.propertyId,
    });

    console.log('New resident data:', newUser); // Log the new resident data
    await newUser.save();
    console.log('Resident saved successfully.');

    // Delete the request from the ResidentRequest collection
    console.log('Deleting request from ResidentRequest collection...');
    await ResidentRequest.findByIdAndDelete(requestId);
    console.log('Request deleted successfully.');

    res.status(200).json({ message: 'Resident request accepted and user created' });
  } catch (error) {
    console.error('Error accepting resident request:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};*/

export const acceptResidentRequest = async (req, res) => {
  console.log('residentRequestController::acceptResidentRequest(): --- start ---');
  try {
    const { requestId, password } = req.body;

    console.log('Request ID:', requestId); // Log the request ID
    console.log('Password:', password); // Log the password

    // Find the request
    const request = await ResidentRequest.findById(requestId);
    if (!request) {
      console.error('Request not found for ID:', requestId);
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log('Found request:', request); // Log the request object

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Create a new resident in the Resident collection
    console.log('Creating new resident...');
    const newResident = new Resident({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      propertyId: request.propertyId,
      vehicles: [], // Start with no vehicles
      parkingSpot: null, // No parking spot assigned initially
    });

    console.log('New resident data:', newResident); // Log the new resident data
    await newResident.save();
    console.log('Resident saved successfully.');

    // Delete the request from the ResidentRequest collection
    console.log('Deleting request from ResidentRequest collection...');
    await ResidentRequest.findByIdAndDelete(requestId);
    console.log('Request deleted successfully.');

    res.status(200).json({ message: 'Resident request accepted and resident created' });
  } catch (error) {
    console.error('Error accepting resident request:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

export const declineResidentRequest = async (req, res) => {
  console.log('residentRequestController::declineResidentRequest(): --- start ---');
  try {
    const { requestId } = req.body;

    // Find and update the request
    const request = await ResidentRequest.findByIdAndUpdate(
      requestId,
      { status: 'declined' },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });

    res.status(200).json({ message: 'Resident request declined' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};