// controllers/propertyController.js
import Property from '../models/Property.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Create a new property
export const createProperty = async (req, res) => {
  console.log('propertyController::createProperty: --- start ---');
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { name, address, parkingSpots } = req.body;

    // Validate input
    if (!name || !address || !parkingSpots) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newProperty = new Property({
      name,
      address,
      parkingSpots,
      userId,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};


// Get all properties for the logged-in property manager
export const getProperties = async (req, res) => {
  console.log('propertyController::getProperties: --- start ---');
  try {
    // Fetch all properties from the database
    const properties = await Property.find();

    // Log the fetched properties for debugging
    console.log('Fetched properties:', properties);

    // Return the properties as a JSON response
    res.status(200).json(properties);
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching properties:', error.message);

    // Return a 500 Server Error response
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// TODO: if we want to get properties and filter it by location, we can use the below function.
/*export const getProperties = async (req, res) => {
  console.log('propertyController::getProperties: --- start ---');
  try {
    // Extract query parameters (optional)
    const { location } = req.query;

    // Build the query dynamically
    const query = location ? { location } : {};

    // Fetch properties based on the query
    const properties = await Property.find(query);

    // Log the fetched properties for debugging
    console.log('Fetched properties:', properties);

    // Return the properties as a JSON response
    res.status(200).json(properties);
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching properties:', error.message);

    // Return a 500 Server Error response
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};*/

/**
 * Fetch all properties created by the logged-in property manager.
 */
export const getPropertiesByManager = async (req, res) => {
  console.log('propertyController::getPropertiesByManager: --- start ---');

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const properties = await Property.find({ userId });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};