import React, { useState, useEffect } from 'react';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
import SolicitudService from '../../service/GestionSolicitud.service';
import useAuth from '../../context/useAuth';

function GestionTecnico() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [cargando, setCargando] = useState(true);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);

  const { user } = useAuth();
  const tecnicoId = user && user._id ? user._id : null;

  useEffect(() => {
    const fetchAsignaciones = async () => {
      setCargando(true);
      try {
        if (!tecnicoId) {
          console.warn('ID de técnico no encontrado en el usuario');
          return;
        }
        // Filtrar asignaciones que no estén en estado "Solucionado"
        const response = await GestionTecnicoService.obtenerAsignacionesPorTecnico(tecnicoId);
        const asignacionesEnProceso = response.filter((asignacion) => asignacion.estado !== 'Solucionado');
        setAsignaciones(asignacionesEnProceso);
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
  
      // Ahora obtenemos el "solicitudId" de la asignación
      const asignacion = asignaciones.find((asignacion) => asignacion._id === asignacionId);
  
      if (!asignacion || !asignacion.solicitudId) {
        throw new Error('Solicitud no encontrada en la asignación');
      }
  
      console.log('Actualizando solicitud con ID:', asignacion.solicitudId);
  
      // Actualizamos la solicitud utilizando el solicitudId de la asignación
      await SolicitudService.actualizarSolicitud(asignacion.solicitudId, { estado: 'Solucionado' });
  
      alert('Evidencia cargada y solicitud actualizada correctamente');
  
      // Actualizamos el estado de la asignación en el frontend para reflejar el cambio
      setAsignaciones((prevAsignaciones) =>
        prevAsignaciones.map((asignacion) =>
          asignacion._id === asignacionId ? { ...asignacion, estado: 'Solucionado' } : asignacion
        )
      );
  
      // Filtramos la asignación que ya fue solucionada
      setAsignaciones((prevAsignaciones) =>
        prevAsignaciones.filter((asignacion) => asignacion._id !== asignacionId)
      );
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
              <th>Descripción</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones.map((asignacion) => (
              <tr key={asignacion._id}>
                <td>{asignacion._id}</td>
                <td>{asignacion.descripcion}</td>
                <td>{asignacion.estado || 'En proceso'}</td>
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
