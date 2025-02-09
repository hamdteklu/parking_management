// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { setAuthToken } from '../utils/api';

/**
 * ProtectedRoute component to restrict access to authenticated users.
 */
const ProtectedRoute = ({ children }) => {
  // Retrieve the token and role from localStorage
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If no token exists, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // Set the token globally in Axios headers
  setAuthToken(token);

  // Render the protected content
  return children;
};

export default ProtectedRoute;