import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import Home from "../home/home";
import Usuarios from "../Auth/Usuarios";
import GestionSolicitud from "../GestionSolicitud/GestionSolicitud";
import GestionMantenimiento from "../GestionMantenimiento/HistorialMantenimiento";
import HistorialSolicitud from "../HistorialSolicitud/HistorialSolicitud";
import GestionTecnico from "../GestionTecnico/GestionTecnico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faFileAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./../../styles/dashboard.css"; // Importar CSS específico

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);
  const [content, setContent] = useState(<Home />);

  useEffect(() => {
    if (!user) {
      navigate("/login");
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

  return (
    <>
      {/* Barra superior con el contenido principal dentro */}
      <nav className="navbar navbar-dark bg-primary fixed-top">
        <div className="container-fluid d-flex align-items-center">
          <img
            src="/path/to/logo.png"
            alt="Logo"
            className="me-3"
            style={{ width: "40px", height: "40px" }}
          />
          <span className="navbar-brand mb-0 h1">Mi Dashboard</span>
          {user && (
            <div className="d-flex align-items-center ms-auto">
              <div className="text-white me-3">
                <span>Bienvenido, {user.name}</span>
                <br />
                <span>Rol: {user.role}</span>
              </div>
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt="Perfil"
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="d-flex flex-column" id="wrapper" style={{ marginTop: "56px" }}>
        {/* Sidebar con el contenido */}
        <div id="sidebar-wrapper" className="bg-light border-right">
          <div className="sidebar-heading text-center py-4">
            <h4>Mi Dashboard</h4>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <button onClick={() => handleContentChange(<Home />)} className="btn btn-light w-100 text-start">
                <FontAwesomeIcon icon={faHome} /> Inicio
              </button>
            </li>
            <li className="list-group-item">
              <button onClick={() => handleContentChange(<Usuarios />)} className="btn btn-light w-100 text-start">
                <FontAwesomeIcon icon={faUser} /> Usuarios
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<GestionSolicitud />)}
                className="btn btn-light w-100 text-start"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Gestión Solicitudes
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<GestionMantenimiento />)}
                className="btn btn-light w-100 text-start"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Gestión Mantenimiento
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<HistorialSolicitud />)}
                className="btn btn-light w-100 text-start"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Historial Solicitudes
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<GestionTecnico />)}
                className="btn btn-light w-100 text-start"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Gestión Técnicos
              </button>
            </li>
            <li className="list-group-item">
              <button onClick={handleLogout} className="btn btn-danger w-100 text-start">
                <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido principal dentro de la barra superior */}
        <div id="page-content-wrapper" className="container-fluid" style={{ marginLeft: "250px", padding: "20px" }}>
          {user ? (
            <div className="text-center">
              <div className="mt-4">{content}</div>
              {timeLeft !== null && (
                <p className="text-muted mt-3">Tiempo restante para la expiración del token: {timeLeft} segundos</p>
              )}
            </div>
          ) : (
            <h1 className="mt-4 text-center">Cargando...</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
