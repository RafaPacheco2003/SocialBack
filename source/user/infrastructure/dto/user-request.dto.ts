export interface CreateUserRequestDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export interface GetUserByIdRequestDto {
    uuid: string;
}

export interface UpdateUserRequestDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
}
