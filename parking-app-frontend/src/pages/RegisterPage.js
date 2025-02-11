import React, { useState, useEffect } from 'react';
import { registerUser, getProperties, createResidentRequest } from '../utils/api'; // Import centralized API functions
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Start with no role selected
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error.response?.data?.message || 'An error occurred');
      }
    };
    fetchProperties();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!role) {
      alert('Please select a role.');
      return;
    }

    if (['resident', 'guest'].includes(role) && !selectedProperty) {
      alert('Please select a valid property.');
      return;
    }

    try {
      if (role === 'manager') {
        // Handle property manager registration
        const userData = { name, email, password, role };
        await registerUser(userData);
        alert('Registration successful! Please log in.');
        navigate('/');
      } else if (role === 'resident') {
        // Handle resident request submission
        const requestData = { name, email, propertyId: selectedProperty };
        await createResidentRequest(requestData);
        alert('Resident request submitted successfully! A property manager will review your request.');
        navigate('/');
      }
    } catch (error) {
      console.error('Operation failed:', error.response?.data?.message || 'An error occurred');
      alert('Operation failed: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {/* Role Selection */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        >
          <option value="">Select a role</option>
          <option value="manager">Property Manager</option>
          <option value="resident">Resident</option>
        </select>

        {/* Name Field */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        {/* Email Field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        {/* Password Field (only for property managers) */}
        {role === 'manager' && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />
        )}

        {/* Property Selection (only for residents) */}
        {role === 'resident' && (
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          >
            <option value="">Select a property</option>
            {properties.map((property) => (
              <option key={property._id} value={property._id}>
                {property.name}
              </option>
            ))}
          </select>
        )}

        {/* Submit Button */}
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          {role === 'resident' ? 'Request' : 'Register'}
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;