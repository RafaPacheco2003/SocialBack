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
     * Usa el factory method para crear nuevos usuarios
     */
    static toUserEntity(requestDto: CreateUserRequestDto): UserEntity {
        return UserValue.createNew(
            requestDto.firstName,
            requestDto.lastName,
            requestDto.phoneNumber,
            requestDto.email,
            requestDto.password
        );
    }

    /**
     * Convierte un UpdateUserRequestDto a Partial<UserEntity>
     * Excluye isActive ya que debe ser manejado por métodos específicos
     */
    static toPartialUserEntity(requestDto: UpdateUserRequestDto): Partial<Pick<UserEntity, 'firstName' | 'lastName' | 'phoneNumber' | 'email' | 'password'>> {
        const updates: Partial<Pick<UserEntity, 'firstName' | 'lastName' | 'phoneNumber' | 'email' | 'password'>> = {};

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
        // isActive se excluye - debe ser manejado por activateUser/deactivateUser

        return updates;
    }
}
