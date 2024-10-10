import axios from 'axios';

const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/solicitud';  // Cambia esto por la URL real de tu backend

const SolicitudService = {
  // Obtener todas las solicitudes
  obtenerSolicitudes: () => {
    return axios.get(`${API_URL}/get`);
  },

  // Crear una nueva solicitud
  crearSolicitud: (solicitud) => {
    return axios.post(`${API_URL}/create`, solicitud);
  },

  // Eliminar una solicitud por ID
  eliminarSolicitud: (id) => {
    return axios.delete(`${API_URL}/solicitudes/${id}`);
  },

  // Obtener una solicitud por ID (si necesitas esta funcionalidad)
  obtenerSolicitudPorId: (id) => {
    return axios.get(`${API_URL}/solicitudes/${id}`);
  },

  // Actualizar una solicitud (si necesitas esta funcionalidad)
  actualizarSolicitud: (id, updatedData) => {
    return axios.put(`${API_URL}/solicitudes/${id}`, updatedData);
  },
};

export default SolicitudService;
