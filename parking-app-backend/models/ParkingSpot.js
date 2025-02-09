// models/ParkingSpot.js
import mongoose from 'mongoose';

const ParkingSpotSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['standard', 'premium', 'guest', 'disabled'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resident',
      default: null,
    },
    guestPermit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GuestPermit',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ParkingSpot', ParkingSpotSchema);