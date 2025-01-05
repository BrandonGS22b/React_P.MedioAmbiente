import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import "./../../styles/gestionsolicitud.css";
import authService from '../../service/auth.service';

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
  const [view, setView] = useState('list');
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
      setView('list');
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
    setView('form');
  };

  const handleEliminarSolicitud = async (id) => {
    try {
      await SolicitudService.eliminarSolicitud(id);
      setSolicitudes(solicitudes.filter(solicitud => solicitud._id !== id));
    } catch (error) {
      setError('Error al eliminar la solicitud.');
      console.error('Error al eliminar la solicitud:', error);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'form') resetForm();
  };

  const handleVerImagen = (imagenUrl) => {
    window.open(imagenUrl, '_blank');
  };

  const handleShowUserData = async (id) => {
    console.log("ID del usuario que se va a buscar:", id); // Verificar el id
    try {
      const response = await authService.UserService(id);
      console.log("Respuesta de la API:", response);  // Verifica la respuesta de la API
      setSelectedUserData(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      setError('Error al cargar los datos del usuario.');
    }
  };

  const closeUserModal = () => {
    setShowUserModal(false);
  };

  return (
    <div className="gestion-solicitud">
      <h1>Gestión de Solicitudes</h1>
      {error && <p className="error-message">{error}</p>}

      <button onClick={() => handleViewChange(view === 'list' ? 'form' : 'list')}>
        {view === 'list' ? 'Crear Solicitud' : 'Ver Lista'}
      </button>

      {view === 'form' ? (
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
      ) : (
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
              <th>Fecha Creación</th>
              <th>Última Actualización</th>
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
                  <button onClick={() => handleVerImagen(solicitud.imagen)}>Ver Imagen</button>
                  <button onClick={() => handleShowUserData(solicitud.usuario_id)}>Ver datos del usuario</button>
                  <button onClick={() => handleEliminarSolicitud(solicitud._id)}>Eliminar</button>
                  <button onClick={() => handleEditarSolicitud(solicitud)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeUserModal}>&times;</span>
            {selectedUserData && (
              <div>
                <h3>Datos del Usuario</h3>
                <p><strong>ID:</strong> {selectedUserData._id}</p>
                <p><strong>Nombre:</strong> {selectedUserData.name}</p>
                <p><strong>Email:</strong> {selectedUserData.email}</p>
                <p><strong>Teléfono:</strong> {selectedUserData.telefono}</p>
                <p><strong>Dirección:</strong> {selectedUserData.direccion}</p>
                {/* Aquí puedes agregar más datos del usuario según sea necesario */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionSolicitud;
