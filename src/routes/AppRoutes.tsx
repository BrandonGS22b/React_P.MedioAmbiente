import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Usuarios from '../pages/Usuarios';
import Solicitudes from '../pages/Solicitudes';
import Historial from '../pages/History';
import Perfil from '../pages/Perfil';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Login />} />
                <Route path="/Home" element={<Home />} />
                
                <Route path="/register" element={<Register />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/solicitudes" element={<Solicitudes />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/perfil" element={<Perfil />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
