import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import Home from './components/home/home'; // Asegúrate de que el nombre esté en PascalCase
import Dashboard from './components/Dashboard/dashboard';
import Login from './components/Auth/Login';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/*" element={<AuthRoutes />} /> {/* Rutas anidadas de autenticación */}
      <Route path="/home" element={<Home />} /> {/* Asegúrate de usar <Home /> */}
      <Route path="/login" element={<Login />} /> {/* Ruta para la página de login */}

      {/* 
      Puedes agregar más rutas aquí si es necesario 
      */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default AppRouter;
