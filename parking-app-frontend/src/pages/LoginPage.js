import React, { useState } from 'react';
import { loginUser, setAuthToken } from '../utils/api'; // Import the API functions
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  /**
   * Handle login form submission.
   * Sends login credentials to the backend and handles the response.
   */
  const handleLogin = async (e) => {
    console.log('LoginPage::handleLogin(): --- start ---');
    e.preventDefault();

    try {
      const response = await loginUser({ email, password }); // Call the centralized API function
      const { accessToken, refreshToken, role, name } = response;

      // Save the tokens and role in localStorage
      localStorage.setItem('token', accessToken); // Store access token
      localStorage.setItem('refreshToken', refreshToken); // Store refresh token
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);

      console.log('LoginPage::handleLogin(): name=', name);
      console.log('LoginPage::handleLogin(): role=', role);

      // Set the access token globally in Axios headers
      console.log('LoginPage::handleLogin(): call setAuthToken() func...');
      setAuthToken(accessToken);

      // Redirect based on role
      if (role === 'manager') {
        navigate('/manager-dashboard');
      } else if (role === 'resident') {
        navigate('/resident-portal');
      } else if (role === 'guest') {
        navigate('/guest-portal');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || 'An error occurred');
      alert('Login failed: ' + (error.response?.data?.message || 'Invalid credentials'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
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
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;