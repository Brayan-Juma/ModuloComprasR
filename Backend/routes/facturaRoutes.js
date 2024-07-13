// routes/facturaRoutes.js
const express = require('express');
const {
    obtenerFacturas,
    obtenerFacturaPorId,
    crearFactura,
    actualizarFactura,
    eliminarFactura
} = require('../controllers/facturaController');
const router = express.Router();

router.get('/facturas', obtenerFacturas);
router.get('/facturas/:id', obtenerFacturaPorId);
router.post('/facturas', crearFactura);
router.put('/facturas/:id', actualizarFactura);
router.delete('/facturas/:id', eliminarFactura);

module.exports = router;
