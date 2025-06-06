const userService = require('./user.service');
const tokenService = require('./token.service');
const passwordService = require('./password.service');
const User = require('../models/user.model');
const AppError = require('../errors/AppError');
const { UserDTO } = require('../dtos/user.dto');

class AuthService {
    async register(userData) {
        await this._validateNewUser(userData);
        
        const hashedPassword = await passwordService.hash(userData.password);
        const userToCreate = {
            ...userData,
            password: hashedPassword
        };

        const user = await userService.create(userToCreate);
        return this._createAuthResponse(user);
    }

    async login(email, password) {
        const user = await this._validateCredentials(email, password);
        return this._createAuthResponse(user);
    }

    async refreshToken(refreshToken) {
        const decoded = tokenService.verifyToken(refreshToken);
        const user = await this._validateUserExists(decoded.id);
        return tokenService.generateTokenPair(user);
    }

    async _validateNewUser(userData) {
        const existingUser = await userService.findByEmail(userData.email);
        if (existingUser) {
            throw AppError.badRequest('El email ya está registrado');
        }
    }

    async _validateCredentials(email, password) {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw AppError.unauthorized('Credenciales inválidas');
        }

        const isValidPassword = await passwordService.verify(password, user.password);
        if (!isValidPassword) {
            throw AppError.unauthorized('Credenciales inválidas');
        }

        return user;
    }

    async _validateUserExists(userId) {
        const user = await userService.getById(userId);
        if (!user) {
            throw AppError.unauthorized('Usuario no encontrado');
        }
        return user;
    }

    _createAuthResponse(user) {
        const userDTO = new UserDTO(user);
        const tokens = tokenService.generateTokenPair(user);

        return {
            user: userDTO,
            ...tokens
        };
    }
}

module.exports = new AuthService();