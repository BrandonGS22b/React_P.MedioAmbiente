import React, { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import authService from "../../service/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../styles/usuario.css"; // Importa el archivo CSS

function Usuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");
  const [editando, setEditando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
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
    if (user) {
      fetchUsuarios();
    }
  }, [user]);

  const handleAgregarOActualizarUsuario = async () => {
    if (!nombre || !email || (!editando && !password) || !role) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("El email no es válido.");
      return;
    }

    setError("");
    const dataToUpdate = { name: nombre, email, role };

    if (editando && password) dataToUpdate.password = password;
    else if (!editando && password) dataToUpdate.password = password;

    try {
      if (editando) {
        await authService.updateUsuario(usuarioId, dataToUpdate);
        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.id === usuarioId ? { ...usuario, ...dataToUpdate } : usuario
          )
        );
      } else {
        const nuevoUsuario = await authService.createUsuario(dataToUpdate);
        setUsuarios((prev) => [...prev, { ...nuevoUsuario, role }]);
      }
      limpiarFormulario();
    } catch (error) {
      setError("Error procesando la solicitud.");
      console.error(error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setPassword("");
    setRole("usuario");
    setEditando(false);
    setUsuarioId(null);
  };

  const handleEditarUsuario = (usuario) => {
    setNombre(usuario.name);
    setEmail(usuario.email);
    setRole(usuario.role);
    setUsuarioId(usuario.id);
    setEditando(true);
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
      <div className="form-container">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={editando ? "Nueva Contraseña (Opcional)" : "Contraseña"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="usuario">Usuario</option>
          <option value="admin">Admin</option>
          <option value="tecnico">Técnico</option>
        </select>
        <button onClick={handleAgregarOActualizarUsuario} className="primary-button">
          {editando ? "Actualizar Usuario" : "Agregar Usuario"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.name}</td>
                <td>{usuario.email}</td>
                <td>{usuario.role}</td>
                <td>
                  <button onClick={() => handleEditarUsuario(usuario)} className="edit-button">
                    <FontAwesomeIcon icon={faEdit} /> Editar
                  </button>
                  <button onClick={() => handleEliminarUsuario(usuario.id)} className="delete-button">
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay usuarios disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;
