import { UserEntity } from "./user-entity";
import { v4 as generateUUID } from "uuid";

export class UserValue implements UserEntity {
    uuid: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    lastLogin?: Date;

    constructor(
        uuid: string | null,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        email: string,
        password: string,
        createdAt: Date,
        isActive: boolean
    ) {
        this.uuid = uuid || generateUUID();
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.updatedAt = new Date();
    }
}
