import React, { useEffect, useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`bg-white overflow-hidden flex flex-col md:flex-row transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Mapa */}
      <div className="relative h-64 md:h-auto md:w-1/2 transition-transform duration-500 ease-in-out transform hover:scale-105">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3583.851348773413!2d-65.9730545!3d-26.071114099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941f316b65ea5159%3A0xef201f4d6fd4ff58!2sCalixto%20Maman%C3%AD%20134%2C%20A4427%20Cafayate%2C%20Salta!5e0!3m2!1sen!2sar!4v1717246485699!5m2!1sen!2sar"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Mapa de Cafayate"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {/* Contenido de contacto */}
      <div className="p-6 flex flex-col items-center md:w-1/2 justify-center lg:my-28">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 text-center">Contacto</h2>
        <p className="text-gray-700 lg:text-lg mb-4 text-center">No dudes en hacer tu consulta</p>
        <div className="flex flex-col items-center space-y-4 mb-4">
          <button className="flex items-center justify-center w-48 lg:w-64 py-3 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105">
            <EmailIcon className='mr-1' /> E-mail
          </button>
          <a href="https://api.whatsapp.com/send?phone=543875824265&text=Hola%2C%2520quiero%2520m%C3%A1s%2520info" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-48 lg:w-64 py-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ease-in-out transform hover:scale-105">
            <WhatsAppIcon className='mr-1' /> WhatsApp
          </a>
          <a href="https://www.instagram.com/elcolonial_departamentos/?igsh=b3FxOXd0NW1zMzFm" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-48 lg:w-64 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300 ease-in-out transform hover:scale-105">
            <InstagramIcon className='mr-1' /> Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;