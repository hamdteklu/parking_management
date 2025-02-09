import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ManagerDashboard from './pages/ManagerDashboard';
import ResidentDashboard from './pages/ResidentDashboard';
import GuestPortal from './pages/GuestPortal';
import AddProperty from './pages/AddProperty';
import AddResident from './pages/AddResident';
import GuestParkingConfig from './pages/GuestParkingConfig';
import Navbar from './components/Navbar';
import { setAuthToken } from './utils/api';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/" />;
  setAuthToken(token);
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected Routes */}
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident-portal"
          element={
            <ProtectedRoute>
              <ResidentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest-portal"
          element={
            <ProtectedRoute>
              <GuestPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-property"
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-resident"
          element={
            <ProtectedRoute>
              <AddResident />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest-parking-config"
          element={
            <ProtectedRoute>
              <GuestParkingConfig />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;