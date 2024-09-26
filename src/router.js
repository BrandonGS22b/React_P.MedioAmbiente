import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import Home from './components/home/home'; // Asegúrate de que el nombre esté en PascalCase

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/*" element={<AuthRoutes />} /> {/* Rutas anidadas de autenticación */}
      <Route path="/home" element={<Home />} /> {/* Asegúrate de usar <Home /> */}
      {/* 
      Puedes agregar más rutas aquí si es necesario 
      */}
    </Routes>
  </Router>
);

export default AppRouter;
