import React, { useState } from 'react';
import BoyIcon from '@mui/icons-material/Boy';
import ManIcon from '@mui/icons-material/Man';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from 'react-router-dom';

// Importación de imágenes
import habitacionDoble1 from '../assets/Images/HabitacionDoble1.jpg';
import habitacionDoble2 from '../assets/Images/HabitacionDoble2.jpg';
import habitacionCuadruple1 from '../assets/Images/HabitacionCuadruple1.jpg';
import habitacionCuadruple2 from '../assets/Images/HabitacionCuadruple2.jpg';
import defaultHabitacion from '../assets/Images/DefaultHabitacion.jpg';

const ReservasPage = () => {
  const [params, setParams] = useState({
    p_cantidad_adultos: 0,
    p_cantidad_menores: 0,
    p_checkin: '',
    p_checkout: '',
  });
  const [habitaciones, setHabitaciones] = useState([]);
  const [error, setError] = useState(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [infoPersonal, setInfoPersonal] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setParams((prevParams) => ({
      ...prevParams,
      [event.target.name]: event.target.value,
    }));
  };

  const handleInfoChange = (event) => {
    setInfoPersonal((prevInfo) => ({
      ...prevInfo,
      [event.target.name]: event.target.value,
    }));
  };

  const fetchHabitaciones = async (event) => {
    event.preventDefault();
    const today = new Date();
    const checkinDate = new Date(params.p_checkin);
    if (checkinDate < today) {
      setError({ message: "La fecha de check-in debe ser mayor o igual a hoy" });
      setHabitaciones([]);
      return;
    }
  
    if (checkinDate >= new Date(params.p_checkout)) {
      setError({ message: "La fecha de check-in debe ser anterior a la fecha de check-out" });
      setHabitaciones([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/habitaciones-disponibles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_cantidad_adultos: parseInt(params.p_cantidad_adultos),
          p_cantidad_menores: parseInt(params.p_cantidad_menores),
          p_checkin: params.p_checkin,
          p_checkout: params.p_checkout,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener habitaciones');
      }

      const data = await response.json();
      setHabitaciones(data);
      setError(null);
    } catch (error) {
      setError({ message: error.message });
      setHabitaciones([]);
    }
  };

  const handleSeleccionarHabitacion = (habitacion) => {
    setHabitacionSeleccionada(habitacion);
  };

  const handleSiguiente = () => {
    if (habitacionSeleccionada) {
      setMostrarFormulario(true);
    }
  };

  const handleReservar = async () => {
    if (!habitacionSeleccionada || !infoPersonal.nombre || !infoPersonal.apellido || !infoPersonal.email || !infoPersonal.telefono) {
      setError({ message: "Por favor complete todos los campos y seleccione una habitación." });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reserva`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: infoPersonal.nombre,
          apellido: infoPersonal.apellido,
          mail: infoPersonal.email,
          telefono: infoPersonal.telefono,
          fechacheckin: params.p_checkin,
          fechacheckout: params.p_checkout,
          tipo_habitacion: habitacionSeleccionada.tipo_habitacion,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al realizar la reserva');
      }

      const data = await response.json();
      console.log('Reserva realizada con éxito:', data);
      navigate('/gracias'); 
    } catch (error) {
      setError({ message: error.message });
    }
  };

  return (
    <div className="bg-white p-6 max-w-6xl mx-auto rounded-lg shadow-lg border-2 border-gray-200 my-8">
      <h2 className="text-3xl font-serif font-medium text-gray-700 mb-4 text-center">Buscar habitaciones disponibles</h2>
      <form onSubmit={fetchHabitaciones} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
          <div>
            <p className="font-serif text-gray-700">Cantidad de Adultos</p>
            <input 
              type='number'
              placeholder='Cantidad de adultos'
              name='p_cantidad_adultos'
              value={params.p_cantidad_adultos}
              onChange={handleChange}
              className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              min="0"
            />
          </div>
          <div>
            <p className="font-serif text-gray-700">Cantidad de Menores</p>
            <input 
              type='number'
              placeholder='Cantidad de menores'
              name='p_cantidad_menores'
              value={params.p_cantidad_menores}
              onChange={handleChange}
              className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              min="0"
            />
          </div>
          <div>
            <p className="font-serif text-gray-700">Fecha Check-In</p>
            <input 
              type='date'
              name='p_checkin'
              value={params.p_checkin}
              onChange={handleChange}
              className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <p className="font-serif text-gray-700">Fecha Check-Out</p>
            <input 
              type='date'
              name='p_checkout'
              value={params.p_checkout}
              onChange={handleChange}
              className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>
        <button type='submit' className="w-full py-3 bg-gray-700 text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400">Buscar</button>
      </form>

      {error && <p className="text-red-500 mb-4">Error: {error.message}</p>}
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {habitaciones.map((habitacion, index) => {
          const imagenes = habitacion.tipo_habitacion === 'Doble' 
            ? [habitacionDoble1, habitacionDoble2] 
            : habitacion.tipo_habitacion === 'Cuadruple'
            ? [habitacionCuadruple1, habitacionCuadruple2]
            : [defaultHabitacion];

          return (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${habitacionSeleccionada === habitacion ? 'border-4 border-black' : ''}`}
              onClick={() => handleSeleccionarHabitacion(habitacion)}
            >
              <Carousel showArrows={true} showThumbs={false} infiniteLoop>
                {imagenes.map((imagen, idx) => (
                  <div key={idx}>
                    <img src={imagen} alt={`Habitación ${habitacion.tipo_habitacion} ${idx + 1}`} />
                  </div>
                ))}
              </Carousel>
              <div className="p-4">
                <h3 className="text-xl font-serif font-semibold text-gray-700 mb-2">Habitación {habitacion.tipo_habitacion}</h3>
                <p className="text-gray-600">Descripción de la habitación...</p>
                <p className="text-gray-600">Precio: ${habitacion.precio} por noche</p>
              </div>
            </div>
          );
        })}
      </div>

      {habitacionSeleccionada && (
        <div className="mt-8">
          <h3 className="text-2xl font-serif font-semibold text-gray-700 mb-4">Complete sus datos personales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input 
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={infoPersonal.nombre}
              onChange={handleInfoChange}
              className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input 
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={infoPersonal.apellido}
              onChange={handleInfoChange}
              className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input 
              type="email"
              name="email"
              placeholder="Email"
              value={infoPersonal.email}
              onChange={handleInfoChange}
              className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input 
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={infoPersonal.telefono}
              onChange={handleInfoChange}
              className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <button 
            onClick={handleReservar}
            className="w-full py-3 bg-gray-700 text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Reservar
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservasPage;
