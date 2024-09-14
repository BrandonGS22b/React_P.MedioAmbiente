/* Esto ayuda a mantener la lógica de API separada de 
los componentes y centraliza todas las operaciones
 relacionadas con las solicitudes.

*/

import apiClient from '../utils/apiClient';

 const login = async (email, password) => {
  const response = await apiClient().post(
    'https://loginexpress-ts-jwt.onrender.com/api/auth/login',
    { email, password }
  );
  return response.token;
};

export default login;