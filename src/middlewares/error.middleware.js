const AppError = require('../errors/AppError');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // En desarrollo, enviar el stack trace
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } 
    // En producción, enviar mensaje simplificado
    else {
        // Error operacional, enviar mensaje al cliente
        if (err instanceof AppError) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } 
        // Error de programación, enviar mensaje genérico
        else {
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Algo salió mal'
            });
        }
    }
};

module.exports = errorHandler; 