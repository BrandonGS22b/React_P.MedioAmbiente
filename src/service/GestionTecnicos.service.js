// service/GestionTecnico.service.js
import axios from 'axios';

const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/GestionTecnico';

const GestionTecnicoService = {
  crearAsignacion: async (asignacionData, imagenFile) => {
    try {
      const formData = new FormData();
      // Agregar los datos de la asignación al FormData
      for (const key in asignacionData) {
        formData.append(key, asignacionData[key]);
      }

      // Agregar la imagen si existe
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

  obtenerAsignacionesPorTecnico: async (tecnicoId) => { // Cambia el '=' por ':'
    try {
      const token = localStorage.getItem('token'); // Obtener el token
      const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario
      const role = user ? user.role : undefined; // Obtener el rol

      // Asegúrate de que el token y el rol están disponibles antes de hacer la solicitud
      if (!token) {
        throw new Error("No hay token de autenticación disponible");
      }

      const response = await axios.get(`${API_URL}/asignaciones/tecnico/${tecnicoId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Incluir el token en la cabecera
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
};

export default GestionTecnicoService;
