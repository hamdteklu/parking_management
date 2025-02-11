// models/ResidentRequest.js
import mongoose from 'mongoose';

const residentRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const ResidentRequest = mongoose.model('ResidentRequest', residentRequestSchema);