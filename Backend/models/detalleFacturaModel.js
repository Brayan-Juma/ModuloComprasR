// models/detalleFacturaModel.js
const pool = require('../config/db');

const obtenerDetallesFactura = async () => {
    const result = await pool.query('SELECT * FROM detalle_factura');
    return result.rows;
};

const obtenerDetalleFacturaPorId = async (id) => {
    const result = await pool.query('SELECT * FROM detalle_factura WHERE id = $1', [id]);
    return result.rows[0];
};

const crearDetalleFactura = async (detalle) => {
    const { factura_id, producto_id, cantidad,  precio_unitario, iva,  subtotal } = detalle;
    const result = await pool.query(
        'INSERT INTO detalle_factura (factura_id, producto_id, cantidad, precio_unitario, iva , subtotal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [factura_id, producto_id, cantidad, precio_unitario, iva, subtotal]
    );
    return result.rows[0];
};

const actualizarDetalleFactura = async (id, detalle) => {
    const { factura_id, producto_id, cantidad, precio_unitario, iva, subtotal } = detalle;
    const result = await pool.query(
        'UPDATE detalle_factura SET factura_id = $1, producto_id = $2, cantidad = $3, precio_unitario = $4, iva = $5, subtotal = $6 WHERE id = $7 RETURNING *',
        [factura_id, producto_id, cantidad,precio_unitario, iva, subtotal, id]
    );
    return result.rows[0];
};

const eliminarDetalleFactura = async (id) => {
    await pool.query('DELETE FROM detalle_factura WHERE id = $1', [id]);
};

module.exports = {
    obtenerDetallesFactura,
    obtenerDetalleFacturaPorId,
    crearDetalleFactura,
    actualizarDetalleFactura,
    eliminarDetalleFactura
};
