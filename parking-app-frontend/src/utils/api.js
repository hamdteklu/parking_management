// utils/api.js
import axios from 'axios';

// Base URL for the backend API
const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL if different

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/**
 * Function to set or clear the JWT token in the request headers.
 * @param {string|null} token - The JWT token to set, or null to clear it.
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken'); // Retrieve refresh token
      try {
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken } = response.data;

        setAuthToken(accessToken); // Update the access token globally
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Auth APIs
 */
// Register a new user
export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data; // Ensure this includes both `token` and `role`
};

/**
 * Property APIs
 */
// Fetch properties (only accessible by property managers)
export const getProperties = async () => {
  try {
    const response = await apiClient.get('/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    throw error;
  }
};

// Create a new property (only accessible by property managers)
export const createProperty = async (propertyData) => {
  try {
    const response = await apiClient.post('/properties', propertyData);
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error.message);
    throw error;
  }
};

/**
 * Resident APIs
 */
// Fetch residents (only accessible by property managers)
export const getResidents = async () => {
  try {
    const response = await apiClient.get('/residents');
    return response.data;
  } catch (error) {
    console.error(' api::getResidents() - Error fetching residents:', error.message);
    throw error;
  }
};

export const getPropertiesByManager = async () => {
  try {
    console.log('api::getPropertiesByManager(): Sending request to /properties/manager'); // Debugging line
    const response = await apiClient.get('/properties/manager');
    console.log('api::getPropertiesByManager(): Response from backend:', response.data); // Debugging line
    return response.data;
  } catch (error) {
    console.error('api::getPropertiesByManager(): Error fetching properties:', error.message);
    throw error;
  }
};

/*export const getResidentsByProperties = async (propertyIds) => {
  console.error('api::getResidentsByProperties() - propertyIds=', error.propertyIds);
  try {
    console.log('api::getResidentsByProperties(): Sending request to /residents/by-properties');
    const response = await apiClient.post('/residents/by-properties', { propertyIds });
    return response.data;
  } catch (error) {
    console.error('api::getResidentsByProperties() - Error fetching by-properties:', error.message);
    throw error;
  }
};*/

export const getResidentsByProperties = async (propertyIds) => {
  try {
    // Validate propertyIds
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      console.error('api::getResidentsByProperties() - Invalid propertyIds:', propertyIds);
      throw new Error('Invalid propertyIds: Must be a non-empty array');
    }

    // Debugging: Log the request payload
    console.log('api::getResidentsByProperties(): Sending request to /residents/by-properties with propertyIds:', propertyIds);

    // Make the API call
    const response = await apiClient.post('/residents/by-properties', { propertyIds });

    // Debugging: Log the response data
    console.log('api::getResidentsByProperties(): Response from backend:', response.data);

    return response.data;
  } catch (error) {
    // Debugging: Log the error
    console.error('api::getResidentsByProperties() - Error fetching residents:', error.message);

    // Rethrow the error for the caller to handle
    throw error;
  }
};

// Create a new resident (only accessible by property managers)
export const createResident = async (residentData) => {
  try {
    console.log('Sending resident data to backend:', residentData); // Debugging line
    const response = await apiClient.post('/residents/residents', residentData); // Updated endpoint
    console.log('Response from backend:', response.data); // Debugging line
    return response.data;
  } catch (error) {
    console.error('Error in createResident API call:', error.message); // Debugging line
    throw error;
  }
};

// Get resident's vehicles (only accessible by residents)
export const getVehicles = async () => {
  try {
    const response = await apiClient.get('/residents/vehicles');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error.message);
    throw error;
  }
};

// Add a vehicle (only accessible by residents)
export const addVehicle = async (vehicleData) => {
  try {
    const response = await apiClient.post('/residents/vehicles', vehicleData);
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    throw error;
  }
};

// Update a vehicle (only accessible by residents)
export const updateVehicle = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/residents/vehicles/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle:', error.message);
    throw error;
  }
};

// Delete a vehicle (only accessible by residents)
export const deleteVehicle = async (id) => {
  try {
    const response = await apiClient.delete(`/residents/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle:', error.message);
    throw error;
  }
};

// Get assigned parking spot (only accessible by residents)
export const getParkingSpot = async () => {
  try {
    const response = await apiClient.get('/residents/parking-spot');
    return response.data;
  } catch (error) {
    console.error('Error fetching parking spot:', error.message);
    throw error;
  }
};

// Update resident profile (only accessible by residents)
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/residents/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
};

/**
 * Guest APIs
 */
// Register a guest
export const registerGuest = async (guestData) => {
  try {
    const response = await apiClient.post('/guests/register', guestData);
    return response.data;
  } catch (error) {
    console.error('Error registering guest:', error.message);
    throw error;
  }
};

/**
 * Guest Parking Rules APIs
 */
// Configure guest parking rules for a property (only accessible by property managers)
export const configureGuestParkingRules = async (rulesData) => {
  try {
    const response = await apiClient.post('/guest-parking-rules/configure', rulesData);
    return response.data;
  } catch (error) {
    console.error('Error configuring guest parking rules:', error.message);
    throw error;
  }
};