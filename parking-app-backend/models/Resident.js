// models/Resident.js
import mongoose from 'mongoose';

const ResidentSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      default: null,
    },
    vehicles: [
      {
        licensePlate: {
          type: String,
          required: true,
        },
        make: {
          type: String,
          required: true,
        },
        model: {
          type: String,
          required: true,
        },
        primary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    parkingSpot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSpot',
      default: null,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Resident', ResidentSchema);