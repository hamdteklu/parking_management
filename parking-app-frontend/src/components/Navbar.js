import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

/**
 * Navbar component for authenticated users.
 */
function Navbar() {
  const role = localStorage.getItem('role');

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* App Title */}
        <div className="text-lg font-bold text-gray-800">
          <Link to="/dashboard" className="hover:text-blue-600">
            Parking Management App
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
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

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-4 text-gray-600">
          {/* Common Links */}
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>

          {/* Role-Specific Links */}
          {role === 'manager' && (
            <>
              <Link to="/add-property" className="hover:text-blue-600">
                Add Property
              </Link>
              <Link to="/add-resident" className="hover:text-blue-600">
                Add Resident
              </Link>
              <Link to="/guest-parking-config" className="hover:text-blue-600">
                Guest Parking
              </Link>
            </>
          )}

          {role === 'resident' && (
            <>
              <Link to="/vehicles" className="hover:text-blue-600">
                My Vehicles
              </Link>
              <Link to="/parking-spot" className="hover:text-blue-600">
                My Parking Spot
              </Link>
            </>
          )}

          {role === 'guest' && (
            <Link to="/register-vehicle" className="hover:text-blue-600">
              Register Vehicle
            </Link>
          )}

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;