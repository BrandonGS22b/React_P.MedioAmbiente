// src/routes/AuthRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from '../components/Auth/Login.jsx'; // Asume que tienes un componente Login
import Home from '../components/home/home.jsx';

const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginForm />} /> {/* Ruta principal para Login */}
    <Route path="/home" element={Home} /> {/* Ruta para la página de inicio */}
    
    {/* Agrega más rutas de autenticación aquí si es necesario */}
  </Routes>
);

export default AuthRoutes;
