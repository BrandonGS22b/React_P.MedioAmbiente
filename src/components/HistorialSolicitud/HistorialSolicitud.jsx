import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import SolicitudService from "../../service/GestionSolicitud.service";
import authService from "../../service/auth.service";
import GestionTecnicoService from "../../service/GestionTecnicos.service";
import "./../../styles/historialSolicitudes.css";

function HistorialSolicitud() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorialSolicitudes = async () => {
      try {
        const [solicitudesResponse, tecnicosResponse, asignacionesResponse] = await Promise.all([
          SolicitudService.obtenerSolicitudes(),
          authService.getTechnicians(),
          GestionTecnicoService.obtenerTodasAsignaciones(),
        ]);

        const tecnicosMap = tecnicosResponse.reduce((map, tecnico) => {
          map[tecnico._id] = tecnico;
          return map;
        }, {});

        const solicitudesConDetalles = asignacionesResponse
          .map((asignacion) => {
            const solicitud = solicitudesResponse.data.find((sol) => sol._id === asignacion.solicitudId);
            const tecnico = tecnicosMap[asignacion.tecnicoId];

            if (!solicitud || solicitud.estado !== "Solucionado") return null;

            return {
              id: solicitud._id,
              descripcion: asignacion.descripcion,
              tecnicoAsignado: tecnico?.name || "No asignado",
              estado: solicitud.estado,
              imagenCliente: solicitud.imagen || "URL_IMAGEN_POR_DEFECTO",
              imagenTecnico: asignacion.imagen || "URL_IMAGEN_POR_DEFECTO",
              fechaCreacion: solicitud.fecha_creacion, 
              ultimaActualizacion: solicitud.updatedAt, 
              tecnico: tecnico,
            };
          })
          .filter(Boolean);

        setSolicitudes(solicitudesConDetalles);
        setFilteredSolicitudes(solicitudesConDetalles);
        setLoading(false);
      } catch (error) {
        setError("Error al obtener el historial de solicitudes");
        setLoading(false);
      }
    };

    fetchHistorialSolicitudes();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = solicitudes.filter(
      (solicitud) =>
        solicitud.descripcion.toLowerCase().includes(query) ||
        solicitud.tecnicoAsignado.toLowerCase().includes(query) ||
        solicitud.id.toLowerCase().includes(query)
    );
    setFilteredSolicitudes(filtered);
  };

  const handleVerTecnico = (tecnico) => {
    Swal.fire({
      title: "Detalles del Técnico",
      html: `<p><strong>Nombre:</strong> ${tecnico.name}</p>
             <p><strong>Email:</strong> ${tecnico.email}</p>`,
      icon: "info",
      confirmButtonText: "Cerrar",
    });
  };

  const handleVerSolicitud = (solicitud) => {
    Swal.fire({
      title: "Detalles de la Solicitud",
      html: `<p><strong>Descripción:</strong> ${solicitud.descripcion}</p>
             <p><strong>Estado:</strong> ${solicitud.estado}</p>`,
      icon: "info",
      confirmButtonText: "Cerrar",
    });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="historial-solicitud">
      <h1>Historial de Solicitudes</h1>
      <p>Aquí podrás ver solo las órdenes en estado solucionado.</p>
      <input
        type="text"
        placeholder="Buscar por descripción, técnico o ID"
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      {filteredSolicitudes.length === 0 ? (
        <p>No hay solicitudes que coincidan con la búsqueda.</p>
      ) : (
        <table className="historial-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Técnico Asignado</th>
              <th>Estado</th>
              <th>Fecha de Creación</th>
              <th>Última Actualización</th>
              <th>Foto del Cliente</th>
              <th>Foto del Técnico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSolicitudes.map((solicitud) => (
              <tr key={solicitud.id}>
                <td>{solicitud.id}</td>
                <td>{solicitud.descripcion}</td>
                <td>{solicitud.tecnicoAsignado}</td>
                <td>{solicitud.estado}</td>
                <td>{new Date(solicitud.fechaCreacion).toLocaleDateString()}</td>
                <td>{new Date(solicitud.ultimaActualizacion).toLocaleDateString()}</td>
                <td>
                  <img
                    src={solicitud.imagenCliente}
                    alt="Foto del Cliente"
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td>
                  <img
                    src={solicitud.imagenTecnico}
                    alt="Foto del Técnico"
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td>
                  <button onClick={() => handleVerTecnico(solicitud.tecnico)}>Ver Técnico</button>
                  <button onClick={() => handleVerSolicitud(solicitud)}>Ver Solicitud</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HistorialSolicitud;
