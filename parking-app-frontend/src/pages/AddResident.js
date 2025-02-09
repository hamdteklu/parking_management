import React, { useState, useEffect } from 'react';
import { getProperties, createResident } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function AddResident() {
  const [newResident, setNewResident] = useState({ name: '', email: '', password: '', propertyId: '' });
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error.response?.data?.message || 'An error occurred');
      }
    };
    fetchProperties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createResident(newResident);
      alert('Resident created successfully!');
      navigate('/manager-dashboard');
    } catch (error) {
      console.error('Error creating resident:', error.response?.data?.message || 'An error occurred');
      alert('Failed to create resident: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Resident</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Resident Name"
          value={newResident.name}
          onChange={(e) => setNewResident({ ...newResident, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Resident Email"
          value={newResident.email}
          onChange={(e) => setNewResident({ ...newResident, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Resident Password"
          value={newResident.password}
          onChange={(e) => setNewResident({ ...newResident, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={newResident.propertyId}
          onChange={(e) => setNewResident({ ...newResident, propertyId: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a property</option>
          {properties.map((property) => (
            <option key={property._id} value={property._id}>
              {property.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Create Resident
        </button>
      </form>
    </div>
  );
}

export default AddResident;