import React, { useState, useEffect } from 'react';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
import useAuth from '../../context/useAuth';

function GestionTecnico() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [cargando, setCargando] = useState(true);

  // Obtener el usuario desde el contexto de autenticación
  const { user } = useAuth();
  const tecnicoId = user && user._id ? user._id : null;

  useEffect(() => {
    if (user) {
      console.log('Usuario completo:', user);
      console.log('Rol del usuario:', user.role);
      console.log('ID del técnico:', tecnicoId);
    } else {
      console.log('Usuario no encontrado en el contexto de autenticación');
    }
  }, [user, tecnicoId]);

  useEffect(() => {
    const fetchAsignaciones = async () => {
      setCargando(true);
  
      try {
        if (!tecnicoId) {
          console.warn('ID de técnico no encontrado en el usuario');
          return;
        }
  
        // Obtener las asignaciones del técnico específico
        const response = await GestionTecnicoService.obtenerAsignacionesPorTecnico(tecnicoId);
        console.log("Respuesta del backend (Asignaciones por Técnico):", response);
  
        // Guardar las asignaciones en el estado
        setAsignaciones(response);
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
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecciona un archivo de tipo imagen (JPEG/PNG) o PDF.');
        return;
      }
      setEvidencias((prev) => ({ ...prev, [solicitudId]: file }));
    }
  };

  const handleComentariosChange = (e, solicitudId) => {
    const comentario = e.target.value;
    setComentarios((prev) => ({ ...prev, [solicitudId]: comentario }));
  };

  const handleEnviarEvidencia = async (solicitudId) => {
    const selectedEvidencia = evidencias[solicitudId];
    const comentario = comentarios[solicitudId];

    if (!selectedEvidencia) {
      alert('Por favor, carga una evidencia antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('evidencia', selectedEvidencia);
    formData.append('comentarios', comentario);
    formData.append('status', 'Solucionado'); // Actualizando status a "Solucionado"

    try {
      await GestionTecnicoService.cargarEvidencia(solicitudId, formData);

      // Actualizar el status de la solicitud a "Solucionado"
      alert('Evidencia cargada y solicitud actualizada correctamente');
      
      // Refrescar las asignaciones para reflejar el cambio
      setAsignaciones((prevAsignaciones) =>
        prevAsignaciones.map((asignacion) =>
          asignacion._id === solicitudId ? { ...asignacion, status: 'Solucionado' } : asignacion
        )
      );
    } catch (error) {
      alert('Error al cargar la evidencia o actualizar el status de la solicitud. Intenta de nuevo más tarde.');
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
