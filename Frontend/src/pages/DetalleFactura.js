import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/DetalleFactura.css";

const DetalleFactura = () => {
    const { id } = useParams();
    const today = new Date().toISOString().split("T")[0];
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [items, setItems] = useState([]);
    const [totals, setTotals] = useState({ subtotal: 0, totalIVA: 0, total: 0 });
    const [formData, setFormData] = useState({
        proveedor_nombre: "",
        tipo_proveedor: "",
        fecha: new Date().toISOString().split("T")[0],
        fecha_vencimiento: "",
        producto: "",
        iD_Producto: "",
        precio: "",
        iva: "",
        stock: "",
        cantidad: "",
    });

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/proveedores");
                const data = await response.json();
                setProveedores(data);
            } catch (error) {
                console.error("Error fetching proveedores:", error);
            }
        };

        const fetchProductos = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/productos");
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error("Error fetching productos:", error);
            }
        };

        fetchProveedores();
        fetchProductos();

        if (id) {
            const fetchFactura = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/facturas/${id}`
                    );
                    const data = await response.json();
                    setFormData({
                        proveedor_nombre: data.proveedor_nombre,
                        tipo_proveedor: data.tipo_proveedor,
                        fecha: new Date(data.fecha).toISOString().split("T")[0],
                        fecha_vencimiento: new Date(data.fecha_vencimiento)
                            .toISOString()
                            .split("T")[0],
                        producto: data.producto || "",
                        iD_Producto: data.iD_Producto || "",
                        precio: data.precio || "",
                        iva: data.iva ? "Sí" : "No",
                        stock: data.stock || "",
                        cantidad: data.cantidad || "",
                    });
                } catch (error) {
                    console.error("Error fetching factura:", error);
                }
            };
            fetchFactura();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleProveedorChange = (e) => {
        const selectedOption = proveedores.find(
            (proveedor) => proveedor.cedula_ruc === e.target.value
        );
        setFormData({
            ...formData,
            proveedor_cedula: selectedOption.cedula_ruc,
            proveedor_nombre: selectedOption.nombre_completo,
            tipo_proveedor: selectedOption.tipo_proveedor,
        });
    };

    const handleProductoChange = (e) => {
        const selectedOption = productos.find(
            (producto) => producto.iD_Producto === parseInt(e.target.value)
        );
        if (selectedOption) {
            setFormData({
                ...formData,
                producto: selectedOption.nombre,
                iD_Producto: selectedOption.iD_Producto,
                precio: selectedOption.costo,
                iva: selectedOption.gravaIVA ? "Sí" : "No",
                stock: selectedOption.stockProducto,
            });
        } else {
            setFormData({
                ...formData,
                producto: "",
                iD_Producto: "",
                precio: "",
                iva: "",
                stock: "",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.stock <= 0) {
            alert("Ya no hay este producto.");
            return;
        }

        const ivaRate = formData.iva === "Sí" ? 0.15 : 0;
        const ivaValue = formData.precio * ivaRate * formData.cantidad;
        const subtotal = formData.precio * formData.cantidad + ivaValue;

        const newItem = {
            codigo: formData.iD_Producto,
            descripcion: formData.producto,
            cantidad: formData.cantidad,
            precioUnitario: formData.precio,
            iva: ivaValue.toFixed(2),
            subtotal: subtotal.toFixed(2),
        };

        setItems([...items, newItem]);

        // Update totals
        setTotals(prevTotals => ({
            subtotal: prevTotals.subtotal + formData.precio * formData.cantidad,
            totalIVA: prevTotals.totalIVA + ivaValue,
            total: prevTotals.total + subtotal
        }));

        // Update stock in the database
        const updatedStock = formData.stock - formData.cantidad;
        const selectedOption = productos.find(
            (producto) => producto.iD_Producto === formData.iD_Producto
        );

        try {
            const response = await fetch(`http://localhost:5000/api/productos/${formData.iD_Producto}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...selectedOption, stockProducto: updatedStock }),
            });

            if (response.ok) {
                console.log("Stock updated successfully");

                // Update stock in the local state
                const updatedProductos = productos.map((producto) => {
                    if (producto.iD_Producto === formData.iD_Producto) {
                        return { ...producto, stockProducto: updatedStock };
                    }
                    return producto;
                });
                setProductos(updatedProductos);
            } else {
                console.error("Failed to update stock");
            }
        } catch (error) {
            console.error("Error updating stock:", error);
        }

        // Clear the form data for new entry
        setFormData({
            ...formData,
            producto: "",
            iD_Producto: "",
            precio: "",
            iva: "",
            stock: "",
            cantidad: "",
        });
    };

    const handleGuardar = async () => {
        try {
            // Iterar sobre cada item y hacer una solicitud POST para cada uno
            for (const item of items) {
                const response = await fetch('http://localhost:5000/api/detalles-factura', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        factura_id: id,
                        producto_id: item.codigo,
                        cantidad: item.cantidad,
                        precio_unitario: item.precioUnitario,
                        iva: item.iva,
                        subtotal: item.subtotal,
                    }),
                });

                if (response.ok) {
                    console.log(`Detalle de factura para producto ${item.codigo} guardado correctamente`);
                } else {
                    console.error(`Error al guardar el detalle de factura para producto ${item.codigo}`);
                    alert(`Error al guardar el detalle de factura para producto ${item.codigo}`);
                }
            }

            alert('Todos los detalles de factura se guardaron correctamente');
        } catch (error) {
            console.error('Error al guardar los detalles de factura:', error);
            alert('Error al guardar los detalles de factura');
        }
    };


    return (
        <div className="detalle-factura">
            <h2>Factura Nueva</h2>
            <div className="proveedor">
                <form className="formulario" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="proveedor">Proveedor:</label>
                        <select
                            id="proveedor"
                            name="proveedor_cedula"
                            value={formData.proveedor_cedula}
                            onChange={handleProveedorChange}
                        >
                            <option value="">Seleccionar Proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.cedula_ruc} value={proveedor.cedula_ruc}>
                                    {proveedor.nombre_completo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tipo_proveedor">Tipo de pago:</label>
                        <input
                            type="text"
                            id="tipo_proveedor"
                            name="tipo_proveedor"
                            value={formData.tipo_proveedor}
                            readOnly
                        />
                    </div>

                    <div>
                        <label htmlFor="fecha">Fecha:</label>
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            value={formData.fecha}
                            readOnly
                        />
                    </div>

                    <div>
                        <label htmlFor="fecha_vencimiento">Fecha Vencimiento:</label>
                        <input
                            type="date"
                            id="fecha_vencimiento"
                            name="fecha_vencimiento"
                            min={today}
                            value={formData.fecha_vencimiento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="producto">Producto:</label>
                        <select
                            id="producto"
                            name="iD_Producto"
                            value={formData.iD_Producto}
                            onChange={handleProductoChange}
                        >
                            <option value="">Seleccionar Producto</option>
                            {productos.map((producto) => (
                                <option key={producto.iD_Producto} value={producto.iD_Producto}>
                                    {producto.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="precio">Precio:</label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={formData.precio}
                            readOnly
                        />
                    </div>

                    <div>
                        <label htmlFor="iva">IVA:</label>
                        <input
                            type="text"
                            id="iva"
                            name="iva"
                            value={formData.iva}
                            readOnly
                        />
                    </div>

                    <div>
                        <label htmlFor="stock">Stock:</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            readOnly
                        />
                    </div>

                    <div>
                        <label htmlFor="cantidad">Cantidad:</label>
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="button-container">
                        <button type="submit">Agregar</button>
                    </div>
                </form>
            </div>

            <table className="proveedores-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>IVA</th>
                        <th>SubTotal</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.codigo}</td>
                            <td>{item.descripcion}</td>
                            <td>{item.cantidad}</td>
                            <td>{item.precioUnitario}</td>
                            <td>{item.iva}</td>
                            <td>{item.subtotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="totales">
                <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
                <p>Total IVA: ${totals.totalIVA.toFixed(2)}</p>
                <p>Total: ${totals.total.toFixed(2)}</p>
            </div>

            <div className="button-container-horizontal">
                <button>Cancelar</button>
                <button onClick={handleGuardar}>Guardar</button>
                <button>Imprimir</button>
            </div>
        </div>
    );
};

export default DetalleFactura;
