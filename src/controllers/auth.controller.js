const AuthService = require('../services/auth.service');

class AuthController {
    async register(req, res, next) {
  
            const result = await AuthService.register(req.body);
            res.status(201).json(result);
       
    }

    async login(req, res, next) {
        
     
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.status(200).json({
                status: 'success',
                data: result
            });
        
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