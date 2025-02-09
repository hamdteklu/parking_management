import React, { useState, useEffect } from 'react';
import { registerUser, getProperties } from '../utils/api'; // Import centralized API functions
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resident');
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
    if (['resident', 'guest'].includes(role) && !selectedProperty) {
      alert('Please select a valid property.');
      return;
    }
    try {
      const userData = { name, email, password, role };
      await registerUser(userData);
      alert('Registration successful! Please log in.');
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || 'An error occurred');
      alert('Registration failed: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="manager">Property Manager</option>
          <option value="resident">Resident</option>
          <option value="guest">Guest</option>
        </select>
        {['resident', 'guest'].includes(role) && (
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
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Register
        </button>
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