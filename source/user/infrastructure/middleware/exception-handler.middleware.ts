import { Request, Response, NextFunction } from 'express';
import { ErrorResponseDto } from '../dto/user-response.dto';

// Simple error handler middleware
export const handleExceptions = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    console.error('Error:', error.message);
    
    // Mapear errores a códigos HTTP
    const errorMap: Record<string, number> = {
        'UserNotFoundError': 404,
        'UserAlreadyExistsError': 409,
        'UserInactiveError': 400,
        'InvalidUserStateError': 400,
        'ValidationError': 400
    };

    const statusCode = errorMap[error.name] || 500;
    
    const errorResponse: ErrorResponseDto = {
        error: error.name,
        message: error.message,
        statusCode
    };

    return res.status(statusCode).json(errorResponse);
};

// Simple async wrapper
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
