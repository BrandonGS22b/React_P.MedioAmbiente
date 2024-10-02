import React, { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";

function Usuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [editando, setEditando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  if (!user) {
    return <p>No tienes acceso a esta sección. Por favor, inicia sesión.</p>;
  }

  // Simulando una llamada a la API para obtener usuarios
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchUsuarios = async () => {
      // Reemplaza esto con tu llamada real a la API
      const usuariosObtenidos = [
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        { id: 1, nombre: "Usuario 1", email: "usuario1@example.com" },
        { id: 2, nombre: "Usuario 2", email: "usuario2@example.com" },
        
      ];
      setUsuarios(usuariosObtenidos);
    };

    fetchUsuarios();
  }, []);

  const handleAgregarUsuario = () => {
    if (editando) {
      // Editar usuario
      setUsuarios(usuarios.map((usuario) =>
        usuario.id === usuarioId ? { id: usuarioId, nombre, email } : usuario
      ));
      setEditando(false);
      setUsuarioId(null);
    } else {
      // Agregar nuevo usuario
      const nuevoUsuario = {
        id: Date.now(), // Generar un ID único temporalmente
        nombre,
        email,
      };
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    setNombre("");
    setEmail("");
  };

  const handleEditarUsuario = (usuario) => {
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setUsuarioId(usuario.id);
    setEditando(true);
  };

  const handleEliminarUsuario = (id) => {
    setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>

      <div>
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
        <button onClick={handleAgregarUsuario}>
          {editando ? "Actualizar Usuario" : "Agregar Usuario"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>
                <button onClick={() => handleEditarUsuario(usuario)}>Editar</button>
                <button onClick={() => handleEliminarUsuario(usuario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;
