const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const UserController = require('../controllers/user.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validate-request.middleware');

// Validaciones
const firstNameValidation = body('firstName')
  .notEmpty().withMessage('El nombre es requerido')
  .trim()
    .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres');

const lastNameValidation = body('lastName')
  .notEmpty().withMessage('El apellido es requerido')
  .trim()
    .isLength({ min: 3, max: 50 }).withMessage('El apellido debe tener entre 3 y 50 caracteres');

const emailValidation = body('email')
  .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email debe ser válido');

const idValidation = param('id')
  .notEmpty().withMessage('El ID es requerido')
  .isMongoId().withMessage('ID no válido');

// Rutas CRUD (todas protegidas con autenticación)
router.use(AuthMiddleware.verifyToken);

router.get('/', UserController.getAll);
router.get('/:id', idValidation, validateRequest, UserController.getById);
router.post('/', [
    firstNameValidation,
  lastNameValidation,
  emailValidation
], UserController.create);
router.put('/:id', [
  idValidation,
    firstNameValidation,
  lastNameValidation,
  emailValidation
], validateRequest, UserController.update);
router.delete('/:id', idValidation, validateRequest, UserController.delete);

module.exports = router;