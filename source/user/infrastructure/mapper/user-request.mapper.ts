import { CreateUserRequestDto, UpdateUserRequestDto } from '../dto/user-request.dto';

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
}
