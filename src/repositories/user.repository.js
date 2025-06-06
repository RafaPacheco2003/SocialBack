const User = require('../models/user.model');

/**
 * Repositorio de Usuarios
 */
class UserRepository {
    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario a crear
     * @returns {Promise<UserDTO>} Usuario creado
     */
    async create(userData) {
        return await User.create(userData);
    }

    /**
     * Encuentra todos los usuarios que coinciden con los criterios
     * @param {Object} params - Parámetros de búsqueda y paginación
     * @returns {Promise<Object>} Lista paginada de usuarios
     */
    async findAll(options = {}) {
        return await User.find()
        .populate('posts')
        .populate('comments');
    }

    /**
     * Encuentra un usuario por su ID
     * @param {string} id - ID del usuario
     * @returns {Promise<UserDTO|null>} Usuario encontrado o null
     */
    async findById(id) {
        return await User.findById(id)
            .populate('posts')
            .populate('comments');
    }

    /**
     * Encuentra un usuario por su correo electrónico
     * @param {string} email - Correo electrónico del usuario
     * @returns {Promise<UserDTO|null>} Usuario encontrado o null
     */
    async findByEmail(email) {
        return await User.findOne({ email: email.toLowerCase() })
            .populate('posts')
            .populate('comments');
    }

    /**
     * Actualiza un usuario existente
     * @param {string} id - ID del usuario a actualizar
     * @param {Object} userData - Datos a actualizar
     * @returns {Promise<UserDTO|null>} Usuario actualizado o null
     */
    async update(id, userData) {
        return await User.findByIdAndUpdate(
            id, 
            userData, 
            { new: true, runValidators: true }
        ).populate('posts').populate('comments');
    }

    /**
     * Elimina un usuario
     * @param {string} id - ID del usuario a eliminar
     * @returns {Promise<boolean>} true si se eliminó, false si no existía
     */
    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = new UserRepository();
