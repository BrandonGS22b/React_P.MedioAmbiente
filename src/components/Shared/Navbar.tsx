import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/register">Registrarse</Link></li>
                <li><Link to="/usuarios">Usuarios</Link></li>
                <li><Link to="/solicitudes">Solicitudes</Link></li>
                <li><Link to="/historial">Historial</Link></li>
                <li><Link to="/perfil">Perfil</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
