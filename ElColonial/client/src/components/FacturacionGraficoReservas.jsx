// src/components/FacturacionGrafico.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FacturacionGraficoReservas = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [facturacion, setFacturacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFacturacion = async (selectedYear) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/facturacion/reservas/${selectedYear}`);
      setFacturacion(response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response) {
        setError(err.response.data.message || 'Error al obtener los datos de facturación.');
      } else if (err.request) {
        setError('No se pudo conectar con el servidor.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturacion(year);
  }, [year]);

  const handleYearChange = (e) => {
    const inputYear = parseInt(e.target.value, 10);
    if (!isNaN(inputYear)) {
      setYear(inputYear);
    }
  };

  // Preparar los datos para el gráfico
  const data = {
    labels: facturacion.map(item => item.mes), // Asegúrate de que 'mes' sea el nombre correcto de la columna
    datasets: [
      {
        label: 'Facturación (USD)',
        data: facturacion.map(item => item.total_facturacion), // Asegúrate de que 'total_facturacion' sea el nombre correcto de la columna
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Azul Tailwind
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Facturación Mensual para el Año ${year}`,
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center  p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Facturación Mensual Reservas</h2>
        
        {/* Selector de Año con Input Numérico */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="year-input" className="mb-2 font-medium text-gray-700">Selecciona el año:</label>
          <input
            type="number"
            id="year-input"
            value={year}
            onChange={handleYearChange}
            className="w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center"
            min="2010"
            max={currentYear + 1}
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span className="ml-3 text-gray-700">Cargando datos...</span>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && facturacion.length > 0 && (
          <div className="mt-6">
            <Bar data={data} options={options} />
          </div>
        )}

        {!loading && !error && facturacion.length === 0 && (
          <p className="text-center text-gray-500">No hay datos disponibles para el año seleccionado.</p>
        )}
      </div>
    </div>
  );
};

export default FacturacionGraficoReservas;
