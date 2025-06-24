export interface UserResponseDto {
    uuid: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    lastLogin?: Date;
}

export interface CreateUserResponseDto {
    uuid: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    createdAt: Date;
    isActive: boolean;
    message: string;
}

export interface GetAllUsersResponseDto {
    users: UserResponseDto[];
    total: number;
}

export interface ErrorResponseDto {
    error: string;
    message?: string;
    statusCode: number;
}
