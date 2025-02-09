// src/pages/ResidentDashboard.js
import React, { useEffect, useState } from 'react';
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getParkingSpot,
  updateProfile,
} from '../utils/api'; // Import centralized API functions

function ResidentDashboard() {
  const [vehicles, setVehicles] = useState([]); // State to store resident's vehicles
  const [newVehicle, setNewVehicle] = useState({ licensePlate: '', make: '', model: '' }); // State for adding a new vehicle
  const [parkingSpot, setParkingSpot] = useState(null); // State to store assigned parking spot
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' }); // State for resident's profile
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesData, parkingSpotData] = await Promise.all([getVehicles(), getParkingSpot()]);
        setVehicles(vehiclesData);
        setParkingSpot(parkingSpotData);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data?.message || 'An error occurred');
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({ ...newVehicle, [name]: value });
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const createdVehicle = await addVehicle(newVehicle);
      setVehicles([...vehicles, createdVehicle]);
      setNewVehicle({ licensePlate: '', make: '', model: '' });
      alert('Vehicle added successfully!');
    } catch (err) {
      console.error('Error adding vehicle:', err.response?.data?.message || 'An error occurred');
      alert('Failed to add vehicle: ' + (err.response?.data?.message || 'Please try again'));
    }
  };

  const handleUpdateVehicle = async (id, updatedData) => {
    try {
      const updatedVehicle = await updateVehicle(id, updatedData);
      setVehicles(vehicles.map((vehicle) => (vehicle._id === id ? updatedVehicle : vehicle)));
      alert('Vehicle updated successfully!');
    } catch (err) {
      console.error('Error updating vehicle:', err.response?.data?.message || 'An error occurred');
      alert('Failed to update vehicle: ' + (err.response?.data?.message || 'Please try again'));
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await deleteVehicle(id);
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
      alert('Vehicle deleted successfully!');
    } catch (err) {
      console.error('Error deleting vehicle:', err.response?.data?.message || 'An error occurred');
      alert('Failed to delete vehicle: ' + (err.response?.data?.message || 'Please try again'));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateProfile(profile);
      setProfile(updatedProfile);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err.response?.data?.message || 'An error occurred');
      alert('Failed to update profile: ' + (err.response?.data?.message || 'Please try again'));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Resident Dashboard</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <span className="text-lg text-gray-600">Loading data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Assigned Parking Spot */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Assigned Parking Spot</h2>
            {parkingSpot ? (
              <div className="bg-white p-4 rounded shadow-md">
                <p><strong>Location:</strong> {parkingSpot.location}</p>
                <p><strong>Type:</strong> {parkingSpot.type}</p>
                <p><strong>Status:</strong> {parkingSpot.status}</p>
              </div>
            ) : (
              <p>No parking spot assigned yet.</p>
            )}
          </div>

          {/* Manage Vehicles */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Manage Vehicles</h2>
            <form onSubmit={handleAddVehicle} className="space-y-4 mb-4">
              <input
                type="text"
                name="licensePlate"
                placeholder="License Plate"
                value={newVehicle.licensePlate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="make"
                placeholder="Make"
                value={newVehicle.make}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={newVehicle.model}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add Vehicle
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white p-4 rounded shadow-md">
                  <h3 className="text-lg font-bold">{vehicle.licensePlate}</h3>
                  <p>{vehicle.make} {vehicle.model}</p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateVehicle(vehicle._id, { ...vehicle, make: 'Updated Make' })
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Management */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Update Profile
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default ResidentDashboard;