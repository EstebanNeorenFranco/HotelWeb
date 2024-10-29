import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservasList from './ReservasList';
import AlquileresList from './AlquileresList';
import FacturacionGraficoReservas from './FacturacionGraficoReservas';
import FacturacionGraficoAlquileres from './FacturacionGraficoAlquileres';
import ReservasPage from './ReservasPage';
import EditarHabitacion from './EditarHabitacion';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ListAlt,
  Home,
  AddCircle,
  Edit,
  MonetizationOn,
  AttachMoney,
  Logout,
} from '@mui/icons-material';

const PanelOpciones = () => {
  const [currentComponent, setCurrentComponent] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    navigate('/login'); // Redirigir a la página de inicio de sesión
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case 'reservas':
        return <ReservasList />;
      case 'alquileres':
        return <AlquileresList />;
      case 'facturacionReservas':
        return <FacturacionGraficoReservas />;
      case 'facturacionAlquileres':
        return <FacturacionGraficoAlquileres />;
      case 'reservasPage':
        return <ReservasPage />;
      case 'editarHabitacion':
        return <EditarHabitacion />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center  p-2 bg-gray-100 min-h-screen">
      <Card className="w-full shadow-lg rounded-lg">
        <CardContent>
          
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Tooltip title="Ver la lista de reservas">
                <Button
                  onClick={() => setCurrentComponent('reservas')}
                  color="primary"
                  startIcon={<ListAlt />}
                  variant="outlined"
                  fullWidth
                >
                  Lista de Reservas
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Ver la lista de alquileres">
                <Button
                  onClick={() => setCurrentComponent('alquileres')}
                  color="primary"
                  startIcon={<Home />}
                  variant="outlined"
                  fullWidth
                >
                  Lista de Alquileres
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Agregar una nueva reserva">
                <Button
                  onClick={() => setCurrentComponent('reservasPage')}
                  color="primary"
                  startIcon={<AddCircle />}
                  variant="outlined"
                  fullWidth
                >
                  Agregar Reserva
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Modificar precios de habitaciones">
                <Button
                  onClick={() => setCurrentComponent('editarHabitacion')}
                  color="primary"
                  startIcon={<Edit />}
                  variant="outlined"
                  fullWidth
                >
                  Modificar Precios
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Ver gráfico de facturación de reservas">
                <Button
                  onClick={() => setCurrentComponent('facturacionReservas')}
                  color="primary"
                  startIcon={<MonetizationOn />}
                  variant="outlined"
                  fullWidth
                >
                  Facturación Gráfico Reservas
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Ver gráfico de facturación de alquileres">
                <Button
                  onClick={() => setCurrentComponent('facturacionAlquileres')}
                  color="primary"
                  startIcon={<AttachMoney />}
                  variant="outlined"
                  fullWidth
                >
                  Facturación Gráfico Alquileres
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
          <div className="mt-8">{renderComponent()}</div>
          <div className="mt-6 text-center mb-4">
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              endIcon={<Logout />}
              
            >
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PanelOpciones;
