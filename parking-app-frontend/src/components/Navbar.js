import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

/**
 * Navbar component for authenticated users.
 */
function Navbar() {
  const role = localStorage.getItem('role');

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* App Title */}
        <div className="text-3xl font-bold text-white">
          CONCIERGE+
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-4 text-white">
          {/* Common Links */}
          <Link to="/manager-dashboard" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded">
            Home
          </Link>

          {/* Role-Specific Buttons */}
          {role === 'manager' && (
            <>
              <Link to="/add-property" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Add Property
              </Link>
              <Link to="/add-resident" className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded">
                Add Resident
              </Link>
              <Link to="/guest-parking-config" className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded">
                Guest Parking
              </Link>
            </>
          )}
          {role === 'resident' && (
            <>
              <Link to="/vehicles" className="hover:text-blue-300">
                My Vehicles
              </Link>
              <Link to="/parking-spot" className="hover:text-blue-300">
                My Parking Spot
              </Link>
            </>
          )}
          {role === 'guest' && (
            <Link to="/register-vehicle" className="hover:text-blue-300">
              Register Vehicle
            </Link>
          )}

          {/* Logout Button */}
          <LogoutButton />
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button className="text-white hover:text-gray-300 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;