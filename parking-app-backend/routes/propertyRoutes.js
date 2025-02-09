// routes/propertyRoutes.js
import express from 'express';
import { createProperty, getProperties, getPropertiesByManager } from '../controllers/propertyController.js';
import authorizeRole from '../middleware/authorizeRole.js';

const router = express.Router();

// Get all properties (only for property managers); this route is also used for registering - we cant authorize.
router.get('/', getProperties);

// Create a new property (only for property managers)
router.post('/', authorizeRole('manager'), createProperty);

// Fetch all properties created by the logged-in property manager
/*router.get('/properties/manager', authorizeRole('manager'), getPropertiesByManager);*/

// Fetch all properties created by the logged-in property manager
router.get('/manager', authorizeRole('manager'), getPropertiesByManager);

export const propertyRoutes = router;