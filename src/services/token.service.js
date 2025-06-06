const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const AppError = require('../errors/AppError');

class TokenService {
    generateAccessToken(payload) {
        return jwt.sign(payload, authConfig.secret, { 
            expiresIn: authConfig.expiresIn 
        });
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, authConfig.secret, { 
            expiresIn: authConfig.refreshExpiresIn 
        });
    }

    generateTokenPair(user) {
        const payload = {
            id: user._id || user.id,
            email: user.email
        };

        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        };
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, authConfig.secret);
        } catch (error) {
            throw AppError.unauthorized('Token inválido o expirado');
        }
    }
}

module.exports = new TokenService(); 