// routes/proveedorRoutes.js
const express = require('express');
const proveedorController = require('../controllers/proveedorController');
const router = express.Router();

router.get('/proveedores', proveedorController.obtenerProveedores);
router.get('/proveedores/:id', proveedorController.obtenerProveedorPorId);
router.post('/proveedores', proveedorController.crearProveedor);
router.put('/proveedores/:id', proveedorController.actualizarProveedor);
router.delete('/proveedores/:id', proveedorController.eliminarProveedor);

module.exports = router;
