import axios from 'axios';

const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/GestionTecnico';

const GestionTecnicoService = {
  crearAsignacion: async (asignacionData, imagenFile) => {
    try {
      const formData = new FormData();
      for (const key in asignacionData) {
        formData.append(key, asignacionData[key]);
      }
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      const response = await axios.post(`${API_URL}/asignaciones`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear asignación:', error);
      throw error;
    }
  },

  obtenerAsignacionesPorTecnico: async (tecnicoId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No hay token de autenticación disponible");
      }

      const response = await axios.get(`${API_URL}/asignaciones/tecnico/${tecnicoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error al obtener asignaciones para el técnico con ID ${tecnicoId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  obtenerTodasAsignaciones: async () => {
    try {
      const response = await axios.get(`${API_URL}/asignaciones`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener todas las asignaciones:', error);
      throw error;
    }
  },

  //para actualizar las asignaciones
  cargarEvidencia: async (solicitudId, formData) => {
    try {
      const response = await axios.patch(`${API_URL}/asignaciones/${solicitudId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al cargar evidencia para la solicitud ${solicitudId}:`, error);
      throw error;
    }
  },

  eliminarAsignacion: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/asignaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la asignación con ID ${id}:`, error);
      throw error;
    }
  }
  
};

export default GestionTecnicoService;
