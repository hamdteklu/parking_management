import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/api'; // Import the setAuthToken function

/**
 * LogoutButton component to handle user logout.
 */
function LogoutButton() {
  const navigate = useNavigate();

  /**
   * Handle logout action.
   * Clears the tokens from localStorage and redirects to the login page.
   */
  const handleLogout = () => {
    // Clear the tokens from localStorage
    localStorage.removeItem('token'); // Remove access token
    localStorage.removeItem('refreshToken'); // Remove refresh token
    localStorage.removeItem('role'); // Remove role

    // Clear the token globally in Axios headers
    setAuthToken(null);

    // Redirect to the login page
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}

export default LogoutButton;