// controllers/guestParkingRulesController.js
import mongoose from 'mongoose';

// Define the schema for guest parking rules
const GuestParkingRulesSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['free', 'paid'],
      required: true,
    },
    maxDuration: {
      type: String,
      required: true,
    },
    parkingZone: {
      type: String,
      required: true,
    },
    vehicleLimit: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model for guest parking rules
const GuestParkingRules = mongoose.model('GuestParkingRules', GuestParkingRulesSchema);

/**
 * Controller to configure guest parking rules for a property.
 */
export const configureGuestParkingRules = async (req, res) => {
  try {
    const { propertyId, paymentType, maxDuration, parkingZone, vehicleLimit } = req.body;

    // Validate input data
    if (!propertyId || !paymentType || !maxDuration || !parkingZone || !vehicleLimit) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if a rule already exists for the property
    const existingRule = await GuestParkingRules.findOne({ propertyId });
    if (existingRule) {
      // Update the existing rule
      existingRule.paymentType = paymentType;
      existingRule.maxDuration = maxDuration;
      existingRule.parkingZone = parkingZone;
      existingRule.vehicleLimit = vehicleLimit;
      await existingRule.save();
      return res.status(200).json({
        message: 'Guest parking rules updated successfully',
        rules: existingRule,
      });
    }

    // Create a new rule if none exists
    const newRule = new GuestParkingRules({
      propertyId,
      paymentType,
      maxDuration,
      parkingZone,
      vehicleLimit,
    });

    await newRule.save();

    res.status(201).json({
      message: 'Guest parking rules configured successfully',
      rules: newRule,
    });
  } catch (error) {
    console.error('Error configuring guest parking rules:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};