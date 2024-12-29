import React, { useState, useEffect } from "react";

const UsuarioForm = ({ onSubmit, selectedUsuario, setSelectedUsuario, setError }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipodedocumento, setTipoDeDocumento] = useState("");
  const [img, setImg] = useState("");
  const [estado, setEstado] = useState("activo");

  useEffect(() => {
    if (selectedUsuario) {
      setNombre(selectedUsuario.name);
      setEmail(selectedUsuario.email);
      setRole(selectedUsuario.role);
      setDireccion(selectedUsuario.direccion || "");
      setTelefono(selectedUsuario.telefono || "");
      setTipoDeDocumento(selectedUsuario.tipodedocumento || "");
      setImg(selectedUsuario.img || "");
      setEstado(selectedUsuario.estado || "activo");
      setPassword(""); // No cargar la contraseña por seguridad
    }
  }, [selectedUsuario]);

  const handleSubmit = () => {
    if (
      !nombre ||
      !email ||
      !direccion ||
      !telefono ||
      !tipodedocumento ||
      (!selectedUsuario && !password)
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    onSubmit({
      name: nombre,
      email,
      password,
      role,
      direccion,
      telefono,
      tipodedocumento,
      img,
      estado,
    });
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setPassword("");
    setRole("usuario");
    setDireccion("");
    setTelefono("");
    setTipoDeDocumento("");
    setImg("");
    setEstado("activo");
    setSelectedUsuario(null);
  };

  return (
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
        placeholder={selectedUsuario ? "Nueva Contraseña (Opcional)" : "Contraseña"}
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
      <select value={tipodedocumento} onChange={(e) => setTipoDeDocumento(e.target.value)}>
        <option value="" disabled>
          Seleccione tipo de documento
        </option>
        <option value="CC">Cédula de ciudadanía</option>
        <option value="TI">Tarjeta de identidad</option>
        <option value="CE">Cédula de extranjería</option>
      </select>
      <input
        type="text"
        placeholder="URL de Imagen (Opcional)"
        value={img}
        onChange={(e) => setImg(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="usuario">Usuario</option>
        <option value="admin">Admin</option>
        <option value="tecnico">Técnico</option>
      </select>
      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
      <button onClick={handleSubmit} className="primary-button">
        {selectedUsuario ? "Actualizar Usuario" : "Agregar Usuario"}
      </button>
    </div>
  );
};

export default UsuarioForm;
