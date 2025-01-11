import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
import SolicitudService from '../../service/GestionSolicitud.service';
import useAuth from '../../context/useAuth';
import '../../styles/gestiontecnico.css';
function GestionTecnico() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const tecnicoId = user && user._id ? user._id : null;

  const fetchSolicitudes = async () => {
    try {
      const response = await SolicitudService.obtenerSolicitudes();
      return response.data;
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
      setError('Error al cargar las solicitudes.');
      return [];
    }
  };

  useEffect(() => {
    const fetchAsignaciones = async () => {
      setCargando(true);
      try {
        if (!tecnicoId) {
          Swal.fire('Advertencia', 'ID de técnico no encontrado en el usuario', 'warning');
          return;
        }

        const response = await GestionTecnicoService.obtenerAsignacionesPorTecnico(tecnicoId);
        const solicitudes = await fetchSolicitudes();

        const asignacionesConDetalles = response.map((asignacion) => {
          const solicitud = solicitudes.find((sol) => sol._id === asignacion.solicitudId) || {};
          return {
            ...asignacion,
            descripcion: solicitud.descripcion || 'N/A',
            barrio: solicitud.barrio || 'N/A',
            ciudad: solicitud.ciudad || 'N/A',
            departamento: solicitud.departamento || 'N/A',
            estado: solicitud.estado || 'N/A',
            fecha_creacion: solicitud.fecha_creacion || null,
            updatedAt: solicitud.updatedAt || null,
            imagen: solicitud.imagen || null,
          };
        });

        const asignacionesFiltradas = asignacionesConDetalles.filter(
          (asignacion) => asignacion.estado === 'En proceso'
        );

        setAsignaciones(asignacionesFiltradas);
      } catch (error) {
        Swal.fire('Error', 'Error al obtener las asignaciones', 'error');
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
        Swal.fire('Archivo inválido', 'Por favor, selecciona un archivo de tipo imagen (JPEG/PNG).', 'error');
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
      Swal.fire('Advertencia', 'Por favor, carga una evidencia antes de enviar.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', selectedEvidencia);
    formData.append('comentarios', comentario);

    try {
      await GestionTecnicoService.cargarEvidencia(asignacionId, formData);

      const asignacion = asignaciones.find((a) => a._id === asignacionId);
      if (!asignacion || !asignacion.solicitudId) {
        throw new Error('Solicitud no encontrada en la asignación');
      }

      await SolicitudService.actualizarSolicitud(asignacion.solicitudId, { estado: 'Solucionado' });

      const nuevoEstado = 'Solucionado';
      setAsignaciones((prevAsignaciones) =>
        prevAsignaciones.map((a) =>
          a._id === asignacionId ? { ...a, estado: nuevoEstado } : a
        )
      );

      Swal.fire('Éxito', 'Evidencia cargada y solicitud actualizada correctamente.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Error al cargar la evidencia o actualizar el estado de la solicitud.', 'error');
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
              <th>Barrio</th>
              <th>Ciudad</th>
              <th>Departamento</th>
              <th>Estado</th>
              <th>Fecha de Creación</th>
              <th>Última Modificación</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones.map((asignacion) => (
              <tr key={asignacion._id}>
                <td>{asignacion._id}</td>
                <td>{asignacion.solicitudId}</td>
                <td>{asignacion.descripcion}</td>
                <td>{asignacion.barrio}</td>
                <td>{asignacion.ciudad}</td>
                <td>{asignacion.departamento}</td>
                <td>{asignacion.estado}</td>
                <td>{asignacion.fecha_creacion ? new Date(asignacion.fecha_creacion).toLocaleString() : 'N/A'}</td>
                <td>{asignacion.updatedAt ? new Date(asignacion.updatedAt).toLocaleString() : 'N/A'}</td>
                <td>
                  {asignacion.imagen ? (
                    <img src={asignacion.imagen} alt="Evidencia" style={{ width: '50px' }} />
                  ) : (
                    'Sin imagen'
                  )}
                </td>
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
                  <button onClick={() => handleEnviarEvidencia(asignacion._id)}>Enviar Evidencia</button>
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
