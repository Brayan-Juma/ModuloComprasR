// controllers/detalleFacturaController.js
const detalleFacturaModel = require('../models/detalleFacturaModel');

const obtenerDetallesFactura = async (req, res) => {
    try {
        const detalles = await detalleFacturaModel.obtenerDetallesFactura();
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerDetalleFacturaPorId = async (req, res) => {
    try {
        const detalle = await detalleFacturaModel.obtenerDetalleFacturaPorId(req.params.id);
        if (detalle) {
            res.json(detalle);
        } else {
            res.status(404).json({ message: 'Detalle de factura no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const crearDetalleFactura = async (req, res) => {
    try {
        const nuevoDetalle = await detalleFacturaModel.crearDetalleFactura(req.body);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarDetalleFactura = async (req, res) => {
    try {
        const detalleActualizado = await detalleFacturaModel.actualizarDetalleFactura(req.params.id, req.body);
        if (detalleActualizado) {
            res.json(detalleActualizado);
        } else {
            res.status(404).json({ message: 'Detalle de factura no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminarDetalleFactura = async (req, res) => {
    try {
        await detalleFacturaModel.eliminarDetalleFactura(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerDetallesFactura,
    obtenerDetalleFacturaPorId,
    crearDetalleFactura,
    actualizarDetalleFactura,
    eliminarDetalleFactura
};
