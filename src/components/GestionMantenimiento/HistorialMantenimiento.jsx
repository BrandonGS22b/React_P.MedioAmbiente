import React, { useState, useEffect, useCallback } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import GestionMantenimientoService from '../../service/GestionMantenimiento.service';
import authService from '../../service/auth.service';
import '../../App.css';

function HistorialMantenimiento() {
  const [historial, setHistorial] = useState([]);
  const [formData, setFormData] = useState({
    descripcion: '',
    gastos: '',
    diasDuracion: '',
    comentarios: '',
    tecnicoAsignado: '',
  });
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [solicitudesResponse, tecnicosResponse] = await Promise.all([
        SolicitudService.obtenerSolicitudes(),
        authService.getTechnicians(),
      ]);

      // Verificación para solicitudes
      if (Array.isArray(solicitudesResponse.data)) {
        const filteredHistorial = solicitudesResponse.data.filter((solicitud) =>
          ['Rechazada', 'Solucionado', 'En proceso', 'Revisado'].includes(solicitud.estado)
        );
        setHistorial(filteredHistorial);
      } else {
        throw new Error('Los datos de solicitudes no son un array');
      }

      // Verificación para técnicos
      if (Array.isArray(tecnicosResponse)) { // Cambia aquí si el array está dentro de un objeto
        setTecnicos(tecnicosResponse);
      } else {
        throw new Error('Los datos de técnicos no son un array');
      }
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
      comentarios: '',
      tecnicoAsignado: '',
    });
    setSelectedSolicitudId(null);
  };

  const handleSelectSolicitud = (solicitud) => {
    setSelectedSolicitudId(solicitud._id);
    setFormData({
      ...formData,
      gastos: solicitud.gastos || '',
      diasDuracion: solicitud.diasDuracion || '',
      comentarios: solicitud.comentarios || '',
      tecnicoAsignado: solicitud.tecnico || '', // Cargar técnico asignado en el formulario
    });
  };

  const handleCrearMantenimiento = async () => {
    const { descripcion, gastos, diasDuracion, comentarios, tecnicoAsignado } = formData;

    if (!gastos || !diasDuracion || !comentarios || !tecnicoAsignado) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const mantenimientoData = { descripcion, gastos, diasDuracion, comentarios, tecnicoAsignado };

    try {
      await GestionMantenimientoService.crearMantenimiento(mantenimientoData);
      alert('Mantenimiento creado correctamente');
      resetForm();
    } catch (error) {
      alert('Error al crear el mantenimiento. Inténtalo de nuevo más tarde.');
      console.error('Error al crear el mantenimiento:', error);
    }
  };

  const handleActualizarSolicitud = async (solicitudId) => {
    const { gastos, diasDuracion, comentarios, tecnicoAsignado } = formData;

    if (!gastos || !diasDuracion || !comentarios || !tecnicoAsignado) {
      alert('Por favor, completa todos los campos para actualizar.');
      return;
    }

    try {
      await SolicitudService.actualizarSolicitud(solicitudId, { gastos, diasDuracion, comentarios, tecnico: tecnicoAsignado });
      alert('Solicitud actualizada correctamente');

      setHistorial((prevHistorial) =>
        prevHistorial.map((solicitud) =>
          solicitud._id === solicitudId ? { ...solicitud, gastos, diasDuracion, comentarios, tecnico: tecnicoAsignado } : solicitud
        )
      );
      resetForm();
    } catch (error) {
      alert('Error al actualizar la solicitud. Inténtalo de nuevo más tarde.');
      console.error('Error al actualizar la solicitud:', error);
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
            <th>Comentarios</th>
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
                <td>{solicitud.tecnico || 'No asignado'}</td>
                <td>{solicitud.gastos}</td>
                <td>{solicitud.diasDuracion}</td>
                <td>{solicitud.comentarios}</td>
                <td>
                  <button onClick={() => handleSelectSolicitud(solicitud)}>Editar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No hay historial disponible</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>{selectedSolicitudId ? 'Actualizar Solicitud' : 'Crear Mantenimiento'}</h2>
      <input
        type="text"
        value={formData.descripcion}
        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
        placeholder="Descripción"
      />
      <input
        type="text"
        value={formData.gastos}
        onChange={(e) => setFormData({ ...formData, gastos: e.target.value })}
        placeholder="Gastos"
      />
      <input
        type="number"
        value={formData.diasDuracion}
        onChange={(e) => setFormData({ ...formData, diasDuracion: e.target.value })}
        placeholder="Días de Duración"
      />
      <input
        type="text"
        value={formData.comentarios}
        onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
        placeholder="Comentarios"
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
      {selectedSolicitudId ? (
        <button onClick={() => handleActualizarSolicitud(selectedSolicitudId)}>Actualizar Solicitud</button>
      ) : (
        <button onClick={handleCrearMantenimiento}>Agregar Mantenimiento</button>
      )}
    </div>
  );
}

export default HistorialMantenimiento;
