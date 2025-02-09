// routes/guestParkingRules.js
import express from 'express';
import { configureGuestParkingRules } from '../controllers/guestParkingRulesController.js';

const router = express.Router();

/**
 * Route to configure guest parking rules for a property.
 * POST /api/guest-parking-rules/configure
 */
router.post('/configure', configureGuestParkingRules);

// Use named export instead of default export
export const guestParkingRulesRoute = router;