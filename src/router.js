// src/router.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/users"
      element={
        <PrivateRoute>
          <UserPage />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRouter;
