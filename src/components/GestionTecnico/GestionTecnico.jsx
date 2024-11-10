import React, { useState, useEffect } from 'react';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
import SolicitudService from '../../service/GestionSolicitud.service';
import useAuth from '../../context/useAuth';

function GestionTecnico() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [cargando, setCargando] = useState(true);
  
  const { user } = useAuth();
  const tecnicoId = user && user._id ? user._id : null;

  // Función para obtener el estado actual de una solicitud del backend
  const fetchEstadoSolicitud = async (solicitudId) => {
    try {
      const solicitud = await SolicitudService.obtenerSolicitudPorId(solicitudId);
      console.log('Datos de solicitud obtenidos:', solicitud); // Muestra toda la respuesta
  
      if (solicitud && solicitud.data && solicitud.data.estado) {
        console.log('Estado de la solicitud:', solicitud.data.estado);
        return solicitud.data.estado;
      } else {
        console.log('La solicitud no tiene un estado válido o no se ha encontrado.');
        return null;
      }
    } catch (error) {
      console.log('Error al obtener el estado para solicitud con ID:', solicitudId);
      console.error('Error al obtener el estado de la solicitud:', error);
      return null;
    }
  };
  

  useEffect(() => {
    const fetchAsignaciones = async () => {
      setCargando(true);
      try {
        if (!tecnicoId) {
          console.warn('ID de técnico no encontrado en el usuario');
          return;
        }
        
        // Obtener todas las asignaciones y verificar el estado actualizado
        const response = await GestionTecnicoService.obtenerAsignacionesPorTecnico(tecnicoId);
        const asignacionesEnProceso = await Promise.all(
          response.map(async (asignacion) => {
            const estadoActualizado = await fetchEstadoSolicitud(asignacion.solicitudId);
            return { ...asignacion, estado: estadoActualizado };
          })
        );
  
        // Filtrar las asignaciones que están "En proceso"
        const asignacionesFiltradas = asignacionesEnProceso.filter(
          (asignacion) => asignacion.estado === 'En proceso'
        );
  
        setAsignaciones(asignacionesFiltradas);
      } catch (error) {
        console.error('Error al obtener las asignaciones:', error);
      } finally {
        setCargando(false);
      }
    };
  
    if (tecnicoId) {
      fetchAsignaciones();
    }
  }, [tecnicoId]);

  const handleEvidenciaChange = (e, solicitudId) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecciona un archivo de tipo imagen (JPEG/PNG).');
        return;
      }
      setEvidencias((prev) => ({ ...prev, [solicitudId]: file }));
    }
  };

  const handleComentariosChange = (e, solicitudId) => {
    const comentario = e.target.value;
    setComentarios((prev) => ({ ...prev, [solicitudId]: comentario }));
  };

  const handleEnviarEvidencia = async (asignacionId) => {
    const selectedEvidencia = evidencias[asignacionId];
    const comentario = comentarios[asignacionId];

    if (!selectedEvidencia) {
      alert('Por favor, carga una evidencia antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', selectedEvidencia);
    formData.append('comentarios', comentario);

    try {
      // Cargar la evidencia
      await GestionTecnicoService.cargarEvidencia(asignacionId, formData);

      // Obtener el `solicitudId` de la asignación
      const asignacion = asignaciones.find((a) => a._id === asignacionId);
      if (!asignacion || !asignacion.solicitudId) {
        throw new Error('Solicitud no encontrada en la asignación');
      }

      // Actualizar el estado en el backend
      await SolicitudService.actualizarSolicitud(asignacion.solicitudId, { estado: 'Solucionado' });

      // Actualizar el estado en el frontend
      const nuevoEstado = await fetchEstadoSolicitud(asignacion.solicitudId);
      setAsignaciones((prevAsignaciones) =>
        prevAsignaciones.map((a) =>
          a._id === asignacionId ? { ...a, estado: nuevoEstado } : a
        )
      );

      alert('Evidencia cargada y solicitud actualizada correctamente');
    } catch (error) {
      alert('Error al cargar la evidencia o actualizar el estado de la solicitud. Intenta de nuevo más tarde.');
      console.error('Error al cargar evidencia:', error);
    }
  };

  if (cargando) return <div>Cargando...</div>;

  return (
    <div className="gestion-tecnico">
      <h1>Gestión de Técnicos</h1>
      {asignaciones.length === 0 ? (
        <p>No tienes asignaciones en proceso.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Solicitud ID</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones.map((asignacion) => (
              <tr key={asignacion._id}>
                <td>{asignacion._id}</td>
                <td>{asignacion.solicitudId}</td>
                <td>{asignacion.descripcion}</td>
                <td>{asignacion.estado}</td>
                <td>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => handleEvidenciaChange(e, asignacion._id)}
                  />
                  <textarea
                    value={comentarios[asignacion._id] || ''}
                    onChange={(e) => handleComentariosChange(e, asignacion._id)}
                    placeholder="Agregar comentario"
                  />
                  <button onClick={() => handleEnviarEvidencia(asignacion._id)}>
                    Enviar Evidencia
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GestionTecnico;
