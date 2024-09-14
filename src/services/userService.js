import { apiClient } from '../utils/apiClient';

export const getUsers = async (token) => {
  const response = await apiClient(token).get(
    'https://loginexpress-ts-jwt.onrender.com/api/auth/users'
  );
  return response.users;
};