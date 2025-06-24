import { Request, Response } from 'express';
import { UserUseCase } from '../../application/UserUseCase';
import { CreateUserRequestDto, GetUserByIdRequestDto, UpdateUserRequestDto } from '../dto/user-request.dto';
import { UserResponseMapper } from '../mapper/user-response.mapper';
import { UserRequestMapper } from '../mapper/user-request.mapper';
import { GetAllUsersResponseDto } from '../dto/user-response.dto';

/**
 * User Controller - Capa de Presentación
 * Maneja las peticiones HTTP de forma limpia sin lógica de negocio
 */
export class UserController {
    constructor(private readonly userUseCase: UserUseCase) {}

    /**
     * Registrar nuevo usuario
     */
    public registerUser = async (req: Request, res: Response): Promise<Response> => {
        const requestDto: CreateUserRequestDto = req.body;
        
        // Convertir DTO a UserEntity
        const userEntity = UserRequestMapper.toUserEntity(requestDto);
        
        // Ejecutar caso de uso
        const user = await this.userUseCase.createUser(userEntity);
        
        // Mapear y retornar respuesta
        const responseDto = UserResponseMapper.toCreateUserResponseDto(user);
        return res.status(201).json(responseDto);
    };

    /**
     * Obtener usuario por ID
     */
    public getUserById = async (req: Request, res: Response): Promise<Response> => {
        const { uuid }: GetUserByIdRequestDto = req.params as any;
        
        const user = await this.userUseCase.getUserById(uuid);
        
        if (!user) {
            return res.status(404).json({
                error: `User with UUID ${uuid} not found`,
                statusCode: 404
            });
        }
        
        const responseDto = UserResponseMapper.toUserResponseDto(user);
        return res.status(200).json(responseDto);
    };

    /**
     * Actualizar usuario
     */
    public updateUser = async (req: Request, res: Response): Promise<Response> => {
        const { uuid } = req.params;
        const requestDto: UpdateUserRequestDto = req.body;
        
        // Convertir DTO a Partial<UserEntity>
        const userEntityUpdates = UserRequestMapper.toPartialUserEntity(requestDto);
        
        // Ejecutar caso de uso
        const user = await this.userUseCase.updateUser(uuid, userEntityUpdates);
        
        // Mapear y retornar respuesta
        const responseDto = UserResponseMapper.toUserResponseDto(user);
        return res.status(200).json(responseDto);
    };

    /**
     * Eliminar usuario
     */
    public deleteUser = async (req: Request, res: Response): Promise<Response> => {
        const { uuid } = req.params;
        
        const deleted = await this.userUseCase.deleteUser(uuid);
        
        if (!deleted) {
            return res.status(500).json({
                error: 'Failed to delete user',
                statusCode: 500
            });
        }
        
        return res.status(204).send();
    };

    /**
     * Obtener todos los usuarios
     */
    public getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
        const users = await this.userUseCase.getAllUsers();
        
        const responseDto: GetAllUsersResponseDto = {
            users: UserResponseMapper.toUserResponseDtoList(users),
            total: users.length
        };
        
        return res.status(200).json(responseDto);
    };

    /**
     * Actualizar último login
     */
    public updateLastLogin = async (req: Request, res: Response): Promise<Response> => {
        const { uuid } = req.params;
        
        const user = await this.userUseCase.updateLastLogin(uuid);
        const responseDto = UserResponseMapper.toUserResponseDto(user);
        
        return res.status(200).json(responseDto);
    };

    /**
     * Activar/Desactivar usuario
     */
    public toggleUserStatus = async (req: Request, res: Response): Promise<Response> => {
        const { uuid } = req.params;
        
        const user = await this.userUseCase.toggleUserStatus(uuid);
        const responseDto = UserResponseMapper.toUserResponseDto(user);
        
        return res.status(200).json(responseDto);
    };

    /**
     * Verificar si usuario existe por email
     */
    public checkUserExistsByEmail = async (req: Request, res: Response): Promise<Response> => {
        const { email } = req.params;
        
        const exists = await this.userUseCase.userExistsByEmail(email);
        
        return res.status(200).json({ exists });
    };

    /**
     * Verificar si usuario existe por ID
     */
    public checkUserExistsById = async (req: Request, res: Response): Promise<Response> => {
        const { uuid } = req.params;
        
        const exists = await this.userUseCase.userExistsById(uuid);
        
        return res.status(200).json({ exists });
    };
}