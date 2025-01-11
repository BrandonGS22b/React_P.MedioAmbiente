import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/auth.service'; // Servicio de autenticación
import swal from 'sweetalert';
import '../../styles/login.css'; // Estilo consistente con el login

const RecuperarPass = () => {
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Limpiar cualquier mensaje de error previo

    try {
      // Validación inicial de campos en el frontend
      if (!email || !document || !newPassword) {
        setError('Todos los campos son obligatorios.');
        setLoading(false);
        return;
      }

      // Verificación de usuario en el backend
      const validateResponse = await authService.updateUsuario(email, document);

      if (validateResponse && validateResponse.isValid) {
        // Cambiar la contraseña
        const changeResponse = await authService.changePassword(email, document, newPassword);

        if (changeResponse && changeResponse.message === 'Password changed successfully') {
          swal('Contraseña cambiada', 'Tu contraseña ha sido actualizada correctamente', 'success');
          navigate('/'); // Redirigir al inicio de sesión
        } else {
          setError('No se pudo cambiar la contraseña. Inténtalo nuevamente.');
        }
      } else {
        setError('Correo o documento incorrectos.');
      }
    } catch (err) {
      console.error('Error de recuperación:', err);
      setError('Ocurrió un error durante la recuperación. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="/logo1.jpg" alt="Logo" className="logo" />
      </div>
      <form onSubmit={handleRecovery} className="login-form">
        <h2>Recuperar Contraseña</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          required
        />
        <input
          type="text"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          placeholder="Cédula"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nueva Contraseña"
          required
        />
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Enviando...' : 'Recuperar Contraseña'}
        </button>
        {error && <p className="error-message">{error}</p>}
        <button 
          type="button" 
          onClick={() => navigate('/')} 
          className="forgot-password-button"
        >
          Volver al inicio de sesión
        </button>
      </form>
    </div>
  );
};

export default RecuperarPass;
