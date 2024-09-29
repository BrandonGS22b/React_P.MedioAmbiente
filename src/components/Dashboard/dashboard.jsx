/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import "../../App.css"; // Aquí irán los estilos personalizados
import Home from "../home/home"; // Asegúrate de que el componente Home esté correctamente exportado
import Usuarios from "../Auth/Usuarios"; // Asegúrate de que el componente Usuarios esté correctamente exportado

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [timeLeft, setTimeLeft] = useState(null);
  const [content, setContent] = useState(<Home />);
  const [showUsuarios, setShowUsuarios] = useState(false);
  
  // Verifica si el usuario está autenticado
  useEffect(() => {
    if (!user) {
      console.log("Usuario no autenticado, redirigiendo a la página de inicio");
      navigate("/"); 
      return;
    }

    // Control del rol del usuario
    const usuarioRol = user.rol; // Asegúrate de que 'rol' esté correctamente asignado
    console.log("Rol del usuario:", usuarioRol); // Verifica el rol del usuario

    // Muestra el botón de usuarios solo si el rol es 'Administrador'
    if (usuarioRol === 'usuario') {
      setShowUsuarios(true);
      console.log("El botón de Usuarios se mostrará");
    } else {
      setShowUsuarios(false);
      console.log("El botón de Usuarios no se mostrará porque el rol no es Administrador");
    }

    const expiresIn = localStorage.getItem("expiresIn");
    if (expiresIn) {
      setTimeLeft(parseInt(expiresIn, 10));
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          logout();
          navigate("/");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleUsuariosClick = () => {
    if (user && user.rol === 'usuario') {
      handleContentChange(<Usuarios />);
      navigate("/Usuarios");
    }
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      {/* Menú de navegación superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home" onClick={() => handleContentChange(<p>Selecciona una opción del menú</p>)}>Mi Dashboard</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/home" onClick={() => handleContentChange(<p>Contenido de Inicio</p>)}>Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile" onClick={() => handleContentChange(<p>Contenido de Perfil</p>)}>Perfil</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reports" onClick={() => handleContentChange(<p>Contenido de Reportes</p>)}>Reportes</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                </button>
              </li>
              {showUsuarios && (
                <li className="nav-item">
                  <button className="list-group-item bg-transparent second-text fw-bold custom-list-button1" onClick={handleUsuariosClick}>
                    <i className="fas fa-users me-2"></i> Usuarios
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenedor principal con sidebar y contenido */}
      <div className="d-flex" id="wrapper">
        {/* Sidebar */}
        <div id="sidebar-wrapper" className="bg-light border-right">
          <div className="sidebar-heading">Mi Dashboard</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <Link to="/home" className="list-group-item-action" onClick={() => handleContentChange(<p>Contenido de Inicio</p>)}>Inicio</Link>
            </li>
            <li className="list-group-item">
              <Link to="/profile" className="list-group-item-action" onClick={() => handleContentChange(<p>Contenido de Perfil</p>)}>Perfil</Link>
            </li>
            <li className="list-group-item">
              <Link to="/reports" className="list-group-item-action" onClick={() => handleContentChange(<p>Contenido de Reportes</p>)}>Reportes</Link>
            </li>
            <li className="list-group-item">
              <button onClick={handleLogout} className="list-group-item-action btn btn-danger w-100">
                <i className="fas fa-sign-out-alt"></i> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido de la página */}
        <div id="page-content-wrapper" className="container-fluid">
          <h1 className="mt-4">Bienvenido, {user.name}</h1>
          <h1 className="mt-4">Bienvenido, {user.role}</h1>
          <div className="mt-4">
            {content} {/* Renderiza el contenido correspondiente */}
          </div>
          {timeLeft !== null && (
            <p className="text-muted">Tiempo restante para la expiración del token: {timeLeft} segundos</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
