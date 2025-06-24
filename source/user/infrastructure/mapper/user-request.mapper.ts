import { CreateUserRequestDto, UpdateUserRequestDto } from '../dto/user-request.dto';
import { UserEntity } from '../../domain/user-entity';
import { UserValue } from '../../domain/user-value';

export class UserRequestMapper {
    static extractCreateUserParams(requestDto: CreateUserRequestDto) {
        return {
            firstName: requestDto.firstName,
            lastName: requestDto.lastName,
            phoneNumber: requestDto.phoneNumber,
            email: requestDto.email,
            password: requestDto.password
        };
    }

    static extractUpdateUserParams(requestDto: UpdateUserRequestDto) {
        return {
            firstName: requestDto.firstName,
            lastName: requestDto.lastName,
            phoneNumber: requestDto.phoneNumber,
            email: requestDto.email,
            password: requestDto.password,
            isActive: requestDto.isActive
        };
    }

    /**
     * Convierte un CreateUserRequestDto a UserEntity
     * Seguimos el principio de Clean Architecture creando la entidad en la capa de infraestructura
     */
    static toUserEntity(requestDto: CreateUserRequestDto): UserEntity {
        const userValue = new UserValue(
            null, // UUID será generado
            requestDto.firstName,
            requestDto.lastName,
            requestDto.phoneNumber,
            requestDto.email,
            requestDto.password,
            new Date(),
            true // Por defecto activo
        );

        return userValue;
    }

    /**
     * Convierte un UpdateUserRequestDto a Partial<UserEntity>
     */
    static toPartialUserEntity(requestDto: UpdateUserRequestDto): Partial<UserEntity> {
        const updates: Partial<UserEntity> = {};

        if (requestDto.firstName !== undefined) {
            updates.firstName = requestDto.firstName;
        }
        if (requestDto.lastName !== undefined) {
            updates.lastName = requestDto.lastName;
        }
        if (requestDto.phoneNumber !== undefined) {
            updates.phoneNumber = requestDto.phoneNumber;
        }
        if (requestDto.email !== undefined) {
            updates.email = requestDto.email;
        }
        if (requestDto.password !== undefined) {
            updates.password = requestDto.password;
        }
        if (requestDto.isActive !== undefined) {
            updates.isActive = requestDto.isActive;
        }

        return updates;
    }
}
