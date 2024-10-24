import axios from 'axios';

// URL base de tu backend
const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/auth'; // Asegúrate de que la URL sea correcta

// Función para iniciar sesión
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });

    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data)); 
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('expiresIn', response.data.expiresIn);
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Error in authService.login:', error.response ? error.response.data : error.message);
    throw error;
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
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Obtener usuario por ID
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
    const response = await axios.post(`${API_URL}/register`, { name, email, password, role }, {
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
  const token = localStorage.getItem('token');
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
      dataToUpdate.password = password;
    }

    const response = await axios.put(`${API_URL}/users/${id}`, dataToUpdate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error actualizando usuario:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener técnicos
const getTechnicians = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await axios.get(`${API_URL}/technicians`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo técnicos:', error.response ? error.response.data : error.message);
    throw error;
  }
};


//obtener tecnicos por id 


// Función para asignar un técnico a una tarea
const assignTechnician = async (taskId, technicianId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await axios.post(`${API_URL}/assign-technician`, { taskId, technicianId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error asignando técnico:', error.response ? error.response.data : error.message);
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
  UserService,
  getTechnicians,
  assignTechnician
};

export default authService;
