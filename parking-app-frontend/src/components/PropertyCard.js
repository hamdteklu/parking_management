import React from 'react';
import '../styles/global.css'; // Import global styles

function PropertyCard({ properties }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {properties.map((property) => (
        <div key={property._id} className="border p-4 rounded text-center data-card">
          <img src="/property-icon.png" alt="Property Icon" className="mx-auto w-16 h-16 mb-2" />
          <p className="font-semibold">{property.name}</p>
          <p>{property.address}</p>
          <p>Status: {property.isActive ? 'Active' : 'Inactive'}</p>
          <div className="mt-2 space-x-2">
            <button className="view-btn">View</button>
            <button className="edit-btn">Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PropertyCard;