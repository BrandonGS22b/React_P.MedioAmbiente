// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario autenticado

  // Simular la recuperación del estado de autenticación (ejemplo con localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Recuperar el usuario almacenado si existe
    }
  }, []);

  const login = (userData) => {
    setUser(userData); // Actualizar el estado del usuario
    localStorage.setItem('user', JSON.stringify(userData)); // Guardar el usuario en localStorage
  };

  const logout = () => {
    setUser(null); // Limpiar el estado del usuario
    localStorage.removeItem('user'); // Remover el usuario de localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
