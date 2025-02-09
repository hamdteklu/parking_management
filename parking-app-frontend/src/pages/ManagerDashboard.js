import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPropertiesByManager, getResidentsByProperties } from '../utils/api';

function ManagerDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [residents, setResidents] = useState([]);
  const userName = localStorage.getItem('name') || 'Manager';

  // Fetch properties and residents on component mount
  useEffect(() => {
    const fetchPropertiesAndResidents = async () => {
      console.error(' ManagerDashboard::ManagerDashboard()   ---  start  --- ');
      try {
        // Fetch properties created by the logged-in manager
        console.error(' ManagerDashboard::ManagerDashboard() :   call getPropertiesByManager() func.. ');
        const data = await getPropertiesByManager();
        console.log('Fetched properties:', data); // Debugging line
        setProperties(data);

        // Extract property IDs and fetch residents
        const propertyIds = data.map((property) => property._id);
        console.log('propertyIds= ', propertyIds);
        if (propertyIds.length > 0) {
          console.error(' ManagerDashboard::ManagerDashboard() :   call getResidentsByProperties() func.. ');
          const residentsData = await getResidentsByProperties(propertyIds);
          console.log('Fetched residents:', residentsData); // Debugging line
          setResidents(residentsData);
        }
      } catch (error) {
        console.error('ManagerDashboard::fetchPropertiesAndResidents() - Error fetching properties or residents:', error.message);
      }
    };

    fetchPropertiesAndResidents();
  }, []);

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hello, {userName}</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/add-property')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Property
          </button>
          <button
            onClick={() => navigate('/add-resident')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Resident
          </button>
          <button
            onClick={() => navigate('/guest-parking-config')}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Guest Parking
          </button>
        </div>
      </div>

      {/* Hero Section (Property Overview) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Properties</h2>
        {properties.length === 0 ? (
          <div className="text-center">
            <p>You haven't added any properties yet.</p>
            <button
              onClick={() => navigate('/add-property')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {properties.map((property) => (
              <div key={property._id} className="border p-4 rounded text-center">
                <img src="/property-icon.png" alt="Property Icon" className="mx-auto w-16 h-16" />
                <p className="font-semibold">{property.name}</p>
                <p>{property.address}</p>
              </div>
            ))}
            <button
              onClick={() => navigate('/add-property')}
              className="col-span-1 md:col-span-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Another Property
            </button>
          </div>
        )}
      </div>

      {/* Resident Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Residents</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="space-x-4">
            <button
              onClick={() => navigate('/add-resident')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Resident
            </button>
          </div>
          <div className="space-x-4">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
              Cards View
            </button>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
              Graph View
            </button>
          </div>
        </div>
        {residents.length === 0 ? (
          <p>No residents found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {residents.map((resident) => {
              const propertyName = resident.propertyId?.name || 'Unknown Property';
              const vehicles = resident.vehicles || [];
              return (
                <div key={resident._id} className="border p-4 rounded text-center">
                  <p className="font-semibold">{resident.name}</p>
                  <p>Property: {propertyName}</p>
                  <p>Vehicles:</p>
                  {vehicles.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {vehicles.map((vehicle, index) => (
                        <li key={index}>{`${vehicle.make} - ${vehicle.model}`}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>None</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;