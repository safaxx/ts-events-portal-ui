// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// === 1. Request Interceptor ===
// This function runs *before* every request is sent.
// We use it to add the auth token to the headers.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Set the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Adding token to request:', config.url);
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === 2. Response Interceptor ===
// This function runs *after* every response is received.
// We use it to check for 401 or 403 errors.
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // Check if the error is a 401 or 403
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Authentication Error:', error.response.status);
      
      // Clear the stored token to log the user out
      localStorage.removeItem('accessToken');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      
      // Redirect to the login page
      // We check the current path to avoid an infinite redirect loop
      // if the login page itself triggers a 401.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      // Return a rejected promise to stop the original component from processing
      return Promise.reject(new Error('Session expired or unauthorized.'));
    }
    
    // For any other error, just re-throw it
    return Promise.reject(error);
  }
);

export default api;