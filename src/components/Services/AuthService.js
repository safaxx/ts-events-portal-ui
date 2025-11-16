import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Set up your base API URL. 
// It's better to put this in a .env file, but this is fine for now.
const API_BASE_URL = 'http://localhost:8080/api/auth';

/**
 * Sends a POST request to the /send-otp endpoint.
 * @param {string} email - The user's email address.
 * @returns {Promise<object>} The data from the API response.
 */
const sendOtp = async (email) => {
  try {
    console.log('Sending OTP to email:', email);
    // We send the email in the request body, as expected by most POST APIs
    const response = await axios.post(`${API_BASE_URL}/send-otp`, {
      email: email,
    });
    
    // axios puts the response data in the 'data' property
    return response;
    
  } catch (error) {
  
    console.error('Error sending OTP:', error.success || error.message);
    
    // Re-throw the error so the component can catch it and show a message
    throw new Error(error.message || 'Failed to send OTP. Please try again.');
  }
};

/**
 * Sends a POST request to verify the OTP and log the user in.
 * @param {string} email - The user's email address.
 * @param {string} otp - The one-time password.
 * @returns {Promise<object>} The user data and token from the API response.
 */
const loginWithOtp = async (email, otp) => {
  try {
    console.log('Verifying OTP for email:', email);
    
    // Send both email and OTP to the login endpoint
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email: email,
      otp: otp,
    });

    if (response.data && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('email', response.data.email);
      
    }

    return response;

  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed. Please check your OTP and try again.';
    console.error('Error logging in with OTP:', message);
    
    // Re-throw the error for the component
    throw new Error(message);
  }
};

/**
 * Checks if there is a valid, non-expired token in localStorage.
 * @returns {boolean} True if authenticated, false otherwise.
 */
const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return false;
  }

  try {
    // 2. Decode the token to get its payload
    const decodedToken = jwtDecode(token);

    // 'exp' is the property for expiration time (it's in *seconds*)
    const expirationTimeInSeconds = decodedToken.exp;
    
    // Get the current time in *seconds*
    const currentTimeInSeconds = Date.now() / 1000;

    // 3. Compare the times
    if (expirationTimeInSeconds < currentTimeInSeconds) {
      console.warn("JWT token has expired.");
      localStorage.removeItem('accessToken'); // Clean up the expired token
      return false; // Token is expired
    }

    // If we're here, the token exists and is not expired
    return true;

  } catch (error) {
    // This will catch errors if the token is malformed or invalid
    console.error("Error decoding JWT token:", error);
    localStorage.removeItem('accessToken'); // Clean up the invalid token
    return false;
  }

};

/**
 * Removes the access token from localStorage to log the user out.
 */
const logout = () => {
  localStorage.removeItem('accessToken');
  // You might also want to remove user info
  // localStorage.removeItem('user');
  
  // Redirect to login page
  window.location.href = '/login'; 
};


const authService = {
  sendOtp,
  loginWithOtp,
  isAuthenticated,
  logout,
};

export default authService;