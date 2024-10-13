import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';

function HistorialSolicitud() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchHistorialSolicitudes = async () => {
      try {
        const response = await SolicitudService.obtenerHistorialSolicitudes();
        // Filtrar solo las solicitudes rechazadas y solucionadas
        const filtradas = response.data.filter(
          (solicitud) => solicitud.estado === 'Rechazada' || solicitud.estado === 'Solucionado'
        );
        setSolicitudes(filtradas);
      } catch (error) {
        console.error('Error al obtener el historial de solicitudes:', error);
      }
    };

    fetchHistorialSolicitudes();
  }, []);

  return (
    <div className="historial-solicitud">
      <h1>Historial de Solicitudes</h1>
      <p>Aquí podrás ver solo las órdenes rechazadas y solucionadas.</p>

      <table className="historial-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Técnico Asignado</th>
            <th>Estado</th>
            <th>Usuario Creador</th>
            <th>Foto del Cliente</th>
            <th>Foto del Técnico</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud._id}>
              <td>{solicitud._id}</td>
              <td>{solicitud.descripcion}</td>
              <td>{solicitud.tecnico?.nombre}</td>
              <td>{solicitud.estado}</td>
              <td>{solicitud.usuario?.nombre}</td>
              <td>
                {solicitud.fotoCliente && (
                  <img src={solicitud.fotoCliente} alt="Foto del Cliente" style={{ width: '100px', height: 'auto' }} />
                )}
              </td>
              <td>
                {solicitud.fotoTecnico && (
                  <img src={solicitud.fotoTecnico} alt="Foto del Técnico" style={{ width: '100px', height: 'auto' }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialSolicitud;
