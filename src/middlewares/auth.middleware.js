const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const AppError = require('../errors/AppError');

const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw AppError.unauthorized('No token provided');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        throw AppError.unauthorized('Token error');
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        throw AppError.unauthorized('Token malformatted');
    }

    return token;
};

const verifyToken = (req, res, next) => {
    try {
        const token = extractToken(req);

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                throw AppError.unauthorized('Invalid token');
            }

            req.userId = decoded.id;
            next();
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    verifyToken
}; 