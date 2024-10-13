import axios from 'axios';

// URL base de tu backend
const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/auth'; // Asegúrate de que la URL sea correcta

// Función para iniciar sesión
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });

    // Verifica si la respuesta contiene el token y otros datos
    console.log('Response from API:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data)); // Guarda el token y otros datos del usuario
      localStorage.setItem('name', response.data.name); // Guarda el nombre
      localStorage.setItem('expiresIn', response.data.expiresIn); // Guarda el tiempo de expiración
      localStorage.setItem('token', response.data.token); // Guarda el token
    }

    return response.data;
  } catch (error) {
    console.error('Error in authService.login:', error.response ? error.response.data : error.message);
    throw error; // Vuelve a lanzar el error para que pueda ser manejado en el componente
  }
};

// Función para cerrar sesión
const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('expiresIn');
  } catch (error) {
    console.error('Error in authService.logout:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener todos los usuarios
const getUsuarios = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await axios.get(`${API_URL}/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Usuarios obtenidos:', response.data); // Agregar esta línea para depuración
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error.response ? error.response.data : error.message);
    throw error;
  }
};

//obtener usuario por id 
const UserService = async (id) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response;
};


// Función para crear un usuario con role incluido
const createUsuario = async ({ name, email, password, role }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password, role }, { // Asegúrate de usar 'name' en lugar de 'nombre'
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error creando usuario:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para eliminar un usuario
const deleteUsuario = async (id) => {
  const token = localStorage.getItem('token'); // Obtén el token para autorización
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error eliminando usuario:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para actualizar un usuario
const updateUsuario = async (id, { name, email, role, password }) => {
  const token = localStorage.getItem('token');
  if (!token) {
      throw new Error('Token no disponible');
  }

  try {
      const dataToUpdate = { name, email, role };
      if (password) {
          dataToUpdate.password = password; // Solo incluir la contraseña si se ha cambiado
      }

      const response = await axios.put(`${API_URL}/users/${id}`, 
          dataToUpdate,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error actualizando usuario:', error.response ? error.response.data : error.message);
      throw error;
  }
};

// Función para obtener el usuario actual
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Exporta todas las funciones del servicio de autenticación
const authService = {
  login,
  logout,
  getCurrentUser,
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  UserService
};

export default authService;
