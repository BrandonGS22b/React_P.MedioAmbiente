import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';

function HistorialMantenimiento() {
  const [historial, setHistorial] = useState([]);
  const [tecnicoAsignado, setTecnicoAsignado] = useState('');
  const [gastos, setGastos] = useState('');
  const [diasDuracion, setDiasDuracion] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await SolicitudService.obtenerSolicitudes();
        const filteredHistorial = response.data.filter(
          (solicitud) => solicitud.estado === 'Rechazada' || solicitud.estado === 'Solucionado' || solicitud.estado ==='En proceso' || solicitud.estado ==='Revisado'
        );
        setHistorial(filteredHistorial);
      } catch (error) {
        console.error('Error al obtener el historial:', error);
      }
    };

    fetchHistorial();
  }, []);

  const handleAsignarTecnico = async (solicitudId) => {
    try {
      await SolicitudService.asignarTecnico(solicitudId, tecnicoAsignado);
      alert('Técnico asignado correctamente');
      // Actualiza el historial después de la asignación
      const updatedHistorial = historial.map((solicitud) => 
        solicitud._id === solicitudId ? { ...solicitud, tecnico: tecnicoAsignado } : solicitud
      );
      setHistorial(updatedHistorial);
    } catch (error) {
      console.error('Error al asignar técnico:', error);
    }
  };

  const handleActualizarSolicitud = async (solicitudId) => {
    try {
      await SolicitudService.actualizarSolicitud(solicitudId, { gastos, diasDuracion, comentarios });
      alert('Solicitud actualizada correctamente');
      // Refresca el historial
      const updatedHistorial = historial.map((solicitud) => 
        solicitud._id === solicitudId ? { ...solicitud, gastos, diasDuracion, comentarios } : solicitud
      );
      setHistorial(updatedHistorial);
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
    }
  };

  return (
    <div className="historial-mantenimiento">
      <h1>Historial de Mantenimiento</h1>

      <table className="historial-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Técnico Asignado</th>
            <th>Gastos</th>
            <th>Días de Duración</th>
            <th>Comentarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((solicitud) => (
            <tr key={solicitud._id}>
              <td>{solicitud._id}</td>
              <td>{solicitud.descripcion}</td>
              <td>{solicitud.estado}</td>
              <td>{solicitud.tecnico || 'No asignado'}</td>
              <td>{solicitud.gastos}</td>
              <td>{solicitud.diasDuracion}</td>
              <td>{solicitud.comentarios}</td>
              <td>
                {/* Aquí se pueden añadir botones o campos para asignar técnico y actualizar información */}
                <select onChange={(e) => setTecnicoAsignado(e.target.value)} placeholder="Asignar Técnico">
                  <option value="">Seleccionar Técnico</option>
                  {/* Aquí puedes mapear los técnicos disponibles */}
                  {/* <option value="tecnico1">Técnico 1</option> */}
                </select>
                <button onClick={() => handleAsignarTecnico(solicitud._id)}>Asignar Técnico</button>

                {/* Formulario para actualizar gastos y comentarios */}
                <input
                  type="text"
                  value={gastos}
                  onChange={(e) => setGastos(e.target.value)}
                  placeholder="Gastos"
                />
                <input
                  type="number"
                  value={diasDuracion}
                  onChange={(e) => setDiasDuracion(e.target.value)}
                  placeholder="Días de Duración"
                />
                <input
                  type="text"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  placeholder="Comentarios"
                />
                <button onClick={() => handleActualizarSolicitud(solicitud._id)}>Actualizar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialMantenimiento;
