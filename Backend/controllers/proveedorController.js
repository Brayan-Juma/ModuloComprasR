// controllers/proveedorController.js
const proveedorModel = require('../models/proveedorModel');

const obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await proveedorModel.obtenerProveedores();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerProveedorPorId = async (req, res) => {
    try {
        const proveedor = await proveedorModel.obtenerProveedorPorId(req.params.id);
        if (proveedor) {
            res.json(proveedor);
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const crearProveedor = async (req, res) => {
    try {
        const nuevoProveedor = await proveedorModel.crearProveedor(req.body);
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        console.error('Error en crearProveedor:', error);
        res.status(500).json({ error: error.message });
    }
};

const actualizarProveedor = async (req, res) => {
    try {
        const proveedorActualizado = await proveedorModel.actualizarProveedor(req.params.id, req.body);
        if (proveedorActualizado) {
            res.json(proveedorActualizado);
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminarProveedor = async (req, res) => {
    try {
        await proveedorModel.eliminarProveedor(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};
