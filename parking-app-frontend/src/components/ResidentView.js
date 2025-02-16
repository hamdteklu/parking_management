import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ResidentTable from './ResidentTable'; // Table view
import ResidentCard from './ResidentCard'; // Card view
import '../styles/global.css'; // Import global styles

function ResidentView({ residents }) {
  // Initialize state from local storage or default to Card View
  const [isCardView, setIsCardView] = useState(
    JSON.parse(localStorage.getItem('isCardView')) ?? true
  );

  // Save the current view preference to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('isCardView', JSON.stringify(isCardView));
  }, [isCardView]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter residents based on search term
  const filteredResidents = residents.filter((resident) =>
    Object.values(resident).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="data-section">
      <h2>Residents</h2>
      <div className="table-controls flex justify-between items-center">
        {/* Left side: Search bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Right side: Buttons */}
        <div className="space-x-4">
          <Link to="/add-resident">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Add Resident
            </button>
          </Link>
          <button
            onClick={() => setIsCardView(!isCardView)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            {isCardView ? 'Table View' : 'Card View'}
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Export
          </button>
        </div>
      </div>
      {/* Render table or card view based on state */}
      {isCardView ? (
        <ResidentCard residents={filteredResidents} />
      ) : (
        <ResidentTable residents={filteredResidents} />
      )}
    </div>
  );
}

export default ResidentView;