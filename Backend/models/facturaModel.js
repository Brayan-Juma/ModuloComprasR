// models/facturaModel.js
const pool = require('../config/db');

const obtenerFacturas = async () => {
    const result = await pool.query('SELECT * FROM facturas');
    return result.rows;
};

const obtenerFacturaPorId = async (id) => {
    const result = await pool.query('SELECT * FROM facturas WHERE id = $1', [id]);
    return result.rows[0];
};

const crearFactura = async (factura) => {
    const { fecha, proveedor_id, tipo_pago, fecha_vencimiento, total } = factura;
    const result = await pool.query(
        'INSERT INTO facturas (fecha, proveedor_id, tipo_pago, fecha_vencimiento, total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [fecha, proveedor_id, tipo_pago, fecha_vencimiento, total]
    );
    return result.rows[0];
};

const actualizarFactura = async (id, factura) => {
    const { fecha, proveedor_id, tipo_pago, fecha_vencimiento, total } = factura;
    const result = await pool.query(
        'UPDATE facturas SET fecha = $1, proveedor_id = $2, tipo_pago = $3, fecha_vencimiento = $4, total = $5 WHERE id = $6 RETURNING *',
        [fecha, proveedor_id, tipo_pago, fecha_vencimiento, total, id]
    );
    return result.rows[0];
};

const eliminarFactura = async (id) => {
    await pool.query('DELETE FROM facturas WHERE id = $1', [id]);
};

module.exports = {
    obtenerFacturas,
    obtenerFacturaPorId,
    crearFactura,
    actualizarFactura,
    eliminarFactura
};

