import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import '../../App.css'; // Importa el archivo CSS

function GestionSolicitud() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [newSolicitud, setNewSolicitud] = useState({
    usuario_id: '',
    categoria_id: '',
    descripcion: '',
    telefono: '',
    departamento: '',
    ciudad: '',
    barrio: '',
    direccion: '',
    estado: 'Revisado',
  });

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await SolicitudService.obtenerSolicitudes();
        console.log('Respuesta del backend:', response.data);
        setSolicitudes(response.data);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSolicitud({ ...newSolicitud, [name]: value });
  };

  const handleCrearSolicitud = async (e) => {
    e.preventDefault();
    try {
      const response = await SolicitudService.crearSolicitud(newSolicitud);
      setSolicitudes([...solicitudes, response.data]);
      setNewSolicitud({
        usuario_id: '',
        categoria_id: '',
        descripcion: '',
        telefono: '',
        departamento: '',
        ciudad: '',
        barrio: '',
        direccion: '',
        estado: 'Revisado',
      });
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
    }
  };

  const handleEliminarSolicitud = async (id) => {
    try {
      await SolicitudService.eliminarSolicitud(id);
      setSolicitudes(solicitudes.filter(solicitud => solicitud._id !== id));
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
    }
  };

  return (
    <div className="gestion-solicitud">
      <h1>Gestión de Solicitudes</h1>
      <form onSubmit={handleCrearSolicitud} className="solicitud-form">
        <input type="text" name="usuario_id" placeholder="Usuario ID" value={newSolicitud.usuario_id} onChange={handleInputChange} />
        <input type="text" name="categoria_id" placeholder="Categoría ID" value={newSolicitud.categoria_id} onChange={handleInputChange} />
        <input type="text" name="descripcion" placeholder="Descripción" value={newSolicitud.descripcion} onChange={handleInputChange} />
        <input type="text" name="telefono" placeholder="Teléfono" value={newSolicitud.telefono} onChange={handleInputChange} />
        <input type="text" name="departamento" placeholder="Departamento" value={newSolicitud.departamento} onChange={handleInputChange} />
        <input type="text" name="ciudad" placeholder="Ciudad" value={newSolicitud.ciudad} onChange={handleInputChange} />
        <input type="text" name="barrio" placeholder="Barrio" value={newSolicitud.barrio} onChange={handleInputChange} />
        <input type="text" name="direccion" placeholder="Dirección" value={newSolicitud.direccion} onChange={handleInputChange} />
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map(solicitud => (
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
                <button onClick={() => handleEliminarSolicitud(solicitud._id)}>Eliminar</button>
                {/* Aquí podrías agregar un botón para editar si implementas la funcionalidad */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionSolicitud;