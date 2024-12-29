import React, { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import authService from "../../service/auth.service";
import UsuarioForm from "../../components/UsuarioForm";
import UsuariosTable from "../../components/UsuariosTable";
import "../../styles/usuario.css";

const Usuarios = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const { users } = await authService.getUsuarios();
        setUsuarios(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };

    if (user) fetchUsuarios();
  }, [user]);

  const handleAgregarOActualizarUsuario = async (usuarioData) => {
    try {
      if (selectedUsuario) {
        await authService.updateUsuario(selectedUsuario.id, usuarioData);
        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.id === selectedUsuario.id ? { ...usuario, ...usuarioData } : usuario
          )
        );
      } else {
        const nuevoUsuario = await authService.createUsuario(usuarioData);
        setUsuarios((prev) => [...prev, { ...nuevoUsuario, role: usuarioData.role }]);
      }
      setSelectedUsuario(null);
      setError("");
    } catch (error) {
      setError("Error procesando la solicitud.");
      console.error(error);
    }
  };

  const handleEditarUsuario = (usuario) => {
    setSelectedUsuario(usuario);
  };

  const handleEliminarUsuario = async (id) => {
    try {
      await authService.deleteUsuario(id);
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  if (!user) {
    return <p className="no-access">No tienes acceso a esta sección. Por favor, inicia sesión.</p>;
  }

  return (
    <div className="usuarios-container">
      <h1>Gestión de Usuarios</h1>
      <UsuarioForm
        onSubmit={handleAgregarOActualizarUsuario}
        selectedUsuario={selectedUsuario}
        setSelectedUsuario={setSelectedUsuario}
        setError={setError}
      />
      {error && <p className="error-message">{error}</p>}
      <UsuariosTable
        usuarios={usuarios}
        onEdit={handleEditarUsuario}
        onDelete={handleEliminarUsuario}
      />
    </div>
  );
};

export default Usuarios;
