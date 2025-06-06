const userRepository = require('../repositories/user.repository');
const UserMapper = require('../mappers/user.mapper');
const { CreateUserDTO, UpdateUserDTO } = require('../dtos/user.dto');
const AppError = require('../errors/AppError');

/**
 * Servicio de Usuarios
 */
class UserService {
    /**
     * Obtiene una lista paginada de usuarios
     * @param {Object} queryParams - Parámetros de consulta (paginación y filtros)
     * @returns {Promise<Array>} Lista de usuarios
     */
    async getAll(queryParams) {
        const paginatedUsers = await userRepository.findAll(queryParams);
        return UserMapper.toPaginatedDTO(paginatedUsers);
    }

    /**
     * Obtiene un usuario por su ID
     * @param {string} id - ID del usuario
     * @returns {Promise<Object>} Usuario encontrado
     */
    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw AppError.notFound('Usuario no encontrado');
        }
        return UserMapper.toDTO(user);
    }

    /**
     * Busca un usuario por su correo electrónico
     * @param {string} email - Correo electrónico del usuario
     * @returns {Promise<Object>} Usuario encontrado o null si no se encuentra
     */
    async findByEmail(email) {
        const user = await userRepository.findByEmail(email);
        return user ? UserMapper.toDTO(user) : null;
    }

    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario a crear
     * @returns {Promise<Object>} Usuario creado
     */
    async create(userData) {
        const createDTO = new CreateUserDTO(userData);
        const userModel = UserMapper.toModel(createDTO);
        const createdUser = await userRepository.create(userModel);
        return UserMapper.toDTO(createdUser);
    }

    /**
     * Actualiza un usuario existente
     * @param {string} id - ID del usuario a actualizar
     * @param {Object} userData - Datos a actualizar
     * @returns {Promise<Object>} Usuario actualizado
     */
    async update(id, userData) {
        const updateDTO = new UpdateUserDTO(userData);
        const userModel = UserMapper.toModelForUpdate(updateDTO);
        const updatedUser = await userRepository.update(id, userModel);
        
        if (!updatedUser) {
            throw AppError.notFound('Usuario no encontrado');
        }
        
        return UserMapper.toDTO(updatedUser);
    }

    /**
     * Elimina un usuario
     * @param {string} id - ID del usuario a eliminar
     * @returns {Promise<boolean>} true si se eliminó
     */
    async delete(id) {
        const user = await this.getById(id);
        await userRepository.delete(id);
        return true;
    }
}

module.exports = new UserService();