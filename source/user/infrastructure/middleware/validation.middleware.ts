import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ErrorResponseDto } from '../dto/user-response.dto';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void | Response => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorResponse: ErrorResponseDto = {
            error: 'Validation failed',
            message: errors.array().map(error => error.msg).join(', '),
            statusCode: 400
        };
        return res.status(400).json(errorResponse);
    }
    
    next();
};
