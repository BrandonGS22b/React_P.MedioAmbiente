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


const createUsuario = async ({ name, email, password, role, direccion, telefono, tipodedocumento, documento }) => {
  const token = localStorage.getItem('token');
  console.log("Token recuperado:", token);

  if (!token) {
    throw new Error('Token no disponible');
  }

  const payload = { name, email, password, role, direccion, telefono, tipodedocumento, documento };
  console.log("Datos enviados al servidor:", payload);

  try {
    const response = await axios.post(`${API_URL}/register`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log("Respuesta del servidor:", response); // Log completo de la respuesta
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Respuesta del servidor no válida");
    }
  } catch (error) {
    console.error('Error creando usuario:', error.response || error.message);
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
    return response.data; // Asegúrate de que `users` contenga el campo `estado`
  } catch (error) {
    console.error('Error obteniendo usuarios:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Obtener usuario por ID
const UserService = async (id) => {
  try {
    const response = await axios.get(`https://loginexpress-ts-jwt.onrender.com/api/auth/users/${id}`);
    return response; // Debe contener un campo 'data' con los datos del usuario
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
};

// Función para crear un usuario con role incluido
// Función para crear un nuevo usuario con role incluido


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
const getTechnicianById = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await axios.get(`${API_URL}/technicians/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo técnico por ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};


//obtener usuarios con rol usuario
const getUsuariosConRol = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await axios.get(`https://loginexpress-ts-jwt.onrender.com/api/auth/AuxiliarUsuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Aquí `response.data` es directamente el array de usuarios
  } catch (error) {
    console.error('Error obteniendo usuarios por rol:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// Función para asignar un técnico a una tarea
const assignTechnician = async (taskId, technicianId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  const isValidObjectId = (id) => {
    return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
  };

  if (!isValidObjectId(taskId) || !isValidObjectId(technicianId)) {
    throw new Error('ID de tarea o técnico no válido');
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



const enableUser = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await axios.patch(`${API_URL}/users/${userId}/enable`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en enableUser:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const disableUser = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await axios.patch(`${API_URL}/users/${userId}/disable`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en disableUser:', error.response ? error.response.data : error.message);
    throw error;
  }
};
const changePassword = async (correo, documento, nuevaClave) => {
  try {
    // Verificar si los datos necesarios están disponibles
    if (!correo || !documento || !nuevaClave) {
      throw new Error('Correo, documento y nuevaClave son requeridos');
    }

    const response = await axios.patch(`${API_URL}/changePassword`, 
      { correo, documento, nuevaClave },
      { 
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true 
      }
    );

    // Verificar que la respuesta sea exitosa
    if (response.data.message) {
      return response.data.message; // Devuelve el mensaje de éxito
    } else {
      throw new Error('Error inesperado');
    }
  } catch (error) {
    console.error('Error en changePassword:', error.response ? error.response.data : error.message);
    throw error; // Propagar el error para manejarlo en el componente
  }
};


// Exporta todas las funciones del servicio de autenticación
const authService = {
  login,
  logout,
  getCurrentUser,
  getUsuarios,
  createUsuario,
  updateUsuario,
  getTechnicianById,
  getUsuariosConRol,
  deleteUsuario,
  UserService,
  getTechnicians,
  assignTechnician,
  changePassword,
  disableUser,
  enableUser,
};

export default authService;
