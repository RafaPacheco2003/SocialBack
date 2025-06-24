// Excepciones simples de dominio
export class UserNotFoundError extends Error {
    constructor(id: string) {
        super(`User not found: ${id}`);
        this.name = 'UserNotFoundError';
    }
}

export class UserAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`User already exists: ${email}`);
        this.name = 'UserAlreadyExistsError';
    }
}

export class UserInactiveError extends Error {
    constructor() {
        super('User is inactive');
        this.name = 'UserInactiveError';
    }
}

export class InvalidUserStateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidUserStateError';
    }
}
