const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validate-request.middleware');

// Validaciones
const registerValidation = [
    body('firstName')
        .notEmpty().withMessage('El nombre es requerido')
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('lastName')
        .notEmpty().withMessage('El apellido es requerido')
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('El apellido debe tener entre 3 y 50 caracteres'),
    body('email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email debe ser válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const loginValidation = [
    body('email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email debe ser válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
];

const refreshTokenValidation = [
    body('refreshToken')
        .notEmpty().withMessage('El refresh token es requerido')
];

// Rutas de autenticación
router.post('/register', registerValidation, validateRequest, AuthController.register);
router.post('/login', loginValidation, validateRequest, AuthController.login);
router.post('/refresh-token', refreshTokenValidation, validateRequest, AuthController.refreshToken);

module.exports = router; 