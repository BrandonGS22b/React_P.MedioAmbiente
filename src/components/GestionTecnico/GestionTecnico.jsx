import React, { useState, useEffect } from 'react';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
import useAuth from '../../context/useAuth';

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
        const solicitudesEnProceso = response.filter(
          (solicitud) => solicitud.estado === 'Proceso'
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
    formData.append('estado', 'Solucionado');

    try {
      await GestionTecnicoService.cargarEvidencia(solicitudId, formData);
      alert('Evidencia cargada y solicitud actualizada correctamente');

      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.filter((solicitud) => solicitud._id !== solicitudId)
      );

      setEvidencias((prev) => {
        const newState = { ...prev };
        delete newState[solicitudId];
        return newState;
      });
      setComentarios((prev) => {
        const newState = { ...prev };
        delete newState[solicitudId];
        return newState;
      });
    } catch (error) {
      console.error('Error al enviar la evidencia:', error);
      alert('Error al enviar la evidencia. Inténtalo de nuevo.');
    }
  };

  if (cargando) {
    return <div>Cargando solicitudes...</div>;
  }

  return (
    <div className="gestion-tecnico">
      <h1>Gestión de Solicitudes</h1>
      <p>Aquí podrás ver las solicitudes que se te han asignado y cargar las evidencias correspondientes.</p>

      <table className="solicitudes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solicitud ID</th>
            <th>Técnico ID</th>
            <th>Descripción</th>
            <th>Gastos</th>
            <th>Días de Duración</th>
            <th>Comentarios</th>
            <th>Estado</th>
            <th>Evidencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.length > 0 ? (
            solicitudes.map((solicitud) => (
              <tr key={solicitud._id}>
                <td>{solicitud._id}</td>
                <td>{solicitud.solicitudId}</td>
                <td>{solicitud.tecnicoId}</td>
                <td>{solicitud.descripcion}</td>
                <td>{solicitud.gastos}</td>
                <td>{solicitud.diasDuracion}</td>
                <td>{solicitud.comentarios}</td>
                <td>{solicitud.estado}</td>
                <td>
                  <input
                    type="file"
                    onChange={(e) => handleEvidenciaChange(e, solicitud._id)}
                  />
                </td>
                <td>
                  <button onClick={() => handleEnviarEvidencia(solicitud._id)}>
                    Enviar Evidencia
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No hay solicitudes en proceso</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GestionTecnico;
