const AuthService = require('../services/auth.service');
const AppError = require('../errors/AppError');

class AuthController {
    async register(req, res, next) {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            // Si es un error operacional (AppError), lo enviamos como respuesta
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    status: error.status || 'error',
                    message: error.message
                });
            }
            // Si es otro tipo de error, lo pasamos al manejador global
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.json(result);
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    status: error.status || 'error',
                    message: error.message
                });
            }
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const tokens = await AuthService.refreshToken(refreshToken);
            res.json(tokens);
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    status: error.status || 'error',
                    message: error.message
                });
            }
            next(error);
        }
    }
}

module.exports = new AuthController(); 