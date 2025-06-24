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

        // Crear nuevo usuario usando el factory method
        const newUserValue = UserValue.createNew(
            userEntity.firstName,
            userEntity.lastName,
            userEntity.phoneNumber,
            userEntity.email,
            userEntity.password
        );

        return await this.userRepository.create(newUserValue);
    }

    public async updateUser(
        uuid: string,
        userEntityUpdates: Partial<Pick<UserEntity, 'firstName' | 'lastName' | 'phoneNumber' | 'email' | 'password'>>
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

        // Usar el factory method para actualizaciones generales
        const updatedUserValue = UserValue.update(existingUser, userEntityUpdates);

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

        // Usar el factory method para actualizar solo lastLogin
        const updatedUserValue = UserValue.updateLastLogin(existingUser);

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

        // Usar el factory method apropiado según el estado actual
        const updatedUserValue = existingUser.isActive 
            ? UserValue.deactivate(existingUser)
            : UserValue.activate(existingUser);

        return await this.userRepository.update(updatedUserValue);
    }

    /**
     * Activar usuario específicamente
     */
    public async activateUser(uuid: string): Promise<UserEntity> {
        const existingUser = await this.userRepository.findById(uuid);
        if (!existingUser) {
            throw new Error('User not found');
        }

        if (existingUser.isActive) {
            throw new Error('User is already active');
        }

        const activatedUserValue = UserValue.activate(existingUser);
        return await this.userRepository.update(activatedUserValue);
    }

    /**
     * Desactivar usuario específicamente
     */
    public async deactivateUser(uuid: string): Promise<UserEntity> {
        const existingUser = await this.userRepository.findById(uuid);
        if (!existingUser) {
            throw new Error('User not found');
        }

        if (!existingUser.isActive) {
            throw new Error('User is already inactive');
        }

        const deactivatedUserValue = UserValue.deactivate(existingUser);
        return await this.userRepository.update(deactivatedUserValue);
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
