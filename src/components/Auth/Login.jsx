// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/auth.service'; // Asegúrate de importar el authService
import  useAuth  from '../../context/useAuth'; // Importa el contexto de autenticación

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Usa el contexto de autenticación
  

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });

    try {
      const response = await authService.login(email, password); // Utiliza el servicio para iniciar sesión
      console.log('Response:', response);

      if (response && response.token) {
        console.log('Login successful');
        
        // Actualiza el estado del usuario en el contexto, asegurando que se incluya el nombre y el email
        login({ name: response.user.name, email: response.user.email }); // Cambiado para obtener el nombre correctamente
        
        // También puedes almacenar el nombre en localStorage si lo deseas
        localStorage.setItem('name', response.user.name);
        localStorage.setItem('user', JSON.stringify(response.user)); // Almacena el objeto usuario completo

        navigate('/dashboard'); // Navega a la página de inicio
      } else {
        setError('Error logging in');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error logging in');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
