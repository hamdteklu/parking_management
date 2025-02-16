import React from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from './PropertyCard'; // Import the PropertyCard component
import '../styles/global.css'; // Import global styles

function PropertyView({ properties }) {
  return (
    <div className="data-section">
      <h2>Properties</h2>
      <div className="flex justify-end mb-4">
        <Link to="/add-property">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Property
          </button>
        </Link>
      </div>
      {properties.length === 0 ? (
        <div className="text-center">
          <p>You haven't added any properties yet.</p>
          <Link to="/add-property">
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add Property
            </button>
          </Link>
        </div>
      ) : (
        <PropertyCard properties={properties} />
      )}
    </div>
  );
}

export default PropertyView;