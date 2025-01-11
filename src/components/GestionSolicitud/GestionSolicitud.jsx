import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import "./../../styles/gestionsolicitud.css";
import authService from '../../service/auth.service';
import Swal from 'sweetalert2';  // Importa SweetAlert2

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
  const [usuarios, setUsuarios] = useState([]);

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

    const fetchUsuarios = async () => {
      try {
        const usuarios = await authService.getUsuariosConRol();
        if (Array.isArray(usuarios)) {
          setUsuarios(usuarios);
          console.log('listado usuarios:', usuarios);
        } else {
          throw new Error('La respuesta no contiene datos de usuarios.');
        }
      } catch (error) {
        console.error('Error al obtener los usuarios:', error.message || error);
        setError('Error al cargar los usuarios.');
      }
    };
    fetchSolicitudes();
    fetchUsuarios();
  }, []);

  const handleExportarSolicitudes = async () => {
    try {
      const response = await SolicitudService.exportarSolicitudes();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'solicitudes.xlsx'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al exportar las solicitudes:', error);
      setError('Error al exportar las solicitudes.');
    }
  };

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
    // Confirmación con SweetAlert antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta solicitud se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await SolicitudService.eliminarSolicitud(id);
          setSolicitudes(solicitudes.filter(solicitud => solicitud._id !== id));
          Swal.fire('Eliminado!', 'La solicitud ha sido eliminada.', 'success');
        } catch (error) {
          setError('Error al eliminar la solicitud.');
          console.error('Error al eliminar la solicitud:', error);
          Swal.fire('Error!', 'No se pudo eliminar la solicitud.', 'error');
        }
      }
    });
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'form') resetForm();
  };

  const handleVerImagen = (imagenUrl) => {
    window.open(imagenUrl, '_blank');
  };

  const handleShowUserData = async (id) => {
    console.log("ID del usuario que se va a buscar:", id);
    try {
      const response = await authService.UserService(id);
      console.log("Respuesta de la API:", response);
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

      <button onClick={handleExportarSolicitudes}>
        Exportar Solicitudes a Excel
      </button>

      {view === 'form' ? (
        <form onSubmit={handleSubmit} className="solicitud-form">
          <div className="form-group">
            <select name="usuario_id" value={newSolicitud.usuario_id} onChange={handleInputChange} required>
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario._id}>{usuario.name}</option>
              ))}
            </select>
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
        <div className="table-container">
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
        </div>
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
                <p><strong>Rol:</strong> {selectedUserData.role}</p>
                <p><strong>Fecha de creación:</strong> {new Date(selectedUserData.createdAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionSolicitud;
