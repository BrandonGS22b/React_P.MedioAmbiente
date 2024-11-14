import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import authService from '../../service/auth.service';
import GestionTecnicoService from '../../service/GestionTecnicos.service';

function HistorialSolicitud() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorialSolicitudes = async () => {
      try {
        console.log('Iniciando la obtención de datos...');
        const [solicitudesResponse, authServiceResponse, GestionTecnicoServiceResponse] = await Promise.all([
          SolicitudService.obtenerSolicitudes(),
          authService.getTechnicians(),
          GestionTecnicoService.obtenerTodasAsignaciones(),
        ]);

        console.log('Solicitudes Response:', solicitudesResponse);
        console.log('Técnicos Response:', authServiceResponse);
        console.log('Asignaciones Response:', GestionTecnicoServiceResponse);

        // Asegurémonos de revisar la estructura de los datos para cada respuesta
        if (!solicitudesResponse?.data) {
          console.error('No se obtuvo la respuesta de solicitudes');
          setError('No se pudieron obtener las solicitudes correctamente');
          return;
        }

        // Aquí revisamos si authServiceResponse tiene un arreglo de técnicos
        if (!Array.isArray(authServiceResponse) || authServiceResponse.length === 0) {
          console.error('No se obtuvo la respuesta de técnicos');
          setError('No se pudieron obtener los técnicos correctamente');
          return;
        }

        if (!GestionTecnicoServiceResponse) {
          console.error('No se obtuvo la respuesta de asignaciones');
          setError('No se pudieron obtener las asignaciones correctamente');
          return;
        }

        const solicitudesData = solicitudesResponse.data;
        const tecnicosData = authServiceResponse; // ahora solo es un arreglo, no es necesario acceder a .data
        const asignacionesData = GestionTecnicoServiceResponse;

        console.log('Solicitudes Data:', solicitudesData);
        console.log('Técnicos Data:', tecnicosData);
        console.log('Asignaciones Data:', asignacionesData);
        

        const tecnicosMap = tecnicosData.reduce((map, tecnico) => {
          map[tecnico._id] = tecnico;
          return map;
        }, {});

        console.log('Mapa de Técnicos:', tecnicosMap);
        

        const solicitudesConImagenes = asignacionesData
        .map((asignacion) => {
          const solicitud = solicitudesData.find((sol) => sol._id === asignacion.solicitudId);
          const tecnico = tecnicosMap[asignacion.tecnicoId];
      
          // Solo incluir solicitudes que tengan estado 'Solucionado'
          if (!solicitud || solicitud.estado !== 'Solucionado') return null;
      
          // Revisar si la imagen del técnico está dentro de 'asignacion.tecnico.imagen'
          const imagenTecnico = asignacion.imagen || 'URL_IMAGEN_POR_DEFECTO';
          console.log('Imagen Técnico:', imagenTecnico); // Asegurarse que la URL esté correcta
          return {
            id: solicitud._id,
            descripcion: asignacion.descripcion,
            tecnicoAsignado: tecnico?.name || 'No asignado',
            estado: solicitud.estado,
            imagenCliente: solicitud.imagen || 'URL_IMAGEN_POR_DEFECTO',
            imagenTecnico: imagenTecnico,
            
          };
          
        })
        .filter(Boolean);
        console.log('Solicitudes con imágenes y filtradas:', solicitudesConImagenes);

        setSolicitudes(solicitudesConImagenes);
        setLoading(false); // Detener el cargando
      } catch (error) {
        console.error('Error en la obtención de solicitudes:', error);
        setError('Error al obtener el historial de solicitudes');
        setLoading(false); // Detener el cargando
      }
    };

    fetchHistorialSolicitudes();
  }, []);

  if (loading) {
    console.log('Cargando datos...');
    return <p>Cargando...</p>;
  }

  if (error) {
    console.error('Error:', error);
    return <p>{error}</p>;
  }

  console.log('Solicitudes cargadas:', solicitudes);

  return (
    <div className="historial-solicitud">
      <h1>Historial de Solicitudes</h1>
      <p>Aquí podrás ver solo las órdenes en estado solucionado.</p>

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes en estado solucionado.</p>
      ) : (
        <table className="historial-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Técnico Asignado</th>
              <th>Estado</th>
              <th>Foto del Cliente</th>
              <th>Foto del Técnico</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id}>
                <td>{solicitud.id}</td>
                <td>{solicitud.descripcion}</td>
                <td>{solicitud.tecnicoAsignado}</td>
                <td>{solicitud.estado}</td>
                <td>
                  <img
                    src={solicitud.imagenCliente}
                    alt="Foto del Cliente"
                    style={{ width: '100px', height: 'auto' }}
                  />
                </td>
                <td>
                  <img
                    src={solicitud.imagenTecnico}
                    alt="Foto del Técnico"
                    style={{ width: '100px', height: 'auto' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HistorialSolicitud;
