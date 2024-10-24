import React, { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import authService from "../../service/auth.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../App.css'; // Importa el archivo CSS

function Usuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario"); // Valor predeterminado de la lista desplegable
  const [editando, setEditando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [error, setError] = useState("");

  // Obtener usuarios del backend
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const { users } = await authService.getUsuarios();
        console.log("Usuarios obtenidos:", users);
        setUsuarios(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error('Error obteniendo usuarios:', error);
      }
    };

    if (user) {
      fetchUsuarios();
    }
  }, [user]);

  const handleAgregarOActualizarUsuario = async () => {
    // Validar campos requeridos
    if (!nombre || !email || (!editando && !password) || !role) {
      setError("Todos los campos son obligatorios, excepto la contraseña al editar");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("El email no es válido");
      return;
    }

    setError(""); // Limpiar errores previos

    // Preparar datos a enviar
    const dataToUpdate = { name: nombre, email, role }; 

    if (editando) {
      // Editar usuario
      if (password) {
        dataToUpdate.password = password; // Solo incluir la contraseña si se ha cambiado
      }
    } else {
      // Agregar nuevo usuario
      if (password) { // Asegúrate de incluir el password al agregar un nuevo usuario
        dataToUpdate.password = password; 
      }
    }

    try {
      if (editando) {
        const updatedUser = await authService.updateUsuario(usuarioId, dataToUpdate);
        setUsuarios(usuarios.map(usuario => 
          usuario.id === usuarioId ? { ...usuario, ...dataToUpdate } : usuario
        ));
        setEditando(false);
        setUsuarioId(null);
      } else {
        const nuevoUsuario = await authService.createUsuario(dataToUpdate);
        setUsuarios([...usuarios, { ...nuevoUsuario, role }]);
      }
    } catch (error) {
      console.error('Error agregando o actualizando usuario:', error.response?.data || error.message);
      setError("Error agregando usuario. Revisa los datos e inténtalo de nuevo.");
    }

    // Limpiar los campos del formulario
    setNombre("");
    setEmail("");
    setPassword("");
    setRole("usuario"); // Restablecer el rol al valor predeterminado
  };

  const handleEditarUsuario = (usuario) => {
    setNombre(usuario.name); // Asegurarse de usar 'name' aquí también
    setEmail(usuario.email);
    setRole(usuario.role);
    setUsuarioId(usuario.id);
    setEditando(true);
  };

  const handleEliminarUsuario = async (id) => {
    try {
      await authService.deleteUsuario(id);
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  };

  if (!user) {
    return <p>No tienes acceso a esta sección. Por favor, inicia sesión.</p>;
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

        {/* Lista desplegable para seleccionar el rol */}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="usuario">usuario</option>
          <option value="admin">admin</option>
          <option value="tecnico">tecnico</option>
        </select>

        <button onClick={handleAgregarOActualizarUsuario}>
          {editando ? "Actualizar Usuario" : "Agregar Usuario"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>} {/* Mostrar error */}

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
