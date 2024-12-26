import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import authService from '../../service/auth.service';
import "./../../styles/gestionsolicitud.css";
 // Importa el archivo CSS

function GestionSolicitud() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [newSolicitud, setNewSolicitud] = useState({
    usuario_id: '',
    categoria: '',
    descripcion: '',
    telefono: '',
    departamento: '',
    ciudad: '',
    barrio: '',
    direccion: '',
    estado: 'Revisado',
  });
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [editingSolicitudId, setEditingSolicitudId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await SolicitudService.obtenerSolicitudes();
        setSolicitudes(response.data);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        setError('Error al cargar las solicitudes.');
      }
    };

    fetchSolicitudes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSolicitud((prevSolicitud) => ({
      ...prevSolicitud,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newSolicitud).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      if (editingSolicitudId) {
        await SolicitudService.actualizarSolicitud(editingSolicitudId, formData);
        setEditingSolicitudId(null);
      } else {
        await SolicitudService.crearSolicitud(formData);
      }
      const updatedSolicitudes = await SolicitudService.obtenerSolicitudes();
      setSolicitudes(updatedSolicitudes.data);
      resetForm();
    } catch (error) {
      setError('Error al procesar la solicitud. Por favor, inténtalo de nuevo.');
      console.error('Error al procesar la solicitud:', error);
    }
  };

  const resetForm = () => {
    setNewSolicitud({
      usuario_id: '',
      categoria: '',
      descripcion: '',
      telefono: '',
      departamento: '',
      ciudad: '',
      barrio: '',
      direccion: '',
      estado: 'Revisado',
    });
    setImagen(null);
    setError('');
  };

  const handleEliminarSolicitud = async (id) => {
    try {
      await SolicitudService.eliminarSolicitud(id);
      setSolicitudes((prevSolicitudes) => prevSolicitudes.filter((solicitud) => solicitud._id !== id));
    } catch (error) {
      setError('Error al eliminar la solicitud. Por favor, inténtalo de nuevo.');
      console.error('Error al eliminar la solicitud:', error);
    }
  };

  const handleEditarSolicitud = (solicitud) => {
    setEditingSolicitudId(solicitud._id);
    setNewSolicitud({
      usuario_id: solicitud.usuario_id,
      categoria: solicitud.categoria,
      descripcion: solicitud.descripcion,
      telefono: solicitud.telefono,
      departamento: solicitud.departamento,
      ciudad: solicitud.ciudad,
      barrio: solicitud.barrio,
      direccion: solicitud.direccion,
      estado: solicitud.estado,
    });
    setImagen(null);
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleShowUserData = async (id) => {
    try {
      const response = await authService.UserService(id);
      setSelectedUserData(response.data); // Guarda los datos del usuario seleccionado
      setShowUserModal(true); // Muestra el modal de usuario
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      setError('Error al cargar los datos del usuario.');
    }
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUserData(null); // Limpia los datos del usuario al cerrar el modal
  };

  return (
    <div className="gestion-solicitud">
      <h1>Gestión de Solicitudes</h1>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit} className="solicitud-form">
        <div className="form-group">
          <input type="text" name="usuario_id" placeholder="Usuario ID" value={newSolicitud.usuario_id} onChange={handleInputChange} required />
          <input type="text" name="categoria" placeholder="Categoría" value={newSolicitud.categoria} onChange={handleInputChange} required />
          <input type="text" name="descripcion" placeholder="Descripción" value={newSolicitud.descripcion} onChange={handleInputChange} required />
          <input type="text" name="telefono" placeholder="Teléfono" value={newSolicitud.telefono} onChange={handleInputChange} required />
          <input type="text" name="departamento" placeholder="Departamento" value={newSolicitud.departamento} onChange={handleInputChange} required />
          <input type="text" name="ciudad" placeholder="Ciudad" value={newSolicitud.ciudad} onChange={handleInputChange} required />
          <input type="text" name="barrio" placeholder="Barrio" value={newSolicitud.barrio} onChange={handleInputChange} required />
          <input type="text" name="direccion" placeholder="Dirección" value={newSolicitud.direccion} onChange={handleInputChange} required />
          <input type="file" name="imagen" accept="image/*" onChange={handleImageChange} />
          <select name="estado" value={newSolicitud.estado} onChange={handleInputChange}>
            <option value="Revisado">Revisado</option>
            <option value="En proceso">En proceso</option>
            <option value="Solucionado">Solucionado</option>
          </select>
          <button type="submit">{editingSolicitudId ? 'Actualizar Solicitud' : 'Crear Solicitud'}</button>
        </div>
      </form>

      <h2>Solicitudes</h2>
      <table className="solicitudes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Teléfono</th>
            <th>Departamento</th>
            <th>Ciudad</th>
            <th>Barrio</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
            <th>Última Actualización</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud._id}>
              <td>{solicitud._id}</td>
              <td>{solicitud.descripcion}</td>
              <td>{solicitud.telefono}</td>
              <td>{solicitud.departamento}</td>
              <td>{solicitud.ciudad}</td>
              <td>{solicitud.barrio}</td>
              <td>{solicitud.direccion}</td>
              <td>{solicitud.estado}</td>
              <td>{new Date(solicitud.fecha_creacion).toLocaleString()}</td>
              <td>{new Date(solicitud.updatedAt).toLocaleString()}</td>
              <td>
                {solicitud.imagen && (
                  <button onClick={() => handleImageClick(solicitud.imagen)}>
                    Ver imagen
                  </button>
                )}
              </td>
              <td>
                <button onClick={() => handleEditarSolicitud(solicitud)}>Editar</button>
                <button onClick={() => handleEliminarSolicitud(solicitud._id)}>Eliminar</button>
                <button onClick={() => handleShowUserData(solicitud.usuario_id)}>Ver datos del usuario</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para ver imagen */}
      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <img src={selectedImage} alt="Imagen de la solicitud" />
          </div>
        </div>
      )}

      {/* Modal para ver datos del usuario */}
      {showUserModal && selectedUserData && (
        <div className="modal" onClick={handleCloseUserModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseUserModal}>&times;</span>
            <h3>Datos del Usuario</h3>
            <p><strong>Nombre:</strong> {selectedUserData.name}</p>
            <p><strong>Email:</strong> {selectedUserData.email}</p>
            <p><strong>Teléfono:</strong> {selectedUserData.telefono}</p>
            <p><strong>Rol:</strong> {selectedUserData.role}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionSolicitud;
