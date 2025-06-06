const AppError = require('../errors/AppError');

const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    // Errores de Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            status: 'error',
            message: 'Error de validación',
            details: messages
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'error',
            message: 'ID inválido'
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            status: 'error',
            message: `El ${field} ya existe`
        });
    }

    // Error por defecto
    return res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
};

module.exports = errorHandler; 