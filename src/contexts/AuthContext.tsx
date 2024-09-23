import React, { createContext, useState, ReactNode } from 'react';

// Definir el tipo User con las propiedades que necesitas
interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    // Puedes agregar más propiedades según sea necesario
}

interface AuthContextProps {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

// Crear el contexto con un valor por defecto de undefined
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Definir el componente AuthProvider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Función login para establecer el usuario
    const login = (user: User) => {
        setUser(user);
    };

    // Función logout para eliminar el usuario
    const logout = () => {
        setUser(null);
    };

    // Retornar el proveedor del contexto con los valores y los hijos
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
