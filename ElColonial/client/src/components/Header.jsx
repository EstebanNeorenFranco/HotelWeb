import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import Logo from '../assets/Images/Logo.png'; // Asegúrate de que la ruta de la imagen sea correcta

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para cerrar el menú cuando se hace clic en un enlace del menú móvil
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-grey-200 sticky top-0 z-50 w-full h-24 pt-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className='flex gap-4 items-center'>
              <img src={Logo} alt="El Colonial" className='w-[50px]' />
              { /*<span className="text-black font-serif text-2xl">El Colonial</span> */}
            </Link>
          </div>
          {/* Menú para dispositivos de tamaño mediano y superior */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-black text-lg hover:text-gray-500 hover:font-semibold px-3 py-2 rounded-md font-medium">Inicio</Link>
              <Link to="/servicios" className="text-black text-lg hover:text-gray-500 hover:font-semibold px-3 py-2 rounded-md font-medium">Servicios</Link>
              <Link to="/contacto" className="text-black text-lg hover:text-gray-500 hover:font-bold px-3 py-2 rounded-md font-medium" onClick={closeMenu}>Contacto</Link>
            </div>
          </nav>
          {/* Icono del menú para dispositivos móviles */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icono de las tres líneas */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Menú lateral para dispositivos móviles */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-200 fixed inset-0 z-50`}>
        <div className="flex justify-end">
          <button
            onClick={toggleMenu}
            className="text-gray-400 hover:text-gray-500 p-4 focus:outline-none"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Enlaces de navegación para dispositivos móviles */}
          <Link to="/" className="text-black hover:bg-gray-300 block px-3 py-2 rounded-md text-lg font-medium" onClick={closeMenu}>Inicio</Link>
          <Link to="/servicios" className="text-black hover:bg-gray-300 block px-3 py-2 rounded-md text-lg font-medium" onClick={closeMenu}>Servicios</Link>
          <Link to="/contacto" className="text-black hover:bg-gray-300 block px-3 py-2 rounded-md text-lg font-medium" onClick={closeMenu}>Contacto</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
