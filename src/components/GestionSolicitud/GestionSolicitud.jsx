import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import '../../App.css'; // Importa el archivo CSS

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
  const [selectedImage, setSelectedImage] = useState(null); // Para la imagen seleccionada para ver

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await SolicitudService.obtenerSolicitudes();
        setSolicitudes(response.data);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        setError('Error al cargar las solicitudes.'); // Manejo de errores al obtener solicitudes
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

  const handleCrearSolicitud = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newSolicitud).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      const response = await SolicitudService.crearSolicitud(formData);
      setSolicitudes((prevSolicitudes) => [...prevSolicitudes, response.data]);
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
      setError(''); // Reiniciar errores
    } catch (error) {
      setError('Error al crear la solicitud. Por favor, inténtalo de nuevo.');
      console.error('Error al crear la solicitud:', error);
    }
  };

  const handleEliminarSolicitud = async (id) => {
    try {
      await SolicitudService.eliminarSolicitud(id);
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.filter((solicitud) => solicitud._id !== id)
      );
    } catch (error) {
      setError('Error al eliminar la solicitud. Por favor, inténtalo de nuevo.');
      console.error('Error al eliminar la solicitud:', error);
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gestion-solicitud">
      <h1>Gestión de Solicitudes</h1>
      {error && <p className="error-message">{error}</p>} {/* Mostrar mensajes de error */}
      <form onSubmit={handleCrearSolicitud} className="solicitud-form">
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
        <button type="submit">Crear Solicitud</button>
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
                  <>
                    <img
                      src={`https://loginexpress-ts-jwt.onrender.com/uploads/${solicitud.imagen}`} // Cambia a la URL de tu servidor
                      alt="Solicitud"
                      style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                      onClick={() => handleImageClick(`https://loginexpress-ts-jwt.onrender.com/uploads/${solicitud.imagen}`)}
                    />
                    <button onClick={() => handleImageClick(`https://loginexpress-ts-jwt.onrender.com/uploads/${solicitud.imagen}`)}>Ver</button>
                  </>
                )}
              </td>
              <td>
                <button onClick={() => handleEliminarSolicitud(solicitud._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para ver imagen */}
      {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <img src={selectedImage} alt="Imagen Solicitud" style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionSolicitud;
