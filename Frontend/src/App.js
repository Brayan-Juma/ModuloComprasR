import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import './styles/App.css';
import Facturas from './pages/Facturas';
import Proveedores from './pages/Proveedores';
import Productos from './pages/Productos';
import DetalleFactura from './pages/DetalleFactura';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/facturas" element={<Facturas />} />
            <Route path="/productos" element={<Productos/>}/>
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/facturas/detalle-factura/:id?" element={<DetalleFactura />} /> {/* Nueva ruta */}
            {/* Agrega más rutas según sea necesario */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
