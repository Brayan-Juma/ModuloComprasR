import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../styles/Productos.css';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/productos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                const data = await response.json();
                console.log('Datos obtenidos de la API:', data);
                setProductos(data);
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };

        fetchProductos();
    }, []);

    const filteredProductos = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div className="productos">
            <h2>Lista de Productos</h2>
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Buscar por Nombre"
                />
            </div>
            <table className="productos-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Grava IVA</th>
                        <th>Costo</th>
                        <th>PVP</th>
                        <th>Estado</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProductos.map((producto) => (
                        <tr key={producto.iD_Producto}>
                            <td>{producto.iD_Producto}</td>
                            <td>{producto.codigo}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.gravaIVA ? 'Sí' : 'No'}</td>
                            <td>{producto.costo}</td>
                            <td>{producto.pvp}</td>
                            <td>{producto.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>{producto.stockProducto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Productos;
