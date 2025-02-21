import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import Home from "../home/home";
import Usuarios from "../Auth/Usuarios";
import GestionSolicitud from "../GestionSolicitud/GestionSolicitud";
import GestionMantenimiento from "../GestionMantenimiento/HistorialMantenimiento";
import HistorialSolicitud from "../HistorialSolicitud/HistorialSolicitud";
import GestionTecnicos from "../GestionTecnico/GestionTecnico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faFileAlt,
  faSignOutAlt,
  faUserShield 
} from "@fortawesome/free-solid-svg-icons";
import "./../../styles/dashboard.css";

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
      const expirationTime = parseInt(expiresIn, 10);
      setTimeLeft(expirationTime);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) return prev - 1;
          clearInterval(interval);
          logout();
          return null;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user, logout, navigate]);

  const handleLogout = () => {
    logout();
  };

  const handleContentChange = (newContent) => {
    if (user) setContent(newContent);
  };

  const renderSidebarOptions = () => {
    const role = user?.role || "";

    switch (role) {
      case "admin":
        return (
          <>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<Home />)}
                className="btn btn-light w-100 text-start"
                aria-label="Inicio"
              >
                <FontAwesomeIcon icon={faHome} /> Inicio
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<Usuarios />)}
                className="btn btn-light w-100 text-start"
                aria-label="Usuarios"
              >
                <FontAwesomeIcon icon={faUser} /> Usuarios
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<GestionSolicitud />)}
                className="btn btn-light w-100 text-start"
                aria-label="Gestión Solicitudes"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Gestión Solicitudes
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<GestionMantenimiento />)}
                className="btn btn-light w-100 text-start"
                aria-label="Gestión Mantenimiento"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Gestión Mantenimiento
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<HistorialSolicitud />)}
                className="btn btn-light w-100 text-start"
                aria-label="Historial Solicitudes"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Historial Solicitudes
              </button>
            </li>

            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<GestionTecnicos />)}
                className="btn btn-light w-100 text-start"
                aria-label="Historial Solicitudes"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Gestion tecnicos
              </button>
            </li>
          </>
        );

      case "tecnico":
        return (
          <>
          <li className="list-group-item">
            <button
              onClick={() => handleContentChange(<Home />)}
              className="btn btn-light w-100 text-start"
              aria-label="Inicio"
            >
              <FontAwesomeIcon icon={faHome} /> Inicio
            </button>
          </li>
            
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<GestionTecnicos />)}
                className="btn btn-light w-100 text-start"
                aria-label="Historial Solicitudes"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Gestion Tecnico
              </button>
            </li>
          </>
        );

      case "auxiliar":
        return (
          <>
           <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<Home />)}
                className="btn btn-light w-100 text-start"
                aria-label="Inicio"
              >
                <FontAwesomeIcon icon={faHome} /> Inicio
              </button>
            </li>
          
          <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<GestionSolicitud />)}
                className="btn btn-light w-100 text-start"
                aria-label="Gestión Solicitudes"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Gestión Solicitudes
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<GestionMantenimiento />)}
                className="btn btn-light w-100 text-start"
                aria-label="Gestión Mantenimiento"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Gestión Mantenimiento
              </button>
            </li>
            <li className="list-group-item">
              <button
                onClick={() => handleContentChange(<HistorialSolicitud />)}
                className="btn btn-light w-100 text-start"
                aria-label="Historial Solicitudes"
              >
                <FontAwesomeIcon icon={faFileAlt} /> Historial Solicitudes
              </button>
            </li>

          </>
        );

      case "usuario":
      default:
        return (
          <li className="list-group-item">
            <button
              onClick={() => handleContentChange(<Home />)}
              className="btn btn-light w-100 text-start"
              aria-label="Inicio"
            >
              <FontAwesomeIcon icon={faHome} /> Inicio
            </button>
          </li>
        );
    }
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-light fixed-top">
        <div className="container-fluid d-flex align-items-center">
          <img
            src="/logo1.jpg"
            alt="Logo"
            className="me-4"
            style={{ width: "110px", height: "110px" }}
          />
          <span className="navbar-brand mb-0 h1">EcoApp</span>
          {user && (
            <div className="d-flex align-items-center ms-auto user-info">
            <FontAwesomeIcon icon={faUser} className="me-2 user-icon" />
            <div className="text-dark me-3">
              <span className="user-name">Bienvenido, {user.name}</span>
              <br />
              <span className="user-role">
                <FontAwesomeIcon icon={faUserShield} className="me-1 role-icon" />
                Rol: {user.role}
              </span>
            </div>
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt="Perfil"
                className="rounded-circle user-profile-picture"
              />
            )}
          </div>
          )}
        </div>
      </nav>

      <div className="d-flex flex-column" id="wrapper" style={{ marginTop: "60px" }}>
        <div id="sidebar-wrapper" className="bg-light border-right">
          <div
            className="sidebar-heading text-center py-3"
            style={{ marginTop: "100px" }}
          >
            <h4>Mi Dashboard</h4>
          </div>
          <ul className="list-group list-group-flush">
            {renderSidebarOptions()}
            <li className="list-group-item">
              <button
                onClick={handleLogout}
                className="btn btn-danger w-100 text-start"
                aria-label="Cerrar Sesión"
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>

        <div id="page-content-wrapper" className="container-fluid">
          <div className="row">
            <div className="col-md-9 col-12 mt-5">{content}</div>
          </div>
          {user ? (
            <div className="text-center mt-4">
              {timeLeft !== null && (
                <p className="text-muted mt-3">
                  Tiempo restante para la expiración del token: {timeLeft}{" "}
                  segundos
                </p>
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
