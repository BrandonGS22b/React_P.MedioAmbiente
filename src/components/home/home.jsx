import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Obtiene el usuario y la función de logout del contexto
  const [timeLeft, setTimeLeft] = useState(null); // Estado para el tiempo restante

  useEffect(() => {
    // Si no hay usuario, redirigir al login
    if (user === null) {
      console.log('No inicia bro, no hay usuario, redirigir al login');
      navigate('/'); // Redirige a la página de login
      return; // Salir si no hay usuario
    }

    // Recuperar el tiempo de expiración del localStorage
    const expiresIn = localStorage.getItem('expiresIn');
    if (expiresIn) {
      setTimeLeft(parseInt(expiresIn, 10)); // Convertir a número
    }
    //recuperamos el nombre del usuario
    const userName = localStorage.getItem('name');
    console.log(`Hola ${userName}!`); // Muestra el nombre del usuario en la consola
    
    console.log('hola el usaurio es'+user.name); //

    // Intervalo para actualizar el contador
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          logout(); // Llama a la función de logout
          navigate('/'); // Redirige al login
          return 0; // Detener el contador
        }
        return prevTime - 1; // Decrementar el tiempo restante
      });
    }, 1000);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [user, navigate, logout]); // Agrega `logout` a las dependencias

  const handleLogout = () => {
    try {
      logout(); // Usa la función de logout del contexto
      navigate('/'); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Mientras `user` es nulo, muestra un mensaje de carga
  if (user === null) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Bienvenido a Home, {user.name}</h1> {/* Aquí muestra el nombre del usuario */}
      <button onClick={handleLogout}>Cerrar sesión</button>
      {timeLeft !== null && (
        <p>Tiempo restante para la expiración del token: {timeLeft} segundos</p>
      )}
    </div>
  );
}

export default Home;
