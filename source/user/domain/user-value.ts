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
        isActive: boolean,
        updatedAt?: Date,
        lastLogin?: Date
    ) {
        this.uuid = uuid || generateUUID();
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.updatedAt = updatedAt || new Date();
        this.lastLogin = lastLogin;
    }

    // Factory method para crear un nuevo usuario (registro)
    static createNew(
        firstName: string,
        lastName: string,
        phoneNumber: string,
        email: string,
        password: string
    ): UserValue {
        return new UserValue(
            null, // UUID se genera automáticamente
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            new Date(), // createdAt
            false, // isActive = false por defecto
            undefined, // updatedAt no se establece en creación
            undefined // lastLogin no se establece en creación
        );
    }

    // Factory method para activar usuario
    static activate(existingUser: UserEntity): UserValue {
        return new UserValue(
            existingUser.uuid,
            existingUser.firstName,
            existingUser.lastName,
            existingUser.phoneNumber,
            existingUser.email,
            existingUser.password,
            existingUser.createdAt,
            true, // isActive = true
            new Date(), // updatedAt se actualiza
            existingUser.lastLogin // preservar lastLogin
        );
    }

    // Factory method para desactivar usuario
    static deactivate(existingUser: UserEntity): UserValue {
        return new UserValue(
            existingUser.uuid,
            existingUser.firstName,
            existingUser.lastName,
            existingUser.phoneNumber,
            existingUser.email,
            existingUser.password,
            existingUser.createdAt,
            false, // isActive = false
            new Date(), // updatedAt se actualiza
            existingUser.lastLogin // preservar lastLogin
        );
    }

    // Factory method para actualizar último login
    static updateLastLogin(existingUser: UserEntity): UserValue {
        return new UserValue(
            existingUser.uuid,
            existingUser.firstName,
            existingUser.lastName,
            existingUser.phoneNumber,
            existingUser.email,
            existingUser.password,
            existingUser.createdAt,
            existingUser.isActive,
            existingUser.updatedAt, // preservar updatedAt
            new Date() // actualizar lastLogin
        );
    }

    // Factory method para actualizaciones generales
    static update(
        existingUser: UserEntity, 
        updates: Partial<Pick<UserEntity, 'firstName' | 'lastName' | 'phoneNumber' | 'email' | 'password'>>
    ): UserValue {
        return new UserValue(
            existingUser.uuid,
            updates.firstName || existingUser.firstName,
            updates.lastName || existingUser.lastName,
            updates.phoneNumber || existingUser.phoneNumber,
            updates.email || existingUser.email,
            updates.password || existingUser.password,
            existingUser.createdAt,
            existingUser.isActive, // isActive no se cambia en actualizaciones generales
            new Date(), // updatedAt se actualiza en modificaciones generales
            existingUser.lastLogin // preservar lastLogin
        );
    }
}
