import React, { useState, useEffect } from 'react';
import SolicitudService from '../../service/GestionSolicitud.service';
import GestionMantenimientoService from '../../service/GestionMantenimiento.service';
import authService from '../../service/auth.service';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [solicitudes, tecnicos] = await Promise.all([
          SolicitudService.obtenerSolicitudes(),
          authService.getTechnicians('tecnico'),
        ]);

        console.log('Solicitudes obtenidas:', solicitudes.data);
        console.log('Técnicos obtenidos:', tecnicos.data);

        if (Array.isArray(solicitudes.data)) {
          const filteredHistorial = solicitudes.data.filter((solicitud) =>
            ['Rechazada', 'Solucionado', 'En proceso', 'Revisado'].includes(solicitud.estado)
          );
          setHistorial(filteredHistorial);
        } else {
          throw new Error('Los datos de solicitudes no son un array');
        }

        setTecnicos(tecnicos.data);
      } catch (error) {
        setError('No se pudieron obtener los datos. Intenta de nuevo más tarde.');
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAsignarTecnico = async (solicitudId) => {
    if (!tecnicoAsignado) {
      alert('Por favor, selecciona un técnico.');
      return;
    }

    try {
      await authService.assignTechnician(solicitudId, tecnicoAsignado);
      await SolicitudService.actualizarSolicitud(solicitudId, { estado: 'En proceso' });

      alert('Técnico asignado correctamente y solicitud en proceso');
      setHistorial((prevHistorial) =>
        prevHistorial.map((solicitud) =>
          solicitud._id === solicitudId
            ? { ...solicitud, tecnico: tecnicoAsignado, estado: 'En proceso' }
            : solicitud
        )
      );
      setTecnicoAsignado('');
    } catch (error) {
      alert('Error al asignar técnico o actualizar estado. Inténtalo de nuevo más tarde.');
      console.error('Error al asignar técnico:', error);
    }
  };

  const handleCrearMantenimiento = async () => {
    if (!descripcion || !gastos || !diasDuracion || !comentarios || !tecnicoAsignado) {
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
    if (!gastos || !diasDuracion || !comentarios) {
      alert('Por favor, completa todos los campos para actualizar.');
      return;
    }

    try {
      await SolicitudService.actualizarSolicitud(solicitudId, { gastos, diasDuracion, comentarios });
      alert('Solicitud actualizada correctamente');

      setHistorial((prevHistorial) =>
        prevHistorial.map((solicitud) =>
          solicitud._id === solicitudId ? { ...solicitud, gastos, diasDuracion, comentarios } : solicitud
        )
      );
      resetForm();
      setSelectedSolicitudId(null);
    } catch (error) {
      alert('Error al actualizar la solicitud. Inténtalo de nuevo más tarde.');
      console.error('Error al actualizar la solicitud:', error);
    }
  };

  const handleSelectSolicitud = (solicitud) => {
    setSelectedSolicitudId(solicitud._id);
    setGastos(solicitud.gastos || '');
    setDiasDuracion(solicitud.diasDuracion || '');
    setComentarios(solicitud.comentarios || '');
  };

  const resetForm = () => {
    setDescripcion('');
    setGastos('');
    setDiasDuracion('');
    setComentarios('');
    setTecnicoAsignado('');
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  console.log('Historial antes de mapear:', historial);

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
            historial.map((solicitud) => {
              console.log('Solicitud en map:', solicitud);
              return (
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
              );
            })
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
