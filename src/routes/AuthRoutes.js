// src/routes/AuthRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from '../components/Auth/Login.jsx'; // Asume que tienes un componente Login
import Home from '../components/home/home.jsx';
import Dashboard  from '../components/Dashboard/dashboard.jsx';
import login from '../components/Auth/Login.jsx';

const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginForm />} /> {/* Ruta principal para Login */}
    <Route path="/home" element={Home} /> {/* Ruta para la página de inicio */}
    <Route path="/dashboard" element={Dashboard} /> {/* Ruta para la página del dashboard */}
    <Route path="/login" element={login} /> {/* Ruta para la página del login */}


    
    {/* Agrega más rutas de autenticación aquí si es necesario */}
  </Routes>
);

export default AuthRoutes;
