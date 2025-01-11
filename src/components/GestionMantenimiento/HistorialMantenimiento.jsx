import React, { useState, useEffect, useCallback } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
import authService from '../../service/auth.service';
import Swal from 'sweetalert2';
import './../../styles/gestionMantenimiendo.css';

function HistorialMantenimiento() {
  const [historial, setHistorial] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [selectedAsignacionId, setSelectedAsignacionId] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: '',
    gastos: '',
    diasDuracion: '',
    tecnicoAsignado: '',
    estado: '',
  });
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [solicitudesResponse, tecnicosResponse, asignacionesResponse] = await Promise.all([
        SolicitudService.obtenerSolicitudes(),
        authService.getTechnicians(),
        GestionTecnicoService.obtenerTodasAsignaciones(),
      ]);

      if (!Array.isArray(solicitudesResponse.data) || !Array.isArray(tecnicosResponse) || !Array.isArray(asignacionesResponse)) {
        throw new Error('Error en la estructura de los datos recibidos');
      }

      setAsignaciones(asignacionesResponse);
      setTecnicos(tecnicosResponse);

  const formattedHistorial = solicitudesResponse.data
  .filter((solicitud) => ["Revisado", "En proceso", "Solucionado"].includes(solicitud.estado))
  .map((solicitud) => {
    const mantenimiento = asignacionesResponse.find((mant) => mant.solicitudId === solicitud._id);
    const tecnicoAsignado = mantenimiento
      ? tecnicosResponse.find((tecnico) => tecnico._id === mantenimiento.tecnicoId)?.name || 'No asignado'
      : 'No asignado';

    return {
      ...solicitud,
      gastos: mantenimiento ? mantenimiento.gastos : 'N/A',
      diasDuracion: mantenimiento ? mantenimiento.diasDuracion : 'N/A',
      tecnico: tecnicoAsignado,
      fecha_creacion: new Date(solicitud.createdAt).toISOString(), // Garantizamos un formato válido
      updatedAt: new Date(solicitud.updatedAt).toISOString(),
    };
  });

      setHistorial(formattedHistorial);
    } catch (error) {
      setError('No se pudieron obtener los datos. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setFormData({
      descripcion: '',
      gastos: '',
      diasDuracion: '',
      tecnicoAsignado: '',
      estado: '',
    });
    setSelectedSolicitudId(null);
    setSelectedAsignacionId(null);
    setIsEditing(false);
  };

  const handleSelectAsignacion = (asignacionId) => {
    const asignacion = asignaciones.find((item) => item._id === asignacionId);
    if (asignacion) {
      setSelectedAsignacionId(asignacion._id);
      setFormData({
        descripcion: asignacion.descripcion || '',
        gastos: asignacion.gastos || '',
        diasDuracion: asignacion.diasDuracion || '',
        tecnicoAsignado: asignacion.tecnicoId || '',
      });
      setIsEditing(true);
    } else {
      console.error('No se encontró la asignación:', asignacionId);
    }
  };

  const handleEditSolicitud = async () => {
    if (!formData.tecnicoAsignado || formData.tecnicoAsignado === 'No asignado') {
      alert('Selecciona un técnico para asignar a la solicitud.');
      return;
    }
  
    try {
      const nuevoEstado = "En proceso"; // Aquí puedes cambiar el estado como necesites
  
      if (!selectedAsignacionId) {
        const asignacionData = {
          solicitudId: selectedSolicitudId,
          tecnicoId: formData.tecnicoAsignado,
          descripcion: formData.descripcion,
          gastos: parseInt(formData.gastos, 10),
          diasDuracion: parseInt(formData.diasDuracion, 10),
        };
        const imagenFile = null;
        await GestionTecnicoService.crearAsignacion(asignacionData, imagenFile);
      } else {
        await GestionTecnicoService.cargarEvidencia(selectedAsignacionId, {
          tecnicoId: formData.tecnicoAsignado,
          descripcion: formData.descripcion,
          gastos: parseInt(formData.gastos, 10),
          diasDuracion: parseInt(formData.diasDuracion, 10),
        });
      }
  
      await SolicitudService.actualizarSolicitud(selectedSolicitudId, { estado: nuevoEstado });
  
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Solicitud actualizada correctamente.',
      });

      resetForm();
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar la solicitud. Intenta de nuevo más tarde.',
      });
    }
  };

  const handleSelectSolicitud = (solicitud) => {
    const asignacionEncontrada = asignaciones.find((item) => item.solicitudId === solicitud._id);
  
    setSelectedSolicitudId(solicitud._id);
  
    if (asignacionEncontrada) {
      setSelectedAsignacionId(asignacionEncontrada._id);
      setFormData({
        descripcion: asignacionEncontrada.descripcion || '',
        gastos: asignacionEncontrada.gastos || '',
        diasDuracion: asignacionEncontrada.diasDuracion || '',
        tecnicoAsignado: asignacionEncontrada.tecnicoId || '',
        estado: solicitud.estado || '',
      });
      setIsEditing(true);
    } else {
      setSelectedAsignacionId(null);
      setFormData({
        descripcion: solicitud.descripcion || '',
        gastos: '',
        diasDuracion: '',
        tecnicoAsignado: '',
        estado: solicitud.estado || '',
      });
      setIsEditing(true);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const filteredHistorial = historial.filter((solicitud) =>
    solicitud.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.tecnico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="historial-mantenimiento">
      
      <input
        type="text"
        placeholder="Buscar por descripción o técnico..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      {!isEditing ? (
        <>
          
          <table className="historial-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Técnico Asignado</th>
                <th>Gastos</th>
                <th>Días de Duración</th>
                <th>Fecha de Creación</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistorial.length > 0 ? (
                filteredHistorial.map((solicitud) => (
                  <tr key={solicitud._id}>
                    <td>{solicitud._id}</td>
                    <td>{solicitud.descripcion}</td>
                    <td>{solicitud.estado}</td>
                    <td>{solicitud.tecnico || "No asignado"}</td>
                    <td>{solicitud.gastos}</td>
                    <td>{solicitud.diasDuracion}</td>
                    <td>{new Date(solicitud.fecha_creacion).toLocaleString()}</td>
                    <td>{new Date(solicitud.updatedAt).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleSelectSolicitud(solicitud)}>
                        Seleccionar Solicitud
                      </button>
                      {asignaciones.some(
                        (item) => item.solicitudId === solicitud._id
                      ) ? (
                        <button
                          onClick={() =>
                            handleSelectAsignacion(
                              asignaciones.find(
                                (item) => item.solicitudId === solicitud._id
                              )._id
                            )
                          }
                        >
                          Editar Asignación
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSelectSolicitud(solicitud)}
                        >
                          Asignar Técnico
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No hay historial disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h2>Editar Solicitud</h2>
          <form>
            <label>Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            ></textarea>

            <label>Gastos</label>
            <input
              type="number"
              value={formData.gastos}
              onChange={(e) =>
                setFormData({ ...formData, gastos: e.target.value })
              }
            />

            <label>Días de Duración</label>
            <input
              type="number"
              value={formData.diasDuracion}
              onChange={(e) =>
                setFormData({ ...formData, diasDuracion: e.target.value })
              }
            />

            <label>Técnico Asignado</label>
            <select
              value={formData.tecnicoAsignado}
              onChange={(e) =>
                setFormData({ ...formData, tecnicoAsignado: e.target.value })
              }
            >
              <option value="">Seleccionar Técnico</option>
              {tecnicos.map((tecnico) => (
                <option key={tecnico._id} value={tecnico._id}>
                  {tecnico.name}
                </option>
              ))}
            </select>

            <button type="button" onClick={handleEditSolicitud}>
              Guardar Cambios
            </button>
            <button type="button" onClick={resetForm}>
              Cancelar
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default HistorialMantenimiento;
