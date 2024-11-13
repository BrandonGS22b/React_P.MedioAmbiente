import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import authService from '../../service/auth.service';
import GestionTecnicoService from '../../service/GestionTecnicos.service';

function HistorialSolicitud() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchHistorialSolicitudes = async () => {
      try {
        // Obtener las solicitudes, técnicos, y asignaciones en paralelo
        const [solicitudesResponse, tecnicosResponse, asignacionesResponse] = await Promise.all([
          SolicitudService.obtenerSolicitudes(),
          authService.getTechnicians(),
          GestionTecnicoService.obtenerTodasAsignaciones(),
        ]);

        // Verificar si tecnicosResponse.data existe, de lo contrario establecer un array vacío
        const tecnicosData = tecnicosResponse?.data || [];
        const asignacionesData = asignacionesResponse?.data || [];
        const solicitudesData = solicitudesResponse?.data || [];

        // Crear un mapa de técnicos para acceder rápido por ID
        const tecnicosMap = tecnicosData.reduce((map, tecnico) => {
          map[tecnico._id] = tecnico;
          return map;
        }, {});

        // Filtrar solo las solicitudes en estado "Solucionado"
        const filtradas = solicitudesData.filter(
          (solicitud) => solicitud.estado === 'Solucionado'
        );

        // Añadir información del técnico y sus imágenes a cada solicitud
        const solicitudesConImagenes = filtradas.map((solicitud) => {
          const asignacion = asignacionesData.find(
            (asignacion) => asignacion.solicitudId === solicitud._id
          );
          const tecnico = asignacion ? tecnicosMap[asignacion.tecnicoId] : null;

          return {
            ...solicitud,
            tecnico,
            imagenTecnico: asignacion ? asignacion.imagen : null,
            imagenCliente: solicitud.imagen,
          };
        });

        setSolicitudes(solicitudesConImagenes);
      } catch (error) {
        console.error('Error al obtener el historial de solicitudes:', error);
      }
    };

    fetchHistorialSolicitudes();
  }, []);

  return (
    <div className="historial-solicitud">
      <h1>Historial de Solicitudes</h1>
      <p>Aquí podrás ver solo las órdenes en estado solucionado.</p>

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
              <td>{solicitud.tecnico ? solicitud.tecnico.name : 'No asignado'}</td>
              <td>{solicitud.estado}</td>
              <td>{solicitud.usuario?.nombre}</td>
              <td>
                {solicitud.imagenCliente && (
                  <img
                    src={solicitud.imagenCliente}
                    alt="Foto del Cliente"
                    style={{ width: '100px', height: 'auto' }}
                  />
                )}
              </td>
              <td>
                {solicitud.imagenTecnico && (
                  <img
                    src={solicitud.imagenTecnico}
                    alt="Foto del Técnico"
                    style={{ width: '100px', height: 'auto' }}
                  />
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
