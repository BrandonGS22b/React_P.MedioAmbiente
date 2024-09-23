import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes/AppRoutes'; // Correct import statement
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider>,
    document.getElementById('root')
);
