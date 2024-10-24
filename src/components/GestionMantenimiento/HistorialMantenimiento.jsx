import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service'; // Servicio para gestionar solicitudes
import GestionMantenimientoService from '../../service/GestionMantenimiento.service'; // Servicio para gestionar mantenimientos
import authService from '../../service/auth.service'; // Servicio para autenticación (obtención de técnicos)
import '../../App.css';

function HistorialMantenimiento() {
  const [historial, setHistorial] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [gastos, setGastos] = useState('');
  const [diasDuracion, setDiasDuracion] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoAsignado, setTecnicoAsignado] = useState('');

  // Cargar historial de mantenimientos y técnicos
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await SolicitudService.obtenerSolicitudes();
        console.log('Respuesta del API:', response.data); // Verifica qué datos estás recibiendo
        if (response.data && Array.isArray(response.data)) {
          const filteredHistorial = response.data.filter((solicitud) =>
            ['Rechazada', 'Solucionado', 'En proceso', 'Revisado'].includes(solicitud.estado)
          );
          console.log('Historial filtrado:', filteredHistorial); // Verifica el historial filtrado
          setHistorial(filteredHistorial);
        } else {
          console.error('Los datos no son un array o están indefinidos');
        }
      } catch (error) {
        console.error('Error al obtener el historial:', error);
        alert('No se pudieron obtener los datos del historial. Intenta de nuevo más tarde.');
      }
    };

    const fetchTecnicos = async () => {
      try {
        const response = await authService.getTechnicians('tecnico');
        console.log('Técnicos recibidos:', response.data); // Verifica los técnicos recibidos
        setTecnicos(response.data);
      } catch (error) {
        console.error('Error al obtener técnicos:', error);
        alert('No se pudieron obtener los técnicos. Intenta de nuevo más tarde.');
      }
    };

    fetchHistorial();
    fetchTecnicos();
  }, []);

  // Manejar la asignación de un técnico a una solicitud y cambiar el estado a "En proceso"
  const handleAsignarTecnico = async (solicitudId) => {
    if (!tecnicoAsignado) {
      alert('Por favor, selecciona un técnico.');
      return;
    }

    try {
      // Asignar técnico a la solicitud
      await authService.assignTechnician(solicitudId, tecnicoAsignado);

      // Actualizar el estado de la solicitud a "En proceso"
      await SolicitudService.actualizarSolicitud(solicitudId, { estado: 'En proceso' });

      alert('Técnico asignado correctamente y solicitud en proceso');

      // Actualiza el historial localmente
      const updatedHistorial = historial.map((solicitud) =>
        solicitud._id === solicitudId ? { ...solicitud, tecnico: tecnicoAsignado, estado: 'En proceso' } : solicitud
      );
      setHistorial(updatedHistorial);
      setTecnicoAsignado(''); // Resetea el técnico asignado
    } catch (error) {
      console.error('Error al asignar técnico o actualizar estado:', error);
      alert('Error al asignar técnico o actualizar estado. Inténtalo de nuevo más tarde.');
    }
  };

  // Manejar la creación de un mantenimiento
  const handleCrearMantenimiento = async () => {
    if (!descripcion || !gastos || !diasDuracion || !comentarios || !tecnicoAsignado) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const mantenimientoData = {
      descripcion,
      gastos,
      diasDuracion,
      comentarios,
      tecnicoAsignado,
    };

    try {
      await GestionMantenimientoService.crearMantenimiento(mantenimientoData);
      alert('Mantenimiento creado correctamente');
      // Resetea los campos
      setDescripcion('');
      setGastos('');
      setDiasDuracion('');
      setComentarios('');
      setTecnicoAsignado('');
    } catch (error) {
      console.error('Error al crear el mantenimiento:', error);
      alert('Error al crear el mantenimiento. Inténtalo de nuevo más tarde.');
    }
  };

  // Manejar la actualización de una solicitud
  const handleActualizarSolicitud = async (solicitudId) => {
    if (!gastos || !diasDuracion || !comentarios) {
      alert('Por favor, completa todos los campos para actualizar.');
      return;
    }

    try {
      await SolicitudService.actualizarSolicitud(solicitudId, { gastos, diasDuracion, comentarios });
      alert('Solicitud actualizada correctamente');

      const updatedHistorial = historial.map((solicitud) =>
        solicitud._id === solicitudId ? { ...solicitud, gastos, diasDuracion, comentarios } : solicitud
      );
      setHistorial(updatedHistorial);
      setGastos('');
      setDiasDuracion('');
      setComentarios('');
      setSelectedSolicitudId(null);
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
      alert('Error al actualizar la solicitud. Inténtalo de nuevo más tarde.');
    }
  };

  const handleSelectSolicitud = (solicitud) => {
    setSelectedSolicitudId(solicitud._id);
    setGastos(solicitud.gastos || '');
    setDiasDuracion(solicitud.diasDuracion || '');
    setComentarios(solicitud.comentarios || '');
  };

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
          {historial && historial.length > 0 ? (
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
                  <select
                    value={tecnicoAsignado}
                    onChange={(e) => setTecnicoAsignado(e.target.value)}
                  >
                    <option value="">Seleccionar Técnico</option>
                    {tecnicos.map((tecnico) => (
                      <option key={tecnico._id} value={tecnico._id}>
                        {tecnico.name}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleAsignarTecnico(solicitud._id)}>
                    Asignar Técnico
                  </button>
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

      <h2>Crear Mantenimiento</h2>
      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
      />
      <input
        type="text"
        value={gastos}
        onChange={(e) => setGastos(e.target.value)}
        placeholder="Gastos"
      />
      <input
        type="number"
        value={diasDuracion}
        onChange={(e) => setDiasDuracion(e.target.value)}
        placeholder="Días de Duración"
      />
      <input
        type="text"
        value={comentarios}
        onChange={(e) => setComentarios(e.target.value)}
        placeholder="Comentarios"
      />
      <button onClick={handleCrearMantenimiento}>Agregar Mantenimiento</button>

      {selectedSolicitudId && (
        <div>
          <h2>Actualizar Solicitud</h2>
          <input
            type="text"
            value={gastos}
            onChange={(e) => setGastos(e.target.value)}
            placeholder="Gastos"
          />
          <input
            type="number"
            value={diasDuracion}
            onChange={(e) => setDiasDuracion(e.target.value)}
            placeholder="Días de Duración"
          />
          <input
            type="text"
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            placeholder="Comentarios"
          />
          <button onClick={() => handleActualizarSolicitud(selectedSolicitudId)}>
            Actualizar Solicitud
          </button>
        </div>
      )}
    </div>
  );
}

export default HistorialMantenimiento;
