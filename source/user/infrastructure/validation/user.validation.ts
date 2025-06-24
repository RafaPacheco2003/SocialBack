import { body, param } from 'express-validator';

export const createUserValidation = [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    
    body('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone('any')
        .withMessage('Phone number must be valid'),
    
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

export const updateUserValidation = [
    param('uuid')
        .notEmpty()
        .withMessage('UUID is required')
        .isUUID()
        .withMessage('UUID must be valid'),
    
    body('firstName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    
    body('phoneNumber')
        .optional()
        .isMobilePhone('any')
        .withMessage('Phone number must be valid'),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email must be valid'),
    
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean')
];

export const getUserByIdValidation = [
    param('uuid')
        .notEmpty()
        .withMessage('UUID is required')
        .isUUID()
        .withMessage('UUID must be valid')
];

export const deleteUserValidation = [
    param('uuid')
        .notEmpty()
        .withMessage('UUID is required')
        .isUUID()
        .withMessage('UUID must be valid')
];
