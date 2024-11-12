import React, { useState, useEffect, useCallback } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
import authService from '../../service/auth.service';
import '../../App.css';

function HistorialMantenimiento() {
  const [historial, setHistorial] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [formData, setFormData] = useState({
    descripcion: '',
    gastos: '',
    diasDuracion: '',
    tecnicoAsignado: '',
    estado: '', // Añadimos el estado aquí
  });
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching data...');
    try {
      const [solicitudesResponse, tecnicosResponse, asignacionesResponse] = await Promise.all([
        SolicitudService.obtenerSolicitudes(),
        authService.getTechnicians(),
        GestionTecnicoService.obtenerTodasAsignaciones(),
      ]);
  
      console.log('Solicitudes Response:', solicitudesResponse);
      console.log('Técnicos Response:', tecnicosResponse);
      console.log('Asignaciones Response:', asignacionesResponse);
  
      if (!Array.isArray(asignacionesResponse)) {
        throw new Error('La respuesta de asignaciones no es un array válido');
      }
  
      setAsignaciones(asignacionesResponse);  // Guardamos las asignaciones en el estado
  
      // Aquí continúa el resto de la lógica de formateo
      const formattedHistorial = solicitudesResponse.data
        .filter((solicitud) => ["Revisado", "En proceso", "Solucionado"].includes(solicitud.estado))
        .map((solicitud) => {
          const mantenimiento = asignacionesResponse.find(mant => mant.solicitudId === solicitud._id) || {};
          return {
            ...solicitud,
            gastos: mantenimiento.gastos || 'N/A',
            diasDuracion: mantenimiento.diasDuracion || 'N/A',
            tecnico: tecnicosResponse.find(tecnico => tecnico._id === mantenimiento.tecnicoId)?.name || 'No asignado',
          };
        });
  
      console.log('Historial Formateado:', formattedHistorial);
  
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
      estado: '', // Reseteamos el estado
    });
    setSelectedSolicitudId(null);
    console.log('Formulario reiniciado'); // Log al reiniciar el formulario
  };

  const handleSelectSolicitud = (solicitud, asignaciones) => {
    console.log('Solicitud seleccionada:', solicitud._id);
    console.log('Asignaciones disponibles:', asignaciones);
  
    if (Array.isArray(asignaciones) && asignaciones.length > 0) {
      const asignacion = asignaciones.find((item) => item.solicitudId === solicitud._id);
  
      console.log('Asignación encontrada:', asignacion);
  
      if (asignacion) {
        setSelectedSolicitudId(asignacion._id);
      } else {
        console.error('No se encontró la asignación para la solicitud:', solicitud._id);
        setSelectedSolicitudId(null);
      }
  
      setFormData({
        id: asignacion ? asignacion._id : '',
        descripcion: solicitud.descripcion || '',
        gastos: asignacion ? asignacion.gastos : '',
        diasDuracion: asignacion ? asignacion.diasDuracion : '',
        tecnicoAsignado: asignacion ? asignacion.tecnicoId : '',
        estado: solicitud.estado || '',
      });
    } else {
      console.error('asignaciones no es un array válido o está vacío');
    }
  };
  
  const handleEditSolicitud = async () => {
    if (!selectedSolicitudId) {
      alert('Selecciona una solicitud para editar.');
      return;
    }
  
    try {
      // Actualizamos los datos de la asignación
      await GestionTecnicoService.cargarEvidencia(selectedSolicitudId, {
        tecnicoId: formData.tecnicoAsignado, // Actualizamos el técnico
        descripcion: formData.descripcion, // Actualizamos la descripción
        gastos: parseInt(formData.gastos, 10), // Actualizamos los gastos
        diasDuracion: parseInt(formData.diasDuracion, 10), // Actualizamos los días de duración
      });
  
      // También actualizamos el estado de la solicitud
      await SolicitudService.actualizarSolicitud(selectedSolicitudId, { estado: formData.estado });
  
      alert('Datos de la solicitud actualizados correctamente');
      resetForm(); // Limpiar el formulario
      fetchData(); // Volver a cargar los datos
    } catch (error) {
      alert('Error al actualizar la solicitud. Inténtalo de nuevo más tarde.');
      console.error('Error:', error);
    }
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
          {/* Pasamos asignaciones al hacer clic */}
          <button onClick={() => handleSelectSolicitud(solicitud, asignaciones)}>Asignar</button>
          <button onClick={() => handleSelectSolicitud(solicitud, asignaciones)}>Editar</button>
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

      <h2>Editar Solicitud</h2>
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

      {/* Dropdown para seleccionar el estado */}
      <select
        value={formData.estado}
        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
      >
        <option value="">Seleccionar Estado</option>
        <option value="Revisado">Revisado</option>
        <option value="En proceso">En proceso</option>
        <option value="Solucionado">Solucionado</option>
      </select>

      <button onClick={handleEditSolicitud}>Editar Solicitud</button>
      <button onClick={handleAsignarTecnico}>Asignar Técnico</button>
    </div>
  );
}

export default HistorialMantenimiento;
