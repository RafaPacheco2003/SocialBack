const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const CommentController = require('../controllers/comment.controller');

// Validaciones
const contentValidation = body('content')
    .notEmpty().withMessage('El contenido es requerido')
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('El contenido debe tener entre 1 y 500 caracteres');

const authorValidation = body('author')
    .notEmpty().withMessage('El autor es requerido')
    .isMongoId().withMessage('ID de autor no válido');

const postValidation = body('post')
    .notEmpty().withMessage('El post es requerido')
    .isMongoId().withMessage('ID de post no válido');

const idValidation = param('id')
    .notEmpty().withMessage('El ID es requerido')
    .isMongoId().withMessage('ID no válido');

const postIdValidation = param('postId')
    .notEmpty().withMessage('El ID del post es requerido')
    .isMongoId().withMessage('ID de post no válido');

// Rutas CRUD
router.get('/', CommentController.getAll);
router.get('/:id', idValidation, CommentController.getById);
router.get('/post/:postId', postIdValidation, CommentController.getByPost);
router.post('/', [
    contentValidation,
    authorValidation,
    postValidation
], CommentController.create);
router.put('/:id', [
    idValidation,
    contentValidation
], CommentController.update);
router.delete('/:id', idValidation, CommentController.delete);

module.exports = router;
