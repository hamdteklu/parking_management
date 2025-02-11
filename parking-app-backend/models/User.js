// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['manager', 'resident', 'guest'],
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    vehicles: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Vehicle' 
    },
    parkingSpot: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'ParkingSpot', 
      default: null 
    },
  },
  { timestamps: true }
);

// Named export for the User model
export const User = mongoose.model('User', UserSchema);