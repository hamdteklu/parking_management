import React, { useState } from 'react';
import { registerGuest } from '../utils/api'; // Import centralized API functions

function GuestPortal() {
  const [formData, setFormData] = useState({
    licensePlate: '',
    make: '',
    model: '',
    propertyId: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerGuest(formData);
      alert(`Permit issued successfully! ID: ${response.permitId}`);
    } catch (error) {
      console.error('Error registering vehicle:', error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Guest Parking Registration</h2>
        <input
          type="text"
          placeholder="License Plate"
          value={formData.licensePlate}
          onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="text"
          placeholder="Make"
          value={formData.make}
          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="text"
          placeholder="Model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Register Vehicle
        </button>
      </form>
    </div>
  );
}

export default GuestPortal;