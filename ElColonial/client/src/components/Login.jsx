// Login.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (localStorage.getItem('token')) {
      navigate('/protected'); // O a la ruta que quieras
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5000/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token); // Guardar el token
        navigate('/protected'); // Redirigir a la ruta protegida
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error en la conexión');
    }
  };

  return (
    <div className="bg-white p-6 max-w-sm mx-auto rounded-lg shadow-lg border-2 border-gray-200 my-40">
      <h2 className="text-3xl font-serif font-medium text-gray-700 mb-4 text-center">Inicio de sesión</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Usuario</label>
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            onChange={handleChange}
            className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
