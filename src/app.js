const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/error.middleware');
const imgRoutes = require('./routes/imgRoutes');
// Inicializar express
const app = express();

// Middleware de seguridad y utilidades
app.use(helmet()); // Seguridad
app.use(cors()); // Habilitar CORS
app.use(morgan('dev')); // Logging
app.use(compression()); // Compresión de respuestas

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variables de entorno
const PORT = process.env.PORT || 3000; // Cambiamos el puerto por defecto a 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';

// Conectar a MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => {
        console.error('❌ Error conectando a MongoDB:', err);
        process.exit(1);
    });

// Mejorar el manejo de errores de MongoDB
mongoose.connection.on('error', err => {
    console.error('Error de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('🔌 Desconectado de MongoDB');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

// Rutas API
app.use('/api/imgs', imgRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Ruta de estado de la API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime(),
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: '¡Bienvenido a la API!',
        version: '1.0.0',
        documentation: '/api/docs'
    });
});

// Middleware para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        error: {
            message: 'Ruta no encontrada',
            status: 404
        }
    });
});

// Middleware de manejo de errores global
app.use(errorHandler);

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`
Servidor corriendo en http://localhost:${PORT}
API docs disponible en http://localhost:${PORT}/api/docs
    `);
});

// Manejo de errores del servidor
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${PORT} está en uso. Intentando con el puerto ${PORT + 1}`);
        server.close();
        // Intentar con el siguiente puerto
        app.listen(PORT + 1);
    } else {
        console.error('❌ Error del servidor:', err);
    }
});

module.exports = app;
