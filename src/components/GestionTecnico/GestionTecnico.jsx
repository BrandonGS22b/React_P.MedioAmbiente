import React, { useState, useEffect } from 'react';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
import useAuth from '../../context/useAuth';
import SolicitudService from '../../service/GestionSolicitud.service';

function GestionTecnico() {
  const [solicitudes, setSolicitudes] = useState([]);
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
    const fetchSolicitudes = async () => {
      setCargando(true);
    
      try {
        if (!tecnicoId) {
          console.warn('ID de técnico no encontrado en el usuario');
          return;
        }
    
        const response = await GestionTecnicoService.obtenerAsignacionesPorTecnico(tecnicoId);
        console.log("Respuesta del backend:", response); // Ver la respuesta completa
        const [solicitudesResponse] = await Promise.all([
          SolicitudService.obtenerSolicitudes(),
        ]);
        
        // Mostrar en consola el estado de cada solicitud
        response.forEach((solicitud) => {
          console.log('Solicitud completa:', solicitud); // Ver cada solicitud completa
          console.log('Solicitudes Response:', solicitudesResponse);
          console.log('Solicitudes Response estado:', solicitudesResponse.estado);
          
        });
  
        // Asegurarse de que el campo 'status' o 'estado' existe antes de filtrar
        const solicitudesEnProceso = response.filter((solicitud) =>
          (solicitud.status || solicitud.estado) === 'En proceso' // Usa 'status' o 'estado' según esté disponible
        );
        setSolicitudes(solicitudesEnProceso);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
      } finally {
        setCargando(false);
      }
    };
  
    if (tecnicoId) {
      fetchSolicitudes();
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
      await SolicitudService.actualizarSolicitud(solicitudId, { status: 'Solucionado' });

      alert('Evidencia cargada y solicitud actualizada correctamente');
      
      // Refrescar las solicitudes para reflejar el cambio
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud._id === solicitudId ? { ...solicitud, status: 'Solucionado' } : solicitud
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
      {solicitudes.length === 0 ? (
        <p>No tienes solicitudes en proceso.</p>
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
            {solicitudes.map((solicitud) => (
              <tr key={solicitud._id}>
                <td>{solicitud._id}</td>
                <td>{solicitud.descripcion}</td>
                <td>{solicitud.estado}</td>
                <td>
                  <input
                    type="file"
                    onChange={(e) => handleEvidenciaChange(e, solicitud._id)}
                  />
                  <textarea
                    value={comentarios[solicitud._id] || ''}
                    onChange={(e) => handleComentariosChange(e, solicitud._id)}
                    placeholder="Agregar comentario"
                  />
                  <button onClick={() => handleEnviarEvidencia(solicitud._id)}>
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
