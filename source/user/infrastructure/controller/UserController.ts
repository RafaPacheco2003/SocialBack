import { Request, Response } from 'express';
import { UserUseCase } from '../../application/UserUseCase';
import { CreateUserRequestDto, GetUserByIdRequestDto, UpdateUserRequestDto } from '../dto/user-request.dto';
import { UserResponseMapper } from '../mapper/user-response.mapper';
import { UserRequestMapper } from '../mapper/user-request.mapper';
import { ErrorResponseDto, GetAllUsersResponseDto } from '../dto/user-response.dto';

export class UserController {
    constructor(private userUseCase: UserUseCase) {}

    public registerUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const requestDto: CreateUserRequestDto = req.body;
            
            // Extraer parámetros del DTO
            const params = UserRequestMapper.extractCreateUserParams(requestDto);
            
            // Ejecutar use case con parámetros individuales
            const user = await this.userUseCase.registerUser(
                params.firstName,
                params.lastName,
                params.phoneNumber,
                params.email,
                params.password
            );
            
            // Mapear entidad a response DTO
            const responseDto = UserResponseMapper.toCreateUserResponseDto(user);
            
            return res.status(201).json(responseDto);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const errorResponse: ErrorResponseDto = {
                error: errorMessage,
                statusCode: 400
            };
            return res.status(400).json(errorResponse);
        }
    }

    public getUserById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { uuid }: GetUserByIdRequestDto = req.params as any;
            
            const user = await this.userUseCase.getUserById(uuid);
            
            if (!user) {
                const errorResponse: ErrorResponseDto = {
                    error: `User with UUID ${uuid} not found`,
                    statusCode: 404
                };
                return res.status(404).json(errorResponse);
            }
            
            const responseDto = UserResponseMapper.toUserResponseDto(user);
            return res.status(200).json(responseDto);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const errorResponse: ErrorResponseDto = {
                error: errorMessage,
                statusCode: 500
            };
            return res.status(500).json(errorResponse);
        }
    }

    public updateUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { uuid } = req.params;
            const requestDto: UpdateUserRequestDto = req.body;
            
            // Extraer parámetros del DTO
            const params = UserRequestMapper.extractUpdateUserParams(requestDto);
            
            // Ejecutar use case con parámetros individuales
            const user = await this.userUseCase.updateUser(
                uuid,
                params.firstName,
                params.lastName,
                params.phoneNumber,
                params.email,
                params.password,
                params.isActive
            );
            
            // Mapear entidad a response DTO
            const responseDto = UserResponseMapper.toUserResponseDto(user);
            
            return res.status(200).json(responseDto);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const statusCode = errorMessage.includes('not found') ? 404 : 400;
            const errorResponse: ErrorResponseDto = {
                error: errorMessage,
                statusCode
            };
            return res.status(statusCode).json(errorResponse);
        }
    }

    public deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { uuid } = req.params;
            
            const deleted = await this.userUseCase.deleteUser(uuid);
            
            if (!deleted) {
                const errorResponse: ErrorResponseDto = {
                    error: 'Failed to delete user',
                    statusCode: 500
                };
                return res.status(500).json(errorResponse);
            }
            
            return res.status(204).send();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const statusCode = errorMessage.includes('not found') ? 404 : 500;
            const errorResponse: ErrorResponseDto = {
                error: errorMessage,
                statusCode
            };
            return res.status(statusCode).json(errorResponse);
        }
    }

    public getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
        try {
            const users = await this.userUseCase.getAllUsers();
            
            const responseDto: GetAllUsersResponseDto = {
                users: UserResponseMapper.toUserResponseDtoList(users),
                total: users.length
            };
            
            return res.status(200).json(responseDto);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const errorResponse: ErrorResponseDto = {
                error: errorMessage,
                statusCode: 500
            };
            return res.status(500).json(errorResponse);
        }
    }
}