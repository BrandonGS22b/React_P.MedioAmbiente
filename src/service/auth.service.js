// src/services/auth.service.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api/auth/'; // Cambia esto a tu URL de API

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}login`, { email, password });
  if (response.data.token) {
    // Guardar el token en la cookie
    Cookies.set('token', response.data.token, { expires: 7 }); // Expira en 7 días
  }
  return response.data;
};

const logout = () => {
  // Eliminar la cookie del token
  Cookies.remove('token');
};

const getCurrentUser = () => {
  return Cookies.get('token') || null;
};

export default {
  login,
  logout,
  getCurrentUser,
};
