const { validationResult } = require('express-validator');
const AppError = require('../errors/AppError');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw AppError.badRequest(errorMessages.join(', '));
    }
    next();
};

module.exports = validateRequest; 