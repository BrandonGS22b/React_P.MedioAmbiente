import axios from 'axios';

const api = axios.create({
    baseURL: 'http://tu-api-url.com/api', // Cambia esto por la URL de tu API
});

export default api;
