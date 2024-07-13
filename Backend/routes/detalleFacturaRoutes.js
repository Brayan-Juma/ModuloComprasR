// routes/detalleFacturaRoutes.js
const express = require('express');
const detalleFacturaController = require('../controllers/detalleFacturaController');
const router = express.Router();

router.get('/detalles-factura', detalleFacturaController.obtenerDetallesFactura);
router.get('/detalles-factura/:id', detalleFacturaController.obtenerDetalleFacturaPorId);
router.post('/detalles-factura', detalleFacturaController.crearDetalleFactura);
router.put('/detalles-factura/:id', detalleFacturaController.actualizarDetalleFactura);
router.delete('/detalles-factura/:id', detalleFacturaController.eliminarDetalleFactura);

module.exports = router;
