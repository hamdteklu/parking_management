import React, { useState } from 'react';
import { createProperty } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function AddProperty() {
  const [newProperty, setNewProperty] = useState({ name: '', address: '', parkingSpots: 0 });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProperty(newProperty);
      alert('Property created successfully!');
      navigate('/manager-dashboard');
    } catch (error) {
      console.error('Error creating property:', error.response?.data?.message || 'An error occurred');
      alert('Failed to create property: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Property Name"
          value={newProperty.name}
          onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Property Address"
          value={newProperty.address}
          onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Number of Parking Spots"
          value={newProperty.parkingSpots}
          onChange={(e) => setNewProperty({ ...newProperty, parkingSpots: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Property
        </button>
      </form>
    </div>
  );
}

export default AddProperty;