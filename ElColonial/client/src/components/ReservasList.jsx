import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { Download } from '@mui/icons-material';


const ReservasList = () => {
  const [reservas, setReservas] = useState([]);
  const [editReservaId, setEditReservaId] = useState(null);
  const [editData, setEditData] = useState({
    nombre: '',
    apellido: '',
    mail: '',
    estado_pago: 'Pendiente',
    estado_reserva: 'Pendiente',
    tipo_habitacion: 'Doble',
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroPago, setFiltroPago] = useState(false);
  const [filtroReserva, setFiltroReserva] = useState(false);
  const [filtroColor, setFiltroColor] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [reservasPerPage] = useState(20); // Número de reservas por página

  const fetchReservas = async () => {
    try {
      const response = await fetch(`http://localhost:5000/reservas`);
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const data = await response.json();
      setReservas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchReservas();
    const interval = setInterval(fetchReservas, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = (reserva) => {
    setEditReservaId(reserva.id);
    setEditData({
      nombre: reserva.nombre,
      apellido: reserva.apellido,
      mail: reserva.mail,
      estado_pago: reserva.estado_pago,
      estado_reserva: reserva.estado_reserva,
      tipo_habitacion: reserva.tipo_habitacion,
      fecha_checkin: reserva.fecha_checkin.split('T')[0],
      fecha_checkout: reserva.fecha_checkout.split('T')[0],
    });
  };

  const handleSaveEdit = async () => {
    try {
      const { fecha_checkin, fecha_checkout, ...dataToUpdate } = editData; // Excluir fechas
  
      const response = await fetch(`http://localhost:5000/reservas/${editReservaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate), // Solo se envían los campos que queremos actualizar
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar la reserva');
      }
  
      setEditReservaId(null);
      fetchReservas();
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleCancelEdit = () => {
    setEditReservaId(null);
    setEditData({
      nombre: '',
      apellido: '',
      mail: '',
      estado_pago: 'Pendiente',
      estado_reserva: 'Pendiente',
      tipo_habitacion: 'Doble',
      fecha_checkin: '',
      fecha_checkout: '',
    });
  };

  const handleDelete = async (id) => {
    // Mostrar un aviso de confirmación
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta reserva?");
    
    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:5000/reservas/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la reserva');
            }

            fetchReservas(); // Volver a obtener las reservas después de eliminar
        } catch (err) {
            setError(err.message); // Guardar el error en el estado
        }
    }
};


  const filteredReservas = reservas
    .filter((reserva) => {
      return (
        reserva.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.mail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => b.id - a.id);

  const reservasFiltradas = filteredReservas.filter(reserva => {
    const estadoPago = reserva.estado_pago === 'Pendiente';
    const estadoReserva = reserva.estado_reserva === 'Pendiente';

    return (
      (!filtroPago || estadoPago) &&
      (!filtroReserva || estadoReserva)
    );
  });

  // Paginación lógica
  const indexOfLastReserva = currentPage * reservasPerPage;
  const indexOfFirstReserva = indexOfLastReserva - reservasPerPage;
  const currentReservas = reservasFiltradas.slice(indexOfFirstReserva, indexOfLastReserva);

  const obtenerColorFila = (estado_pago, estado_reserva) => {
    if (estado_pago === 'Pendiente' && estado_reserva === 'Pendiente') {
      return 'rgb(252,165,165)';
    } else if (estado_pago === 'Pendiente' || estado_reserva === 'Pendiente') {
      return '#FED7AA';
    } else {
      return '#D9F99D';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  // Cambia de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(reservasFiltradas.length / reservasPerPage);

  const exportToCSV = (data) => {
    // Convierte los datos a CSV
    const csvRows = [];
    
    // Extrae los encabezados
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
  
    // Extrae los datos
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`; // Escapa las comillas
      });
      csvRows.push(values.join(','));
    }
  
    // Crea el contenido del archivo CSV
    const csvString = csvRows.join('\n');
    return csvString;
  };
  
  const downloadCSV = (data) => {
    const csvString = exportToCSV(data);
    const bom = '\uFEFF'; // Añadir BOM
    const blob = new Blob([bom + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'reservas.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  

 
  

  return (
    <div className='m-6'>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className='flex gap-4'>
        <div className='flex items-center mx-4'>
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 py-1 m-3"
          />
          <p>
            <SearchIcon className='text-gray-500' />
          </p>
        </div>

        <div className='flex mt-4 gap-4'>
          <label>
            <input
              type="checkbox"
              checked={filtroPago}
              onChange={() => setFiltroPago(!filtroPago)}
              className='mr-2'
            />
            Pago Pendiente
          </label>
          <label className='ml-4 '>
            <input
              type="checkbox"
              checked={filtroReserva}
              onChange={() => setFiltroReserva(!filtroReserva)}
              className='mr-2'
            />
            Reserva Pendiente
          </label>
          <label className='ml-4 '>
            <input
              type="checkbox"
              checked={filtroColor}
              onChange={() => setFiltroColor(!filtroColor)}
              className='mr-2'
            />
            Colores
          </label>
        </div>
      </div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr>
            <th className="border-b border-gray-300 px-2 py-2 text-left">ID</th>
            <th className="border-b border-gray-300 px-2 py-2 text-left">Nombre</th>
            <th className="border-b border-gray-300 px-2 py-2 text-left">Apellido</th>
            <th className="border-b border-gray-300 px-2 py-2 text-left">Email</th>
            <th className="border-b border-gray-300 px-2 py-2 text-left">Estado Pago</th>
            <th className="border-b border-gray-300 px-2 py-2 text-left">Estado Reserva</th>
            <th className="border-b border-gray-300 px-2 py-2 text-left">Tipo Habitación</th>
            <th className="border-b border-gray-300 px-2 py-2 text-left">Fecha Check-in</th>
            <th className="border-b border-gray-300 px-2 py-2 text-left">Fecha Check-out</th>
            <th className="border-b border-gray-300 px-2 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentReservas.map((reserva) => (
            <React.Fragment key={reserva.id}>
              {editReservaId === reserva.id ? (
                <tr style={filtroColor ? { backgroundColor: obtenerColorFila(reserva.estado_pago, reserva.estado_reserva) } : {}}>
                  <td className="border-b border-gray-300 px-2 py-2">{reserva.id}</td>
                  <td className="border-b border-gray-300 px-2 py-2">
                    <input
                      type="text"
                      name="nombre"
                      value={editData.nombre}
                      onChange={handleEditChange}
                      className="border py-0.5"
                    />
                  </td>
                  <td className="border-b border-gray-300 px-2 py-2">
                    <input
                      type="text"
                      name="apellido"
                      value={editData.apellido}
                      onChange={handleEditChange}
                      className="border py-0.5"
                    />
                  </td>
                  <td className="border-b border-gray-300 px-2 py-2">
                    <input
                      type="text"
                      name="mail"
                      value={editData.mail}
                      onChange={handleEditChange}
                      className="border py-0.5"
                    />
                  </td>
                  <td className="border-b border-gray-300 px-2 py-2">
                    <select
                      name="estado_pago"
                      value={editData.estado_pago}
                      onChange={handleEditChange}
                      className="border py-0.5"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmado">Confirmado</option>
                    </select>
                  </td>
                  <td className="border-b border-gray-300 px-2 py-2">
                    <select
                      name="estado_reserva"
                      value={editData.estado_reserva}
                      onChange={handleEditChange}
                      className="border py-0.5"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmado">Confirmado</option>
                    </select>
                  </td>
                  <td className="border-b border-gray-300 px-2 py-2">
                  <select
                    value={editData.tipo_habitacion}
                    onChange={(e) => setEditData({ ...editData, tipo_habitacion: e.target.value })}
                    className="border py-0.5"
                  >
                    <option value="Doble">Doble</option>
                    <option value="Cuádruple">Cuádruple</option>
                  </select>
                  </td>
                  <td className="border-b border-gray-300 px-2 py-2">
                    <input
                      type="date"
                      name="fecha_checkin"
                      value={editData.fecha_checkin}
                      onChange={handleEditChange}
                      className=" bg-transparent py-0.5"
                      readOnly
                    />
                  </td>
                  <td className="border-b border-gray-300 px-2 py-2">
                    <input
                      type="date"
                      name="fecha_checkout"
                      value={editData.fecha_checkout}
                      onChange={handleEditChange}
                      className=" bg-transparent py-0.5"
                      readOnly
                    />
                  </td>
                  <td className="border-b border-gray-300 px-2 py-2 flex gap-2">
                    <button onClick={handleSaveEdit} className="bg-blue-500 text-white p-1 rounded">
                      <SaveIcon />
                    </button>
                    <button onClick={handleCancelEdit} className="bg-red-500 text-white p-1 rounded">
                      <CloseIcon />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr style={filtroColor ? { backgroundColor: obtenerColorFila(reserva.estado_pago, reserva.estado_reserva) } : {}}>
                  <td className="border-b border-gray-300 px-2 py-2">{reserva.id}</td>
                  <td className="border-b border-gray-300 px-2 py-2">{reserva.nombre}</td>
                  <td className="border-b border-gray-300 px-2 py-2">{reserva.apellido}</td>
                  <td className="border-b border-gray-300 px-2 py-2">{reserva.mail}</td>
                  <td className="border-b border-gray-300 px-2 py-2">{reserva.estado_pago}</td>
                  <td className="border-b border-gray-300 px-2 py-2">{reserva.estado_reserva}</td>
                  <td className="border-b border-gray-300 px-2 py-2">{reserva.tipo_habitacion}</td>
                  <td className="border-b border-gray-300 px-2 py-2">{formatDate(reserva.fecha_checkin)}</td>
                  <td className="border-b border-gray-300 px-2 py-2">{formatDate(reserva.fecha_checkout)}</td>
                  <td className="border-b border-gray-300 px-2 py-2 flex gap-2">
                    <button onClick={() => handleEditClick(reserva)} className="bg-green-500 text-white p-1 rounded">
                      <EditIcon />
                    </button>
                    <button onClick={() => handleDelete(reserva.id)} className="bg-red-500 text-white p-1 rounded">
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button className='my-4 bg-black font-semibold text-white p-2 rounded-md ' onClick={() => downloadCSV(reservas)}>Exportar a CSV <Download/></button>

      {/* Paginación */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 p-2 rounded"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 p-2 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ReservasList;
