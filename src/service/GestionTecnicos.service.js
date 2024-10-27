// service/GestionTecnico.service.js
import axios from 'axios';

const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/GestionTecnico';

const GestionTecnicoService = {
  crearAsignacion: async (asignacionData) => {
    try {
      const response = await axios.post(`${API_URL}/asignar`, asignacionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear asignación:', error);
      throw error;
    }
  },

  obtenerAsignacionesPorTecnico: async (tecnicoId) => {
    try {
      const response = await axios.get(`${API_URL}/tecnico/${tecnicoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener asignaciones para el técnico con ID ${tecnicoId}:`, error);
      throw error;
    }
  },
};

export default GestionTecnicoService;
