// src/components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../Services/AuthService'; // Adjust path as needed

/**
 * This component checks if a user is authenticated.
 * If yes, it renders the requested child component (the page).
 * If no, it redirects them to the /login page.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back to that page
    // after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child component (e.g., <DashboardPage />)
  return children;
};

export default ProtectedRoute;