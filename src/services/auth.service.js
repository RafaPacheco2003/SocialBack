const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth.config');
const userService = require('./user.service');
const User = require('../models/user.model');
const AppError = require('../errors/AppError');

class AuthService {
    async register(userData) {
        // Verificar si el usuario ya existe
        const existingUser = await userService.findByEmail(userData.email);
        if (existingUser) {
            throw AppError.badRequest('El email ya está registrado');
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(userData.password, authConfig.saltRounds);

        // Crear el usuario con la contraseña hasheada
        const userToCreate = {
            ...userData,
            password: hashedPassword
        };

        const user = await userService.create(userToCreate);
        const tokens = this._generateTokens(user);

        // Eliminar la contraseña de la respuesta
        const userResponse = { ...user };
        delete userResponse.password;

        return {
            user: userResponse,
            ...tokens
        };
    }

    async login(email, password) {
        // Buscar usuario por email directamente del modelo para obtener el password
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw AppError.unauthorized('Credenciales inválidas');
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw AppError.unauthorized('Credenciales inválidas');
        }

        const tokens = this._generateTokens(user);

        // Obtener usuario sin password usando el servicio
        const userResponse = await userService.findByEmail(email);

        return {
            user: userResponse,
            ...tokens
        };
    }

    async refreshToken(refreshToken) {
        try {
            // Verificar refresh token
            const decoded = jwt.verify(refreshToken, authConfig.secret);
            
            // Buscar usuario
            const user = await userService.getById(decoded.id);
            if (!user) {
                throw AppError.unauthorized('Usuario no encontrado');
            }

            // Generar nuevos tokens
            const tokens = this._generateTokens(user);

            return tokens;
        } catch (error) {
            throw AppError.unauthorized('Token inválido o expirado');
        }
    }

    _generateTokens(user) {
        const payload = {
            id: user._id || user.id, // Manejar ambos casos
            email: user.email
        };

        return {
            accessToken: jwt.sign(payload, authConfig.secret, { expiresIn: authConfig.expiresIn }),
            refreshToken: jwt.sign(payload, authConfig.secret, { expiresIn: authConfig.refreshExpiresIn })
        };
    }
}

module.exports = new AuthService();