const AuthService = require('../services/auth.service');

class AuthController {
    async register(req, res, next) {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const tokens = await AuthService.refreshToken(refreshToken);
            res.status(200).json({
                status: 'success',
                data: tokens
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController(); 