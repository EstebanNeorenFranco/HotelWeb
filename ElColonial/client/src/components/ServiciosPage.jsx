import React from 'react';
import Foto4 from '../assets/Images/Foto5.webp';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WifiIcon from '@mui/icons-material/Wifi';
import SnowboardingIcon from '@mui/icons-material/Snowboarding';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';

const ServiciosPage = () => {
  return (
    <div className="flex flex-col md:flex-row lg:flex-row bg-white shadow-lg overflow-hidden">
      <div className="relative lg:w-1/2 h-96 lg:h-auto">
        <img 
          src={Foto4} 
          alt="Hotel" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
      </div>
      <div className="lg:w-1/2 p-6 md:pt-12 sm:pt-12 lg:my-28 lg:p-10 flex flex-col justify-center">
        <h2 className="text-4xl lg:text-5xl font-bold font-serif text-gray-800 mb-4">Servicios en El Colonial</h2>
        {[
          {
            icon: <LocalHotelIcon fontSize="large" color="primary" />,
            title: "Departamentos Amoblados",
            description: "Departamentos de uno o dos dormitorios completamente amoblados y equipados con kitchenette, heladera, vajilla y blanquería para albergar de dos a cinco personas."
          },
          {
            icon: <PoolIcon fontSize="large" color="primary" />,
            title: "Áreas Comunes",
            description: "Disfrutá de nuestras instalaciones con pileta, quincho con asador, galerías y amplios espacios verdes para relajarte y pasar buenos momentos."
          },
          {
            icon: <DirectionsCarIcon fontSize="large" color="primary" />,
            title: "Estacionamiento",
            description: "Contamos con estacionamiento (sujeto a disponibilidad) para mayor comodidad de nuestros huéspedes."
          },
          {
            icon: <WifiIcon fontSize="large" color="primary" />,
            title: "Wifi Gratuito",
            description: "Conexión wifi en todas nuestras instalaciones para que puedas mantenerte conectado en todo momento."
          },
          {
            icon: <RestaurantMenuIcon fontSize="large" color="primary" />,
            title: "Canasta de Bienvenida",
            description: "Al llegar a tu departamento vas a encontrar una canasta con café, té, leche y endulzantes para que puedas disfrutar de un desayuno sin salir de tu alojamiento."
          },
          {
            icon: <SnowboardingIcon fontSize="large" color="primary" />,
            title: "Tablas de Sandboard",
            description: "Ofrecemos tablas de sandboard para que disfrutes de la experiencia en las dunas cercanas."
          },
          {
            icon: <OutdoorGrillIcon fontSize="large" color="primary" />,
            title: "Parrilla Pampeana",
            description: "Disfrutá de nuestro estilo de parrilla pampeana, ideal para saborear las mejores carnes a la parrilla."
          }
        ].map((service, index) => (
          <div className="flex flex-col items-start " key={index}>
            
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 my-3 flex gap-5 ">{service.icon}{service.title}</h3>
            <p className="text-gray-700 text-lg lg:text-xl mb-4">{service.description}</p>
          </div>
        ))}
        <p className="text-lg lg:text-xl text-gray-800 mt-6">
          ¡Vení a conocernos y viví la experiencia El Colonial!
        </p>
      </div>
    </div>
  );
};

export default ServiciosPage;
