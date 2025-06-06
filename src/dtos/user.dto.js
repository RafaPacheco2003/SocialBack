/**
 * DTO para representar un usuario en las respuestas
 * Transforma los datos del modelo a un formato seguro para enviar al cliente
 */
class UserDTO {
    
    constructor(user) {
        this.id = user._id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.isActive = user.isActive;
    }
}

/**
 * DTO para la creación de usuarios
 * Define la estructura de datos necesaria para crear un nuevo usuario
 */
class CreateUserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.isActive = user.isActive || true;
    }
}

/**
 * DTO para la actualización de usuarios
 * Define la estructura de datos permitida para actualizar un usuario existente
 */
class UpdateUserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.isActive = user.isActive;
        if (user.password) {
            this.password = user.password;
        }
    }
}

module.exports = { UserDTO, CreateUserDTO, UpdateUserDTO };
