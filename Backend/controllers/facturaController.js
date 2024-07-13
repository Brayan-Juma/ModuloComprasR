// controllers/facturaController.js
const pool = require('../config/db');

const obtenerFacturas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM facturas');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerFacturaPorId = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM facturas WHERE id = $1', [req.params.id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Factura no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const crearFactura = async (req, res) => {
    const { fecha, proveedor_id, tipo_pago, fecha_vencimiento, total } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO facturas (fecha, proveedor_id, tipo_pago, fecha_vencimiento, total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [fecha, proveedor_id, tipo_pago, fecha_vencimiento, total]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarFactura = async (req, res) => {
    const { fecha, proveedor_id, tipo_pago, fecha_vencimiento, total } = req.body;
    try {
        const result = await pool.query(
            'UPDATE facturas SET fecha = $1, proveedor_id = $2, tipo_pago = $3, fecha_vencimiento = $4, total = $5 WHERE id = $6 RETURNING *',
            [fecha, proveedor_id, tipo_pago, fecha_vencimiento, total, req.params.id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Factura no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminarFactura = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM facturas WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Factura eliminada' });
        } else {
            res.status(404).json({ message: 'Factura no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerFacturas,
    obtenerFacturaPorId,
    crearFactura,
    actualizarFactura,
    eliminarFactura
};
