import React from 'react';
import '../styles/global.css'; // Import global styles

function ResidentTable({ residents }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Property</th>
            <th>Vehicles</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((resident) => {
            const propertyName = resident.propertyId?.name || 'Unknown Property';
            const vehicles = resident.vehicles || [];

            // Default status to "Active" for now
            const statusClass = 'status-active'; // Later, this will come from the backend

            // TODO: in the future, use the actual value from the DB
            /*const statusClass = resident.isActive ? 'status-active' : 'status-inactive';
            <p className={`status-indicator ${statusClass}`}>
              {resident.isActive ? 'Active' : 'Inactive'}
            </p>*/

            return (
              <tr key={resident._id}>
                <td>{resident.name}</td>
                <td>{propertyName}</td>
                <td>
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                      <span key={index}>{`${vehicle.make} - ${vehicle.model}`} </span>
                    ))
                  ) : (
                    <span>None</span>
                  )}
                </td>
                {/* Status Indicator */}
                <td>
                  <p className={`status-indicator ${statusClass}`}>Active</p>
                </td>
                <td>
                  <button className="view-btn">View</button>
                  <button className="edit-btn">Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ResidentTable;