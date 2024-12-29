import React, { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import authService from "../../service/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faBan, faListAlt } from "@fortawesome/free-solid-svg-icons";
import "../../styles/usuario.css";

function Usuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipodedocumento, setTipoDeDocumento] = useState("");
  const [cedula, setCedula] = useState("");
  const [documento, setDocumento] = useState(""); // Campo de documento
  const [editando, setEditando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [mostrarLista, setMostrarLista] = useState(true);

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
    if (!nombre || !email || (!editando && !password) || !role || !direccion || !telefono || !tipodedocumento || !cedula || !documento) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("El email no es válido.");
      return;
    }

    const telefonoRegex = /^[0-9]{10}$/;
    if (telefono && !telefonoRegex.test(telefono)) {
      setError("El teléfono debe tener 10 dígitos.");
      return;
    }

    setError(null); // Limpiar el error si pasa la validación

    const dataToSubmit = { name: nombre, email, role, direccion, telefono, tipodedocumento, documento, cedula };
    if (password) dataToSubmit.password = password;

    try {
      if (editando) {
        await authService.updateUsuario(usuarioId, dataToSubmit);
        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.id === usuarioId ? { ...usuario, ...dataToSubmit } : usuario
          )
        );
      } else {
        const nuevoUsuario = await authService.createUsuario(dataToSubmit);
        // Asegúrate de que el nuevo usuario tenga el formato adecuado para agregarlo al estado
        setUsuarios((prev) => [...prev, nuevoUsuario]);
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
    setDireccion("");
    setTelefono("");
    setTipoDeDocumento("");
    setCedula("");
    setDocumento(""); // Limpiar el campo documento
    setEditando(false);
    setUsuarioId(null);
  };

  const handleFilterChange = (event) => {
    setFiltro(event.target.value);
  };

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      <h1>Gestión de Usuarios</h1>
      <div className="form-container">
        <div className="d-flex justify-content-between mb-2">
          <input
            type="text"
            className="form-control me-2 m-2"
            placeholder="Buscar por nombre..."
            value={filtro}
            onChange={handleFilterChange}
          />
          <button className="btn btn-success me-2 m-2" onClick={() => setMostrarLista(!mostrarLista)}>
            <FontAwesomeIcon icon={faListAlt} /> {mostrarLista ? "Agregar Usuario" : "Ver Lista"}
          </button>
        </div>

        {!mostrarLista && (
          <>
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
            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <input
              type="text"
              placeholder="Número de Cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
            <input
              type="text"
              placeholder="Documento"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)} // Campo para documento
            />
            <select
              value={tipodedocumento}
              onChange={(e) => setTipoDeDocumento(e.target.value)}
            >
              <option value="">Seleccione Tipo de Documento</option>
              <option value="CC">Cédula</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Cédula de Extranjería">Cédula de Extranjería</option>
            </select>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
              <option value="tecnico">Técnico</option>
            </select>
            <button onClick={handleAgregarOActualizarUsuario}>Guardar</button>
          </>
        )}

        {error && <div className="error">{error}</div>}
      </div>

      {mostrarLista && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.name}</td>
                <td>{usuario.email}</td>
                <td>{usuario.role}</td>
                <td>
                  <button>
                    <FontAwesomeIcon icon={faEye} /> Ver
                  </button>
                  <button>
                    <FontAwesomeIcon icon={faBan} /> Desactivar
                  </button>
                  <button>
                    <FontAwesomeIcon icon={faListAlt} /> Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Usuarios;
