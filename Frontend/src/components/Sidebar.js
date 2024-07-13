import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/proveedores">Proveedores</Link></li>
          <li><Link to="/facturas">Facturas</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/reportes">Reportes</Link></li>
          <li><Link to="/configuracion">Configuración</Link></li>
          <li><Link to="/accesos">Administrar accesos</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
