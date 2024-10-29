import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ContactoPage from './components/ContactoPage';
import ServiciosPage from './components/ServiciosPage';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ReservasButton from './components/ReservasButton';
import Contact from './components/Contac';
import ReservasPage from './components/ReservasPage';
import Gracias from './components/Gracias';
import Login from './components/Login';
import ReservasList from './components/ReservasList';
import FacturacionGraficoAlquileres from './components/FacturacionGraficoAlquileres';
import AlquileresList from './components/AlquileresList';
import FacturacionGraficoReservas from './components/FacturacionGraficoReservas';
import PanelOpciones from './components/PanelOpciones';
import MailEnviar from './components/MailEnviar';


const isAuthenticated = () => !!localStorage.getItem('token');

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <ReservasButton />
              <Contact />
            </>
          } />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/gracias" element={<Gracias />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mail" element={<MailEnviar />} />
          
          
          <Route path="/protected" element={<ProtectedRoute element={<PanelOpciones />} />} />
          <Route path="/PanelOpciones" element={<ProtectedRoute element={<PanelOpciones />} />} />
          <Route path="/FacturacionGraficoReservas" element={<ProtectedRoute element={<FacturacionGraficoReservas />} />} />
          <Route path="/ListaReservas" element={<ProtectedRoute element={<ReservasList />} />} />
          <Route path="/FacturacionGrafico" element={<ProtectedRoute element={<FacturacionGraficoAlquileres />} />} />
          <Route path="/AlquileresList" element={<ProtectedRoute element={<AlquileresList />} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
