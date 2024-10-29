import React from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

const Footer = ({ user }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-6  bottom-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-sm">&copy; 2024 El Colonial - Todos los derechos reservados.</p>
          <button
            onClick={handleDashboardClick}
            aria-label={user ? "Ir al Dashboard" : "Iniciar sesión"}
            className="text-white px-4 py-2 rounded hover:text-gray-400 transition-colors duration-300 flex items-center"
          >
            <PersonIcon />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
