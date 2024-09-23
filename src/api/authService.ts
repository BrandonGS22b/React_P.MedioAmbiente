import api from "../services/axiosConfig";

// Definir el tipo o interfaz para los datos de registro del usuario
interface RegisterData {
    email: string;
    password: string;
    // Puedes añadir más campos que esperes, como nombre, teléfono, etc.
    name?: string;
}

export const login = async (credentials: { email: string; password: string }) => {
    return await api.post('/auth/login', credentials);
};

// Cambia `any` por el tipo `RegisterData`
export const register = async (userData: RegisterData) => {
    return await api.post('/auth/register', userData);
};
