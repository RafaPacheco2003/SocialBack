const AppError = require('../errors/AppError');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log del error para debugging
    console.error('ERROR 💥', err);

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

    // En desarrollo, enviar el stack trace
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } 
    
    // En producción
    // Error operacional, enviar mensaje al cliente
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } 
    
    // Error de programación o no manejado, enviar mensaje genérico
    return res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
};

module.exports = errorHandler;