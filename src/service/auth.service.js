// src/service/auth.service.js
import axios from 'axios';

// URL base de tu backend
const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/auth'; // Asegúrate de que la URL sea correcta

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password}, { withCredentials: true });

    // Verifica si la respuesta contiene el token y otros datos
    console.log('Response from API:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data)); // Guarda el token y otros datos del usuario
      localStorage.setItem('name', response.data.name); // Guarda el nombre en localStorage
      localStorage.setItem('expiresIn', response.data.expiresIn); // Guarda el tiempo de expiración

    }

    return response.data;
  } catch (error) {
    console.error('Error in authService.login:', error.response ? error.response.data : error.message);
    throw error; // Vuelve a lanzar el error para que pueda ser manejado en el componente
  }
};

const logout = () => {
  localStorage.removeItem('user');
  return axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
  
};

const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;
