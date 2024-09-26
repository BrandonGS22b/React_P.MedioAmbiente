import axios from 'axios';

// Configura Axios para incluir credenciales en cada solicitud
const axiosInstance = axios.create({
    baseURL: 'https://loginexpress-ts-jwt.onrender.com/api/auth', // Asegúrate de que este sea el URL correcto de tu backend
    withCredentials: true, // Esto habilita el envío de cookies automáticamente
  });
  




export default axiosInstance;