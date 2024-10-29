import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Habitaciones = () => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [tipoHabitacion, setTipoHabitacion] = useState('');
    const [precio, setPrecio] = useState('');
    const [cantidadHuespedes, setCantidadHuespedes] = useState('');
    const [fechaAlta, setFechaAlta] = useState('');
    const [fechaBaja, setFechaBaja] = useState('');
    const [idToUpdate, setIdToUpdate] = useState(null);

    // Función para obtener habitaciones
    const fetchHabitaciones = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/habitaciones`);
            setHabitaciones(response.data);
        } catch (error) {
            console.error('Error al obtener habitaciones:', error);
        }
    };

    // Función para eliminar una habitación
    const deleteHabitacion = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/habitaciones/${id}`);
            fetchHabitaciones(); // Actualizar la lista después de eliminar
        } catch (error) {
            console.error('Error al eliminar habitación:', error);
        }
    };

    // Función para actualizar una habitación
    const updateHabitacion = async (id) => {
        const formattedFechaAlta = new Date(fechaAlta).toISOString().split('T')[0];
        const formattedFechaBaja = new Date(fechaBaja).toISOString().split('T')[0];

        const datosActualizacion = {
            tipo_habitacion: tipoHabitacion,
            precio: precio,
            cantidad_huespedes: cantidadHuespedes,
            fecha_alta: formattedFechaAlta,
            fecha_baja: formattedFechaBaja,
        };

        try {
            const response = await axios.put(`http://localhost:5000/habitaciones/${id}`, datosActualizacion);
            fetchHabitaciones();
            resetForm();
        } catch (error) {
            console.error('Error al actualizar habitación:', error);
        }
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (idToUpdate) {
            updateHabitacion(idToUpdate);
        } else {
            console.log('ID no especificado para la actualización.');
        }
    };

    // Función para seleccionar una habitación para editar
    const selectHabitacion = (habitacion) => {
        setIdToUpdate(habitacion.id);
        setTipoHabitacion(habitacion.tipo_habitacion);
        setPrecio(habitacion.precio);
        setCantidadHuespedes(habitacion.cantidad_huespedes);
        setFechaAlta(habitacion.fecha_alta);
        setFechaBaja(habitacion.fecha_baja);
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setIdToUpdate(null);
        setTipoHabitacion('');
        setPrecio('');
        setCantidadHuespedes('');
        setFechaAlta('');
        setFechaBaja('');
    };

    useEffect(() => {
        fetchHabitaciones();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Habitaciones</h1>
            <ul className="mb-4">
                {habitaciones.map((habitacion) => (
                    <li key={habitacion.id} className="flex justify-between items-center border-b py-2">
                        <span className="font-semibold">{`${habitacion.tipo_habitacion} - Precio: $${habitacion.precio}`}</span>
                        <div>
                            <button onClick={() => selectHabitacion(habitacion)} className="text-blue-500 hover:text-blue-700 mx-2">
                                Editar
                            </button>
                            <button onClick={() => deleteHabitacion(habitacion.id)} className="text-red-500 hover:text-red-700">
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl mb-4">{idToUpdate ? 'Actualizar' : 'Habitación'}</h2>
                <input
                    type="text"
                    placeholder="Tipo de Habitación"
                    value={tipoHabitacion}
                    onChange={(e) => setTipoHabitacion(e.target.value)}
                    required
                    className="block w-full border rounded-lg p-2 mb-4"
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                    className="block w-full border rounded-lg p-2 mb-4"
                />
                <input
                    type="number"
                    placeholder="Cantidad de Huéspedes"
                    value={cantidadHuespedes}
                    onChange={(e) => setCantidadHuespedes(e.target.value)}
                    required
                    className="block w-full border rounded-lg p-2 mb-4"
                />
                {/* Campos ocultos para las fechas */}
                <input type="hidden" value={fechaAlta} />
                <input type="hidden" value={fechaBaja} />
                <button type="submit" className="bg-blue-500 text-white font-semibold rounded-lg p-2 hover:bg-blue-600">
                    Actualizar
                </button>
                <button type="button" onClick={resetForm} className="bg-gray-300 text-black font-semibold rounded-lg p-2 ml-2 hover:bg-gray-400">
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default Habitaciones;
