import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Ajusta la ruta según tu estructura de carpetas

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
