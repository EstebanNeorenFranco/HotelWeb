import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReservasButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/reservas');
  };

  return (
    <div className="text-center py-24">
      <h2 className="text-3xl font-serif text-gray-800 mb-4 font-bold">¡Reserva Ahora!</h2>
      <button
        onClick={handleClick}
        className="bg-yellow-300 text-gray-800 py-4 font-bold px-14 rounded-lg shadow-md transition-colors duration-300 hover:bg-yellow-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
      >
        Reserva Ahora
      </button>
    </div>
  );
};

export default ReservasButton;
