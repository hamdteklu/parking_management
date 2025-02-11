// routes/residentRequestRoutes.js
import express from 'express';
import authorizeRole from '../middleware/authorizeRole.js';
import {
  createResidentRequest,
  getPendingRequests,
  acceptResidentRequest,
  declineResidentRequest,
} from '../controllers/residentRequestController.js';

const router = express.Router();

// Submit a resident request
router.post('/requests', createResidentRequest);

// Get pending resident requests (only for property managers)
router.get('/requests/pending', authorizeRole('manager'), getPendingRequests);

// Accept a resident request (only for property managers)
router.post('/requests/accept', authorizeRole('manager'), acceptResidentRequest);

// Decline a resident request (only for property managers)
router.post('/requests/decline', authorizeRole('manager'), declineResidentRequest);

export const residentRequestRoutes = router;