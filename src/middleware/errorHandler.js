const AppError = require('../errors/AppError');

/**
 * Middleware para manejo centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
    // Log del error para debugging
    console.error(' Error:', err);

    // Si es un error de nuestra aplicación (AppError)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    // Si es un error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            status: 'error',
            message: 'Error de validación',
            details: messages
        });
    }

    // Si es un error de casting de MongoDB (e.g., ID inválido)
    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'error',
            message: 'ID inválido'
        });
    }

    // Si es un error de duplicado (unique constraint)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            status: 'error',
            message: `El ${field} ya existe`
        });
    }

    // Cualquier otro error no manejado
    return res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
};

module.exports = errorHandler; 