import React, { useState, useEffect, useCallback } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
import authService from '../../service/auth.service';
import '../../App.css';

function HistorialMantenimiento() {
  const [historial, setHistorial] = useState([]);
  const [formData, setFormData] = useState({
    descripcion: '',
    gastos: '',
    diasDuracion: '',
    tecnicoAsignado: '',
  });
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reseteamos el error en cada carga
    console.log('Fetching data...'); // Log de inicio de la carga de datos
    try {
      const [solicitudesResponse, tecnicosResponse] = await Promise.all([
        SolicitudService.obtenerSolicitudes(),
        authService.getTechnicians(),
      ]);

      console.log('Solicitudes Response:', solicitudesResponse); // Log de respuesta de solicitudes
      console.log('Técnicos Response:', tecnicosResponse); // Log de respuesta de técnicos

      const asignacionResponse = await GestionTecnicoService.obtenerTodasAsignaciones();

      console.log('Asignaciones Response:', asignacionResponse); // Log de respuesta de asignaciones

      if (!Array.isArray(solicitudesResponse.data) || !Array.isArray(asignacionResponse)) {
        throw new Error('Los datos de solicitudes o mantenimientos no son válidos');
      }

      const formattedHistorial = solicitudesResponse.data
        .filter((solicitud) => solicitud.estado === 'Revisado')
        .map((solicitud) => {
          const mantenimiento = asignacionResponse.find(mant => mant.solicitudId === solicitud._id) || {};
          return {
            ...solicitud,
            gastos: mantenimiento.gastos || 'N/A',
            diasDuracion: mantenimiento.diasDuracion || 'N/A',
            tecnico: tecnicosResponse.find(tecnico => tecnico._id === mantenimiento.tecnicoId)?.name || 'No asignado',
          };
        });

      console.log('Historial Formateado:', formattedHistorial); // Log del historial formateado

      setHistorial(formattedHistorial);
      setTecnicos(tecnicosResponse);
    } catch (error) {
      setError('No se pudieron obtener los datos. Intenta de nuevo más tarde.');
      console.error('Error al obtener datos:', error);
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
    });
    setSelectedSolicitudId(null);
    console.log('Formulario reiniciado'); // Log al reiniciar el formulario
  };

  const handleSelectSolicitud = (solicitud) => {
    console.log('Solicitud seleccionada:', solicitud); // Log de solicitud seleccionada
    setSelectedSolicitudId(solicitud._id);
    setFormData({
      descripcion: solicitud.descripcion || '',
      gastos: solicitud.gastos || '',
      diasDuracion: solicitud.diasDuracion || '',
      tecnicoAsignado: solicitud.tecnico || '',
    });
  };

  const handleAsignarTecnico = async () => {
    if (!selectedSolicitudId || !formData.tecnicoAsignado) {
      alert('Selecciona una solicitud y asigna un técnico.');
      return;
    }

    console.log('Asignando técnico con datos:', formData); // Log de datos de asignación de técnico
    try {
      await GestionTecnicoService.crearAsignacion({
        solicitudId: selectedSolicitudId,
        tecnicoId: formData.tecnicoAsignado,
        descripcion: formData.descripcion,
        gastos: parseInt(formData.gastos, 10),
        diasDuracion: parseInt(formData.diasDuracion, 10),
      });

      await SolicitudService.actualizarSolicitud(selectedSolicitudId, { estado: 'En proceso' });

      alert('Asignación de técnico creada y estado de la solicitud actualizado correctamente');
      resetForm();
      fetchData();
    } catch (error) {
      alert('Error al asignar técnico o actualizar el estado de la solicitud. Inténtalo de nuevo más tarde.');
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="historial-mantenimiento">
      <h1>Historial de Mantenimiento</h1>

      <table className="historial-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Técnico Asignado</th>
            <th>Gastos</th>
            <th>Días de Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {historial.length > 0 ? (
            historial.map((solicitud) => (
              <tr key={solicitud._id}>
                <td>{solicitud._id}</td>
                <td>{solicitud.descripcion}</td>
                <td>{solicitud.estado}</td>
                <td>{solicitud.tecnico}</td>
                <td>{solicitud.gastos}</td>
                <td>{solicitud.diasDuracion}</td>
                <td>
                  <button onClick={() => handleSelectSolicitud(solicitud)}>Editar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay historial disponible</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Asignar Técnico</h2>
      <input
        type="text"
        value={formData.descripcion}
        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
        placeholder="Descripción"
        required
      />
      <input
        type="text"
        value={formData.gastos}
        onChange={(e) => setFormData({ ...formData, gastos: e.target.value })}
        placeholder="Gastos"
        required
      />
      <input
        type="number"
        value={formData.diasDuracion}
        onChange={(e) => setFormData({ ...formData, diasDuracion: e.target.value })}
        placeholder="Días de Duración"
        required
      />
      <select
        value={formData.tecnicoAsignado}
        onChange={(e) => setFormData({ ...formData, tecnicoAsignado: e.target.value })}
      >
        <option value="">Seleccionar Técnico</option>
        {tecnicos.map((tecnico) => (
          <option key={tecnico._id} value={tecnico._id}>
            {tecnico.name}
          </option>
        ))}
      </select>
      <button onClick={handleAsignarTecnico}>Asignar Técnico</button>
    </div>
  );
}

export default HistorialMantenimiento;
