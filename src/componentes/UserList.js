/**Este componente solicitará los usuarios protegidos por el token y los mostrará en pantalla. */

import React, { useEffect, useContext, useState } from 'react';
import { getUsers } from '../services/userService';
import { AuthContext } from '../context/AuthContext';

const UserList = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers(auth.token);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [auth.token]);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;