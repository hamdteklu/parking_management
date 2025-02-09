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
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);