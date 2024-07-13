const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const proveedorRoutes = require('./routes/proveedorRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const detalleFacturaRoutes = require('./routes/detalleFacturaRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Configura CORS para permitir solicitudes desde tu frontend
app.use(cors({
    origin: 'http://localhost:3000' // Cambia esto a la URL de tu frontend si es diferente
}));

app.use(express.json());

app.use('/api', proveedorRoutes);
app.use('/api', facturaRoutes);
app.use('/api', detalleFacturaRoutes);

// Nueva ruta para obtener productos desde la API externa
app.get('/api/productos', async (req, res) => {
    try {
        console.log('Fetching productos from external API...');
        const response = await fetch('https://inventaioapi20240613085649.azurewebsites.net/api/Producto');
        const productos = await response.json();
        console.log('Productos fetched successfully:', productos);
        res.json(productos);
    } catch (error) {
        console.error('Error fetching productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});
