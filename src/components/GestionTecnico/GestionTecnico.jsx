import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';

function GestionTecnico() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [evidencia, setEvidencia] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await SolicitudService.obtenerSolicitudesPorTecnico();
        const solicitudesEnProceso = response.data.filter(
          (solicitud) => solicitud.estado === 'Proceso'
        );
        setSolicitudes(solicitudesEnProceso);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleEvidenciaChange = (e) => {
    setEvidencia(e.target.files[0]);
  };

  const handleEnviarEvidencia = async (solicitudId) => {
    if (!evidencia) {
      alert('Por favor, carga una evidencia antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('evidencia', evidencia);
    formData.append('comentarios', comentarios);

    try {
      await SolicitudService.cargarEvidencia(solicitudId, formData);
      alert('Evidencia cargada y solicitud actualizada correctamente');

      // Actualiza el estado local después de la operación
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.filter((solicitud) => solicitud._id !== solicitudId)
      );
    } catch (error) {
      console.error('Error al enviar la evidencia:', error);
    }
  };

  return (
    <div className="gestion-tecnico">
      <h1>Gestión de Solicitudes</h1>
      <p>Aquí podrás ver las solicitudes que se te han asignado y cargar las evidencias correspondientes.</p>

      <table className="solicitudes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Evidencia</th>
            <th>Comentarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud._id}>
              <td>{solicitud._id}</td>
              <td>{solicitud.descripcion}</td>
              <td>{solicitud.estado}</td>
              <td>
                <input type="file" onChange={handleEvidenciaChange} />
              </td>
              <td>
                <input
                  type="text"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  placeholder="Comentarios"
                />
              </td>
              <td>
                <button onClick={() => handleEnviarEvidencia(solicitud._id)}>Enviar Evidencia</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionTecnico;
