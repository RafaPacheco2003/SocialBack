import { UserValue } from "../domain/user-value";
import { UserRepository } from "../domain/user-repository";
import { UserEntity } from "../domain/user-entity";

export class UserUseCase {
    constructor(private userRepository: UserRepository) {}

    public async getUserById(uuid: string): Promise<UserEntity | null> {
        const user = await this.userRepository.findById(uuid);
        return user;
    }

    public async getUserByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.userRepository.findByEmail(email);
        return user;
    }

    public async createUser(
        userEntity: UserEntity
    ): Promise<UserEntity> {
        // Verificar si el usuario ya existe por email
        const existingUser = await this.userRepository.findByEmail(userEntity.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Crear nueva entidad de usuario usando los datos de la entidad recibida
        const newUserValue = new UserValue(
            null, // UUID se generará automáticamente
            userEntity.firstName,
            userEntity.lastName,
            userEntity.phoneNumber,
            userEntity.email,
            userEntity.password,
            new Date(), // Fecha de creación
            userEntity.isActive
        );

        return await this.userRepository.create(newUserValue);
    }

    public async updateUser(
        uuid: string,
        userEntityUpdates: Partial<UserEntity>
    ): Promise<UserEntity> {
        const existingUser = await this.userRepository.findById(uuid);
        if (!existingUser) {
            throw new Error('User not found');
        }

        // Si se está actualizando el email, verificar que no exista otro usuario con ese email
        if (userEntityUpdates.email && userEntityUpdates.email !== existingUser.email) {
            const userWithEmail = await this.userRepository.findByEmail(userEntityUpdates.email);
            if (userWithEmail) {
                throw new Error('User with this email already exists');
            }
        }

        // Crear nueva entidad con los datos actualizados
        const updatedUserValue = new UserValue(
            existingUser.uuid,
            userEntityUpdates.firstName || existingUser.firstName,
            userEntityUpdates.lastName || existingUser.lastName,
            userEntityUpdates.phoneNumber || existingUser.phoneNumber,
            userEntityUpdates.email || existingUser.email,
            userEntityUpdates.password || existingUser.password,
            existingUser.createdAt,
            userEntityUpdates.isActive !== undefined ? userEntityUpdates.isActive : existingUser.isActive
        );

        // Preservar lastLogin si existe
        if (existingUser.lastLogin) {
            updatedUserValue.lastLogin = existingUser.lastLogin;
        }

        return await this.userRepository.update(updatedUserValue);
    }

    public async deleteUser(uuid: string): Promise<boolean> {
        const existingUser = await this.userRepository.findById(uuid);
        if (!existingUser) {
            throw new Error('User not found');
        }
        
        return await this.userRepository.delete(uuid);
    }

    public async getAllUsers(): Promise<UserEntity[]> {
        return this.userRepository.findAll();
    }

    /**
     * Actualizar el último login de un usuario
     */
    public async updateLastLogin(uuid: string): Promise<UserEntity> {
        const existingUser = await this.userRepository.findById(uuid);
        if (!existingUser) {
            throw new Error('User not found');
        }

        if (!existingUser.isActive) {
            throw new Error('Cannot update login for inactive user');
        }

        // Crear nueva entidad con el último login actualizado
        const updatedUserValue = new UserValue(
            existingUser.uuid,
            existingUser.firstName,
            existingUser.lastName,
            existingUser.phoneNumber,
            existingUser.email,
            existingUser.password,
            existingUser.createdAt,
            existingUser.isActive
        );

        updatedUserValue.lastLogin = new Date();

        return await this.userRepository.update(updatedUserValue);
    }

    /**
     * Activar/Desactivar usuario
     */
    public async toggleUserStatus(uuid: string): Promise<UserEntity> {
        const existingUser = await this.userRepository.findById(uuid);
        if (!existingUser) {
            throw new Error('User not found');
        }

        return await this.updateUser(uuid, { isActive: !existingUser.isActive });
    }

    /**
     * Verificar si un usuario existe por email
     */
    public async userExistsByEmail(email: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        return user !== null;
    }

    /**
     * Verificar si un usuario existe por UUID
     */
    public async userExistsById(uuid: string): Promise<boolean> {
        const user = await this.userRepository.findById(uuid);
        return user !== null;
    }
}
