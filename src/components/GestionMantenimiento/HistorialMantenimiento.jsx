import React, { useState, useEffect, useCallback } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import GestionMantenimientoService from '../../service/GestionMantenimiento.service';
import GestionTecnicoService from '../../service/GestionTecnicos.service';
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

      console.log("Llamando a obtenerMantenimientos...");
      const mantenimientoResponse = await GestionMantenimientoService.obtenerMantenimientos();
      console.log("Respuesta de obtenerMantenimientos:", mantenimientoResponse);

      if (Array.isArray(solicitudesResponse.data) && Array.isArray(mantenimientoResponse)) {
        const formattedHistorial = solicitudesResponse.data
          .filter((solicitud) =>
            ['Rechazada', 'Solucionado', 'En proceso', 'Revisado'].includes(solicitud.estado)
          )
          .map((solicitud) => {
            const mantenimiento = mantenimientoResponse.find(
              (mant) => mant.solicitudId === solicitud._id
            ) || {};

            return {
              ...solicitud,
              gastos: mantenimiento.gastos || 'N/A',
              diasDuracion: mantenimiento.diasDuracion || 'N/A',
              comentarios: mantenimiento.comentarios || 'N/A',
              tecnico: tecnicosResponse.find((tecnico) => tecnico._id === mantenimiento.idTecnico)?.name || 'No asignado',
            };
          });

        setHistorial(formattedHistorial);
      } else {
        throw new Error('Los datos de solicitudes o mantenimientos no son un array');
      }

      if (Array.isArray(tecnicosResponse)) {
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
      tecnicoAsignado: solicitud.tecnico || '',
    });
  };

  const handleCrearMantenimiento = async () => {
    const { descripcion, gastos, diasDuracion, comentarios, tecnicoAsignado } = formData;
  
    if (!descripcion || !gastos || !diasDuracion || !comentarios || !tecnicoAsignado || !selectedSolicitudId) {
      alert('Por favor, completa todos los campos y selecciona una solicitud.');
      return;
    }
  
    const mantenimientoData = {
      descripcion,
      gastos: parseInt(gastos), // convertir a número si es necesario
      diasDuracion: parseInt(diasDuracion), // convertir a número si es necesario
      comentarios,
      idTecnico: tecnicoAsignado,
      solicitudId: selectedSolicitudId,
    };
  
    try {
      await GestionMantenimientoService.crearMantenimiento(mantenimientoData);
      alert('Mantenimiento creado correctamente');
      resetForm();
      fetchData(); // Recargar los datos para ver el nuevo mantenimiento
    } catch (error) {
      alert('Error al crear el mantenimiento. Inténtalo de nuevo más tarde.');
      console.error('Error al crear el mantenimiento:', error);
    }
  };

  const handleAsignarTecnico = async () => {
    if (!selectedSolicitudId || !formData.tecnicoAsignado) {
      alert('Selecciona una solicitud y asigna un técnico.');
      return;
    }

    try {
      await GestionTecnicoService.crearAsignacion({
        solicitudId: selectedSolicitudId,
        tecnicoId: formData.tecnicoAsignado,
        descripcion: formData.descripcion,
        estado: 'Asignado',
        gastos: formData.gastos,
        diasDuracion: formData.diasDuracion,
        comentarios: formData.comentarios,
      });
      alert('Asignación de técnico creada correctamente');
      resetForm();
      fetchData();
    } catch (error) {
      alert('Error al asignar técnico. Inténtalo de nuevo más tarde.');
      console.error('Error al asignar técnico:', error);
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
                <td>{solicitud.tecnico}</td>
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

      <h2>{selectedSolicitudId ? 'Asignar Técnico' : 'Crear Mantenimiento'}</h2>
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
        <button onClick={handleAsignarTecnico}>Asignar Técnico</button>
      ) : (
        <button onClick={handleCrearMantenimiento}>Agregar Mantenimiento</button>
      )}
    </div>
  );
}

export default HistorialMantenimiento;
