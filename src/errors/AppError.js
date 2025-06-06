const { StatusCodes } = require('http-status-codes');

/**
 * Clase base para errores de la aplicación
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message) {
        return new AppError(message, 400);
    }

    static unauthorized(message) {
        return new AppError(message, 401);
    }

    static forbidden(message) {
        return new AppError(message, 403);
    }

    static notFound(message) {
        return new AppError(message, 404);
    }

    static internal(message) {
        return new AppError(message || 'Error interno del servidor', 500);
    }

    static conflict(message) {
        return new AppError(message, StatusCodes.CONFLICT);
    }
}

module.exports = AppError; 