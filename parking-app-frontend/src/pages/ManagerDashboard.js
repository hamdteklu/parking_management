import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getPropertiesByManager,
  getResidentsByProperties,
  getPendingRequests,
  acceptResidentRequest,
  declineResidentRequest,
} from '../utils/api';

//import ResidentTable from '../components/ResidentTable'; // Import the ResidentTable component
import ResidentView from '../components/ResidentView'; // Import the new ResidentView component
import PropertyView from '../components/PropertyView'; // Import the new ResidentView component

import '../styles/global.css'; // Import global styles

function ManagerDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [residents, setResidents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
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

  // Fetch pending resident requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const data = await getPendingRequests();
        setPendingRequests(data);
      } catch (error) {
        console.error('Error fetching pending requests:', error.message);
      }
    };
    fetchPendingRequests();
  }, []);

  const handleAccept = async (requestId) => {
    const password = prompt('Enter a password for the resident:');
    if (!password) {
      alert('Password is required to accept the request.');
      return;
    }

    try {
      await acceptResidentRequest(requestId, password);
      alert('Request accepted successfully!');
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error('Error accepting request:', error.message);
      alert('Failed to accept request. Please try again.');
    }
  };

  const handleDecline = async (requestId) => {
    if (!window.confirm('Are you sure you want to decline this request?')) return;

    try {
      await declineResidentRequest(requestId);
      alert('Request declined successfully!');
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error('Error declining request:', error.message);
      alert('Failed to decline request. Please try again.');
    }
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hello, {userName}</h1>

      </div>

      {/* Hero Section (Property Overview) */}
      <PropertyView properties={properties} />

      {/* Pending Resident Requests Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Resident Requests</h2>
        {pendingRequests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Property</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request) => (
                <tr key={request._id}>
                  <td className="border p-2">{request.name}</td>
                  <td className="border p-2">{request.email}</td>
                  <td className="border p-2">{request.propertyId?.name || 'Unknown Property'}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleAccept(request._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(request._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Resident Section */}
      <ResidentView residents={residents} />
    </div>
  );
}

export default ManagerDashboard;