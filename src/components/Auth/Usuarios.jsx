import React, { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import authService from "../../service/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faBan, faListAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"; // For feedback
import "../../styles/usuario.css";

function Usuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    role: "usuario",
    direccion: "",
    telefono: "",
    tipodedocumento: "",
    documento: ""
  });
  const [editando, setEditando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [mostrarLista, setMostrarLista] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const { users } = await authService.getUsuarios();
        
        console.log(users); // Verifica la respuesta del servidor
        setUsuarios(Array.isArray(users) ? users : []);
      } catch (error) {
        toast.error("Error al obtener usuarios.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsuarios();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, telefono, documento, password } = formData;
    const emailRegex = /\S+@\S+\.\S+/;
    const telefonoRegex = /^[0-9]{10}$/;
    const documentoRegex = /^[0-9]{5,10}$/;

    if (!emailRegex.test(email)) {
      setError("El email no es válido.");
      return false;
    }
    if (!telefonoRegex.test(telefono)) {
      setError("El teléfono debe tener 10 dígitos.");
      return false;
    }
    if (!documentoRegex.test(documento)) {
      setError("El documento debe contener entre 5 y 10 dígitos.");
      return false;
    }
    if (!editando && !password) {
      setError("La contraseña es obligatoria.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleAgregarOActualizarUsuario = async () => {
    if (!validateForm()) return;

    const { nombre, email, password, role, direccion, telefono, tipodedocumento, documento } = formData;

    const dataToSubmit = {
      name: nombre,
      email,
      password: editando ? undefined : password, // No enviar password si se está editando
      role,
      direccion,
      telefono: parseInt(telefono, 10),
      tipodedocumento,
      documento: parseInt(documento, 10),
    };

    try {
      setLoading(true);
      if (editando) {
        await authService.updateUsuario(usuarioId, dataToSubmit);
        setUsuarios((prev) => prev.map((usuario) => usuario._id === usuarioId ? { ...usuario, ...dataToSubmit } : usuario));
        toast.success("Usuario actualizado correctamente.");
      } else {
        const nuevoUsuario = await authService.createUsuario(dataToSubmit);
        setUsuarios((prev) => [...prev, nuevoUsuario.user]);
        toast.success("Usuario creado correctamente.");
      }
      limpiarFormulario();
    } catch (error) {
      toast.error("Error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      role: "usuario",
      direccion: "",
      telefono: "",
      tipodedocumento: "",
      documento: ""
    });
    setEditando(false);
    setUsuarioId(null);
  };

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleVerUsuario = (id) => {
    const usuario = usuarios.find((u) => u._id === id);
    alert(`Detalles del usuario:\n${JSON.stringify(usuario, null, 2)}`);
  };

  const handleCambiarEstado = async (userId, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo"; 
  
      if (estadoActual === "activo") {
        await authService.disableUser(userId);
      } else {
        await authService.enableUser(userId);
      }
  
      // Actualiza el estado del usuario directamente en la lista sin recargar
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === userId ? { ...usuario, estado: nuevoEstado } : usuario
        )
      );
  
      // Puedes descomentar la siguiente línea si quieres hacer un refresco explícito
      // fetchUsuarios(); 
  
      toast.success(`Usuario ${nuevoEstado === "activo" ? "activado" : "desactivado"} correctamente.`);
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      toast.error("No se pudo cambiar el estado del usuario.");
    }
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
          <button
            className="btn btn-success me-2 m-2"
            onClick={() => setMostrarLista(!mostrarLista)}
          >
            <FontAwesomeIcon icon={faListAlt} />{" "}
            {mostrarLista ? "Agregar Usuario" : "Ver Lista"}
          </button>
        </div>

        {!mostrarLista && (
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder={editando ? "Nueva Contraseña (Opcional)" : "Contraseña"}
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              name="direccion"
              type="text"
              placeholder="Dirección"
              value={formData.direccion}
              onChange={handleInputChange}
            />
            <input
              name="telefono"
              type="number"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
            <select
              name="tipodedocumento"
              value={formData.tipodedocumento}
              onChange={handleInputChange}
            >
              <option value="">Seleccione Tipo de Documento</option>
              <option value="CC">Cédula</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Cédula de Extranjería">Cédula de Extranjería</option>
            </select>
            <input
              name="documento"
              type="text"
              placeholder="Documento"
              value={formData.documento}
              onChange={handleInputChange}
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
              <option value="tecnico">Técnico</option>
              <option value="auxiliar">auxiliar</option>
            </select>
            <button
              onClick={handleAgregarOActualizarUsuario}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Guardar"}
            </button>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>

      {mostrarLista && (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td>{usuario.name}</td>
                <td>{usuario.email}</td>
                <td>{usuario.role}</td>
                <td>{usuario.estado}</td>
                <td>
                  <button onClick={() => handleVerUsuario(usuario._id)} className="btn btn-info m-1">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleCambiarEstado(usuario.id, usuario.estado)}
                    className="btn btn-warning m-1"
                  >
                    <FontAwesomeIcon
                      icon={usuario.estado === "activo" ? faBan : faCheckCircle}
                    />
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
