import { UserEntity } from '../../domain/user-entity';
import { UserResponseDto, CreateUserResponseDto } from '../dto/user-response.dto';

export class UserResponseMapper {
    static toUserResponseDto(user: UserEntity): UserResponseDto {
        return {
            uuid: user.uuid,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isActive: user.isActive,
            lastLogin: user.lastLogin
        };
    }

    static toCreateUserResponseDto(user: UserEntity): CreateUserResponseDto {
        return {
            uuid: user.uuid,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            createdAt: user.createdAt,
            isActive: user.isActive,
            message: 'User created successfully'
        };
    }

    static toUserResponseDtoList(users: UserEntity[]): UserResponseDto[] {
        return users.map(user => this.toUserResponseDto(user));
    }
}
