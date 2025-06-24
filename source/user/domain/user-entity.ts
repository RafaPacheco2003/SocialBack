export interface UserEntity {
    uuid: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    lastLogin?: Date; // Optional field for last login time
}