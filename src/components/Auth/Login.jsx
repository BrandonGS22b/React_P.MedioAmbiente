import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/auth.service'; // Asegúrate de importar el authService
import useAuth from '../../context/useAuth'; // Importa el contexto de autenticación
import '../../styles/login.css'; // Añadimos un archivo CSS para mejorar el diseño

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Usa el contexto de autenticación

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia la carga
    try {
      const response = await authService.login(email, password); // Utiliza el servicio para iniciar sesión

      if (response && response.token) {
        if (response.user.estado && response.user.estado.trim() !== 'activo') {
          setError('El usuario no está activo. Por favor, contacta al administrador.');
          setLoading(false);
          return;
        }

        login({
          _id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          estado: response.user.estado,
        });

        localStorage.setItem('name', response);
        localStorage.setItem('user', JSON.stringify(response.user));

        navigate('/dashboard'); // Navega a la página de inicio
      } else {
        setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false); // Detiene la carga
    }
  };

  const handleForgotPassword = () => {
    navigate('/RecuperarPass'); // Redirige a la página de recuperación de contraseña
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="/logo1.jpg" alt="Logo" className="logo" />
      </div>
      <form onSubmit={handleLogin} className="login-form">
        <h2>Iniciar sesión</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
        {error && <p className="error-message">{error}</p>}

        <button
          type="button"
          onClick={handleForgotPassword}
          className="forgot-password-button"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
