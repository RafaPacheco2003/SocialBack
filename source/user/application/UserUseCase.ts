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

    public async registerUser(
        firstName: string,
        lastName: string,
        phoneNumber: string,
        email: string,
        password: string
    ): Promise<UserEntity> {
        // Verificar si el usuario ya existe
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Crear la entidad de dominio
        const userValue = new UserValue(
            null, // UUID will be generated
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            new Date(), // Created at
            true // Is active
        );
        
        // Crear el usuario usando el repositorio
        const user = await this.userRepository.create(userValue);
        return user;
    }

    public async updateUser(
        uuid: string,
        firstName?: string,
        lastName?: string,
        phoneNumber?: string,
        email?: string,
        password?: string,
        isActive?: boolean
    ): Promise<UserEntity> {
        const existingUser = await this.userRepository.findById(uuid);
        if (!existingUser) {
            throw new Error('User not found');
        }

        // Crear nueva entidad con los datos actualizados
        const updatedUserValue = new UserValue(
            existingUser.uuid,
            firstName || existingUser.firstName,
            lastName || existingUser.lastName,
            phoneNumber || existingUser.phoneNumber,
            email || existingUser.email,
            password || existingUser.password,
            existingUser.createdAt,
            isActive !== undefined ? isActive : existingUser.isActive
        );

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
}
