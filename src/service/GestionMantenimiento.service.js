import axios from 'axios';

// URL base de tu backend
const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/GestionMantenimiento';

// Función para crear un nuevo mantenimiento
const crearMantenimiento = async (mantenimientoData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, mantenimientoData);
    return response.data;
  } catch (error) {
    console.error('Error en el servicio de creación:', error);
    throw new Error(error.response.data.message || 'Error al crear el mantenimiento');
  }
};

// Función para obtener todos los mantenimientos
const obtenerMantenimientos = async () => {
  try {
    const response = await axios.get(`${API_URL}/get`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error al obtener los mantenimientos');
  }
};

// Función para actualizar un mantenimiento
const actualizarMantenimiento = async (mantenimientoId, mantenimientoData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${mantenimientoId}`, mantenimientoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error al actualizar el mantenimiento');
  }
};

// Función para eliminar un mantenimiento
const eliminarMantenimiento = async (mantenimientoId) => {
  try {
    const response = await axios.delete(`${API_URL}/${mantenimientoId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error al eliminar el mantenimiento');
  }
};

// Exportar las funciones del servicio
const GestionMantenimientoService = {
  crearMantenimiento,//este
  obtenerMantenimientos,//esta 
  actualizarMantenimiento,//falta
  eliminarMantenimiento,//falta
};

export default GestionMantenimientoService;
