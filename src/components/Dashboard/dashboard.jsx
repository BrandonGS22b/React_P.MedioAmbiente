import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import "../../App.css";
import Home from "../home/home";
import Usuarios from "../Auth/Usuarios";
import GestionSolicitud from "../GestionSolicitud/GestionSolicitud";
import GestionMantenimiento from "../GestionMantenimiento/HistorialMantenimiento";
import HistorialSolicitud from "../HistorialSolicitud/HistorialSolicitud";
import GestionTecnico from "../GestionTecnico/GestionTecnico";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faFileAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);
  const [content, setContent] = useState(<Home />);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const expiresIn = localStorage.getItem("expiresIn");
    if (expiresIn) {
      setTimeLeft(parseInt(expiresIn, 10));
      const timeout = setTimeout(() => {
        logout();
      }, parseInt(expiresIn, 10) * 1000);
      return () => clearTimeout(timeout);
    }
  }, [user, logout, navigate]);

  const handleLogout = () => {
    logout();
  };

  const handleContentChange = (newContent) => {
    if (user) {
      setContent(newContent);
    }
  };

  console.log('Tiempo restante para la caducación: ' + timeLeft);

  return (
    <>
      {/* Barra superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <img src="/path/to/logo.png" alt="Logo" style={{ width: '40px', height: '40px' }} className="me-2" />
          <span className="navbar-brand">Mi Dashboard</span>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {user && user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt="Perfil"
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px' }}
                />
              )}
            </li>
          </ul>
        </div>
      </nav>

      <div className="d-flex" id="wrapper" style={{ marginTop: '56px', height: '100vh' }}>
        {/* Sidebar */}
        <div id="sidebar-wrapper" className="bg-light border-right" style={{ height: '100vh', position: 'fixed' }}>
          <div className="sidebar-heading">Mi Dashboard</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <button onClick={() => handleContentChange(<Home />)} className="btn btn-light w-100">
                <FontAwesomeIcon icon={faHome} /> Inicio
              </button>
            </li>
            <li className="list-group-item">
              <button onClick={() => handleContentChange(<Usuarios />)} className="btn btn-light w-100">
                <FontAwesomeIcon icon={faUser} /> Usuarios
              </button>
            </li>



            <li className="list-group-item">
              <button onClick={() => handleContentChange(<GestionSolicitud />)} className="btn btn-light w-100">
                <FontAwesomeIcon icon={faFileAlt} /> Gestion Solicitudes
              </button>
            </li>


            <li className="list-group-item">
              <button onClick={() => handleContentChange(<GestionMantenimiento/>)} className="btn btn-light w-100">
                <FontAwesomeIcon icon={faFileAlt} />    Gestion de mantenimiento
              </button>
            </li>

            <li className="list-group-item">
              <button onClick={() => handleContentChange(<HistorialSolicitud/>)} className="btn btn-light w-100">
                <FontAwesomeIcon icon={faFileAlt} />    Historial de Solicitudes
              </button>
            </li>

            <li className="list-group-item">
              <button onClick={() => handleContentChange(<GestionTecnico/>)} className="btn btn-light w-100">
                <FontAwesomeIcon icon={faFileAlt} />    Gestion Tecnicos
              </button>
            </li>


            <li className="list-group-item">
              <button onClick={handleLogout} className="btn btn-danger w-100">
                <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div id="page-content-wrapper" className="container-fluid" style={{ marginLeft: '250px', overflowY: 'auto', height: '100vh', padding: '20px' }}>
          {user ? (
            <>
              <h1 className="mt-4">Bienvenido, {user.name}</h1>
              <h2 className="mt-4">Rol: {user.role}</h2>
              <div className="mt-4">{content}</div>
              {timeLeft !== null && (
                <p className="text-muted">Tiempo restante para la expiración del token: {timeLeft} segundos</p>
              )}
            </>
          ) : (
            <h1 className="mt-4">Cargando...</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
