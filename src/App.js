// src/App.js
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Router from './router'; // Asegúrate de que tu enrutador esté configurado

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;
