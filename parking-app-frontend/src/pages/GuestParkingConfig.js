import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { configureGuestParkingRules } from '../utils/api';

function GuestParkingConfig() {
  const navigate = useNavigate();
  const [guestParkingRules, setGuestParkingRules] = useState({
    paymentType: 'free', // Options: 'free', 'paid'
    maxDuration: '', // e.g., '3 days per week'
    parkingZone: '', // e.g., 'Guest Lot A'
    vehicleLimit: '', // e.g., '1 permit per week'
  });

  const handleConfigureGuestParkingRules = async (e) => {
    e.preventDefault();
    try {
      await configureGuestParkingRules(guestParkingRules);
      alert('Guest parking rules configured successfully!');
      navigate('/manager-dashboard');
    } catch (error) {
      console.error(
        'Error configuring guest parking rules:',
        error.response?.data?.message || 'An error occurred'
      );
      alert(
        'Failed to configure guest parking rules: ' +
          (error.response?.data?.message || 'Please try again')
      );
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Configure Guest Parking Rules</h1>
      <form onSubmit={handleConfigureGuestParkingRules} className="space-y-4">
        <select
          value={guestParkingRules.paymentType}
          onChange={(e) =>
            setGuestParkingRules({ ...guestParkingRules, paymentType: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        >
          <option value="free">Free Parking</option>
          <option value="paid">Paid Parking</option>
        </select>
        <input
          type="text"
          name="maxDuration"
          placeholder="Maximum Duration (e.g., 3 days per week)"
          value={guestParkingRules.maxDuration}
          onChange={(e) =>
            setGuestParkingRules({ ...guestParkingRules, maxDuration: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="parkingZone"
          placeholder="Parking Zone (e.g., Guest Lot A)"
          value={guestParkingRules.parkingZone}
          onChange={(e) =>
            setGuestParkingRules({ ...guestParkingRules, parkingZone: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="vehicleLimit"
          placeholder="Vehicle Limit (e.g., 1 permit per week)"
          value={guestParkingRules.vehicleLimit}
          onChange={(e) =>
            setGuestParkingRules({ ...guestParkingRules, vehicleLimit: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Save Guest Parking Rules
        </button>
      </form>
    </div>
  );
}

export default GuestParkingConfig;