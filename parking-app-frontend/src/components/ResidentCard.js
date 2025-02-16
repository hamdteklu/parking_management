import React from 'react';
import '../styles/global.css'; // Import global styles

function ResidentCard({ residents }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {residents.map((resident) => {

        // Default status to "Active" for now
        const statusClass = 'status-active'; // Later, this will come from the backend

        // TODO: in the future, use the actual value from the DB
        /*const statusClass = resident.isActive ? 'status-active' : 'status-inactive';
        <p className={`status-indicator ${statusClass}`}>
          {resident.isActive ? 'Active' : 'Inactive'}
        </p>*/

        return (
          <div key={resident._id} className="border p-4 rounded text-center data-card">
            <p className="font-semibold">{resident.name}</p>
            <p>Property: {resident.propertyId?.name || 'Unknown Property'}</p>
            <p>Vehicles:</p>
            {resident.vehicles && resident.vehicles.length > 0 ? (
              <ul className="list-disc list-inside">
                {resident.vehicles.map((vehicle, index) => (
                  <li key={index}>{`${vehicle.make} - ${vehicle.model}`}</li>
                ))}
              </ul>
            ) : (
              <p>None</p>
            )}
            {/* Status Indicator */}
            <p className={`status-indicator ${statusClass}`}>Active</p>
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