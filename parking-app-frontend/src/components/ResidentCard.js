import React from 'react';
import '../styles/global.css'; // Import global styles

function ResidentCard({ residents }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {residents.map((resident) => {
        const propertyName = resident.propertyId?.name || 'Unknown Property';
        const vehicles = resident.vehicles || [];
        return (
          <div key={resident._id} className="border p-4 rounded text-center data-card">
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
            <p className={`status ${resident.isActive ? 'occupied' : 'vacant'}`}>
              Status: {resident.isActive ? 'Active' : 'Inactive'}
            </p>
            <div className="mt-2 space-x-2">
              <button className="view-btn">View</button>
              <button className="edit-btn">Edit</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResidentCard;