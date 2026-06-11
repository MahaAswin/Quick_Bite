import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) {
    // Redirect to login page, but preserve the location they attempted to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect to home/food menu page if not admin
    return <Navigate to="/foods" replace />;
  }

  return children;
};

export default ProtectedRoute;
