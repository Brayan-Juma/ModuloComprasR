import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Proveedores.css';


const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [proveedoresPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [formData, setFormData] = useState({
        cedula_ruc: '',
        nombre_completo: '',
        ciudad: '',
        tipo_proveedor: '',
        direccion: '',
        telefono: '',
        email: '',
        estado: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/proveedores');
                const data = await response.json();
                setProveedores(data);
            } catch (error) {
                console.error('Error fetching proveedores:', error);
            }
        };

        fetchProveedores();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const transformedFormData = {
            ...formData,
            estado: formData.estado === 'Activo' ? true : false,
        };
        try {
            const response = await fetch(`http://localhost:5000/api/proveedores${isEditing ? `/${formData.id}` : ''}`, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transformedFormData)
            });
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const newProveedor = await response.json();
            if (isEditing) {
                setProveedores(proveedores.map(proveedor => (proveedor.id === newProveedor.id ? newProveedor : proveedor)));
                toast.success('Proveedor actualizado con éxito');
            } else {
                setProveedores([...proveedores, newProveedor]);
                toast.success('Proveedor agregado con éxito');
            }
            setShowModal(false);
            setIsEditing(false);
            setFormData({
                cedula_ruc: '',
                nombre_completo: '',
                ciudad: '',
                tipo_proveedor: '',
                direccion: '',
                telefono: '',
                email: '',
                estado: ''
            });
        } catch (error) {
            console.error('Error adding/updating proveedor:', error);
            toast.error('Error al procesar la solicitud');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/proveedores/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            setProveedores(proveedores.filter(proveedor => proveedor.id !== id));
            toast.success('Proveedor eliminado con éxito');
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Error deleting proveedor:', error);
            toast.error('Error al eliminar el proveedor');
        }
    };

    const handleEdit = (proveedor) => {
        const transformedProveedor = {
            ...proveedor,
            estado: proveedor.estado ? 'Activo' : 'Inactivo',
        };
        setFormData(transformedProveedor);
        setShowModal(true);
        setIsEditing(true);
    };

    const handleAdd = () => {
        setFormData({
            cedula_ruc: '',
            nombre_completo: '',
            ciudad: '',
            tipo_proveedor: '',
            direccion: '',
            telefono: '',
            email: '',
            estado: ''
        });
        setShowModal(true);
        setIsEditing(false);
    };

    const handleConfirmDelete = (proveedor) => {
        setSelectedProveedor(proveedor);
        setShowConfirmModal(true);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * proveedoresPerPage;
    const filteredProveedores = proveedores.filter(proveedor =>
        proveedor.nombre_completo.toLowerCase().includes(searchValue.toLowerCase())
    );
    const currentProveedores = filteredProveedores.slice(offset, offset + proveedoresPerPage);

    return (
        <div className="proveedores">
            <h2>Lista de Proveedores</h2>
            <div className="actions">
                <button onClick={handleAdd}>
                    <FaPlus /> Agregar Proveedor
                </button>
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Buscar por Nombre"
                    />
                </div>
            </div>
            <table className="proveedores-table">
                <thead>
                    <tr>
                        <th>Editar</th>
                        <th>Eliminar</th>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Cédula/RUC</th>
                        <th>Ciudad</th>
                        <th>Tipo de Proveedor</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProveedores.map((proveedor) => (
                        <tr key={proveedor.id}>
                            <td>
                                <button className="editar" onClick={() => handleEdit(proveedor)}><FaEdit /></button>
                            </td>
                            <td>
                                <button className="eliminar" onClick={() => handleConfirmDelete(proveedor)}><FaTrash /></button>
                            </td>
                            <td>{proveedor.id}</td>
                            <td>{proveedor.nombre_completo}</td>
                            <td>{proveedor.cedula_ruc}</td>
                            <td>{proveedor.ciudad}</td>
                            <td>{proveedor.tipo_proveedor}</td>
                            <td>{proveedor.direccion}</td>
                            <td>{proveedor.telefono}</td>
                            <td>{proveedor.email}</td>
                            <td className={proveedor.estado ? "proveedor-activo" : "proveedor-inactivo"}>
                                {proveedor.estado ? <FaCheckCircle /> : <FaTimesCircle />}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={Math.ceil(filteredProveedores.length / proveedoresPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>{isEditing ? 'Editar Proveedor' : 'Agregar Proveedor'}</h2>
                        <form onSubmit={handleSubmit}>

                            <input type="text" id="cedula_ruc" name="cedula_ruc" placeholder="Cédula/RUC" value={formData.cedula_ruc} onChange={handleChange} required />

                            <input type="text" id="nombre_completo" name="nombre_completo" placeholder="Nombre Completo" value={formData.nombre_completo} onChange={handleChange} required />

                            <input type="text" id="ciudad" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} required />
                            <label htmlFor="tipo_proveedor">Tipo de Proveedor</label>
                            <select id="tipo_proveedor" name="tipo_proveedor" value={formData.tipo_proveedor} onChange={handleChange} required>
                                <option value="" disabled>Selecciona el Tipo de Proveedor</option>
                                <option value="Crédito">Crédito</option>
                                <option value="Contado">Contado</option>
                            </select>

                            <input type="text" id="direccion" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} required />

                            <input type="text" id="telefono" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />

                            <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <label htmlFor="estado">Estado</label>
                            <select id="estado" name="estado" value={formData.estado} onChange={handleChange} required>
                                <option value="" disabled>Selecciona el Estado</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                            <button type="submit">{isEditing ? 'Actualizar' : 'Agregar'}</button>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirmar Eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar a {selectedProveedor && selectedProveedor.nombre_completo}?</p>
                        <div className="confirm-buttons">
                            <button className="confirm-delete" onClick={() => handleDelete(selectedProveedor.id)}>Eliminar</button>
                            <button className="confirm-cancel" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Proveedores;
