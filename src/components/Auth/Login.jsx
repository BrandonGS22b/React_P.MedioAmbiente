import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/auth.service'; // Asegúrate de importar el authService
import useAuth from '../../context/useAuth'; // Importa el contexto de autenticación

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Usa el contexto de autenticación
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia la carga
    try {
      const response = await authService.login(email, password); // Utiliza el servicio para iniciar sesión

      if (response && response.token) {
        console.log('Login successful');

        // Log para ver qué datos se están guardando
        console.log('Datos del usuario:', response.user); // Agregado para ver qué datos está recibiendo

        // Actualiza el estado del usuario en el contexto, asegurando que se incluya el nombre, email y role
        login({ 
          _id: response.user._id,  // Asegúrate de incluir el _id
          name: response.user.name, 
          email: response.user.email, 
          role: response.user.role 
        });

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
    } finally {
      setLoading(false); // Detiene la carga
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
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
