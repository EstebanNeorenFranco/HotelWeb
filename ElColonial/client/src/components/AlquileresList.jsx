import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Delete, Save, Cancel, Add } from '@mui/icons-material';


const AlquileresList = () => {
    const [alquileres, setAlquileres] = useState([]);
    const [editAlquiler, setEditAlquiler] = useState(null);
    const [addingNew, setAddingNew] = useState(false);
    const [formData, setFormData] = useState({
        habitacion_id: '',
        fecha_inicio: '',
        fecha_fin: '',
        monto: '',
        estado: '',
        fecha_alta: '',
        fecha_baja: ''
    });

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear); // Año actual

    // Función para obtener todos los alquileres
    const fetchAlquileres = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/alquileres`);
            setAlquileres(response.data);
        } catch (error) {
            console.error('Error al obtener los alquileres:', error);
        }
    };

    // Función para manejar el envío del formulario de nuevo alquiler
    const handleAddNew = async (e) => {
        e.preventDefault();
        try {
            // Crear nuevo objeto de alquiler a partir del formData
            const newAlquiler = {
                habitacion_id: formData.habitacion_id,
                fecha_inicio: formData.fecha_inicio ? new Date(formData.fecha_inicio).toISOString().split('T')[0] : null,
                fecha_fin: formData.fecha_fin ? new Date(formData.fecha_fin).toISOString().split('T')[0] : null,
                monto: formData.monto,
                estado: formData.estado,
                fecha_alta: new Date().toISOString().split('T')[0], // La fecha alta es la actual
                fecha_baja: formData.fecha_baja ? new Date(formData.fecha_baja).toISOString().split('T')[0] : null
            };
    
            // Enviar solicitud POST al servidor para agregar el nuevo alquiler
            const response = await axios.post(`http://localhost:5000/alquileres`, newAlquiler);
    
            // Si la respuesta es exitosa, actualizar la lista de alquileres y resetear el formulario
            if (response.status === 201) {
                setAddingNew(false); // Ocultar el formulario
                setFormData({
                    habitacion_id: '',
                    fecha_inicio: '',
                    fecha_fin: '',
                    monto: '',
                    estado: '',
                    fecha_alta: '',
                    fecha_baja: ''
                }); // Limpiar el formulario
                fetchAlquileres(); // Recargar la lista de alquileres
            } else {
                console.error('Error al agregar el alquiler:', response.data);
            }
        } catch (error) {
            console.error('Error al agregar el alquiler:', error);
        }
    };
    

    const filterAlquileresByYear = () => {
        return alquileres.filter(alquiler => {
            const alquilerDate = new Date(alquiler.fecha_inicio);
            return alquilerDate.getFullYear() === selectedYear;
        });
    };

    // Función para eliminar un alquiler
    const deleteAlquiler = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este alquiler?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/alquileres/${id}`);
                setAlquileres(alquileres.filter(alquiler => alquiler.id !== id));
            } catch (error) {
                console.error('Error al eliminar el alquiler:', error);
            }
        }
    };

    // Función para manejar el inicio de la edición
    const startEdit = (alquiler) => {
        setEditAlquiler(alquiler.id);
        setFormData({
            habitacion_id: alquiler.habitacion_id,
            fecha_inicio: alquiler.fecha_inicio ? alquiler.fecha_inicio.split('T')[0] : '',
            fecha_fin: alquiler.fecha_fin ? alquiler.fecha_fin.split('T')[0] : '',
            monto: alquiler.monto,
            estado: alquiler.estado,
            fecha_alta: alquiler.fecha_alta ? alquiler.fecha_alta.split('T')[0] : '',
            fecha_baja: alquiler.fecha_baja ? alquiler.fecha_baja.split('T')[0] : '',
        });
    };

    // Función para manejar el envío del formulario de edición
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const updatedAlquiler = {
                ...formData,
                fecha_inicio: formData.fecha_inicio ? new Date(formData.fecha_inicio).toISOString().split('T')[0] : null,
                fecha_fin: formData.fecha_fin ? new Date(formData.fecha_fin).toISOString().split('T')[0] : null,
                fecha_alta: formData.fecha_alta ? new Date(formData.fecha_alta).toISOString().split('T')[0] : null,
                fecha_baja: formData.fecha_baja ? new Date(formData.fecha_baja).toISOString().split('T')[0] : null,
            };
            await axios.put(`http://localhost:5000/alquileres/${editAlquiler}`, updatedAlquiler);
            setEditAlquiler(null);
            fetchAlquileres(); // Recargar la lista después de editar
        } catch (error) {
            console.error('Error al actualizar el alquiler:', error);
        }
    };

    // Función para manejar el cambio en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setEditAlquiler(null);
        setAddingNew(false);
    };

    // Función para manejar el cambio en el año
    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    useEffect(() => {
        fetchAlquileres(); // Obtener los alquileres al cargar el componente
    }, []);

    return (
        <div className="container mx-auto p-4">
          
            <label htmlFor="year"><b>Año:</b></label>
            <input
                type="number"
                id="year"
                className='ml-2 mb-4 text-bold'
                value={selectedYear}
                onChange={handleYearChange}
                min={currentYear} // Año actual como mínimo
                max={currentYear + 2} // 2 años más como máximo
            />

            <button 
                onClick={() => setAddingNew(true)} 
                className="bg-green-500 text-white rounded px-4 py-2 mb-4 flex items-center gap-2"
            >
                <Add /> Agregar Alquiler
            </button>

            {addingNew && (
                <form onSubmit={handleAddNew} className="mb-4 ">
                    <input 
                        type="number" 
                        name="habitacion_id" 
                        value={formData.habitacion_id} 
                        onChange={handleChange} 
                        placeholder="Habitación ID"
                        className="border rounded px-2 py-1 mb-2"
                    />
                    <input 
                        type="date" 
                        name="fecha_inicio" 
                        value={formData.fecha_inicio} 
                        onChange={handleChange} 
                        placeholder="Fecha Inicio"
                        className="border rounded px-2 py-1 mb-2 ml-2"
                    />
                    <input 
                        type="date" 
                        name="fecha_fin" 
                        value={formData.fecha_fin} 
                        onChange={handleChange} 
                        placeholder="Fecha Fin"
                        className="border rounded px-2 py-1 mb-2 ml-2"
                    />
                    <input 
                        type="number" 
                        name="monto" 
                        value={formData.monto} 
                        onChange={handleChange} 
                        placeholder="Monto"
                        className="border rounded px-2 py-1 mb-2 ml-2"
                    />
                    <select 
                        name="estado" 
                        value={formData.estado} 
                        onChange={handleChange}
                        className="border rounded px-2 py-1 mb-2 ml-2"
                    >
                        <option value="">Selecciona el estado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmado">Confirmado</option>
                    </select>
                    <button type="submit" className="bg-blue-500 text-white rounded px-3 py-1 mr-2 ml-2"><Save/> </button>
                    <button type="button" onClick={handleCancel} className="bg-gray-500 text-white rounded px-3 py-1 "> <Cancel/> </button>
                </form>
            )}

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Habitación</th>
                        <th className="py-2 px-4 border-b">Fecha Inicio</th>
                        <th className="py-2 px-4 border-b">Fecha Fin</th>
                        <th className="py-2 px-4 border-b">Monto</th>
                        <th className="py-2 px-4 border-b">Estado</th>
                        <th className="py-2 px-4 border-b">Fecha Alta</th>
                        <th className="py-2 px-4 border-b">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filterAlquileresByYear().map(alquiler => (
                        <tr key={alquiler.id} className={editAlquiler === alquiler.id ? 'bg-yellow-100' : ''}>
                            <td className="py-2 px-4 border-b">{alquiler.id}</td>
                            <td className="py-2 px-4 border-b">{alquiler.habitacion_id}</td>
                            <td className="py-2 px-4 border-b">{alquiler.fecha_inicio.split('T')[0]}</td>
                            <td className="py-2 px-4 border-b">{alquiler.fecha_fin.split('T')[0]}</td>
                            <td className="py-2 px-4 border-b">{alquiler.monto}</td>
                            <td className="py-2 px-4 border-b">{alquiler.estado}</td>
                            <td className="py-2 px-4 border-b">{alquiler.fecha_alta ? alquiler.fecha_alta.split('T')[0] : ''}</td>
                            <td className="py-2 px-4 border-b flex items-center">
                                {editAlquiler === alquiler.id ? (
                                    <>
                                        <button onClick={handleEdit} className="bg-blue-500 text-white rounded px-2 py-1 mr-2"><Save /> </button>
                                        <button onClick={handleCancel} className="bg-gray-500 text-white rounded px-2 py-1"><Cancel /> </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEdit(alquiler)} className="bg-yellow-500 text-white rounded  mr-2 px-3 py-1"><Edit /> </button>
                                        <button onClick={() => deleteAlquiler(alquiler.id)} className="bg-red-500 text-white rounded  px-3 py-1"><Delete /> </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AlquileresList;
