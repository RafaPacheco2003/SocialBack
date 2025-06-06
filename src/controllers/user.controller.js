const UserService = require('../services/user.service');

/**
 * Controlador de Usuarios
 * Maneja las peticiones HTTP relacionadas con usuarios
 */
class UserController {
    /**
     * Obtiene una lista paginada de usuarios
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async getAll(req, res) {
        try {
            const paginatedUsers = await UserService.getAll(req.query);
            res.status(200).json(paginatedUsers);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Obtiene un usuario por su ID
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async getById(req, res) {
        try {
            const user = await UserService.getById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Crea un nuevo usuario
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async create(req, res) {
        const userModel = UserMapper.toModel(req.body);
        const newUser = await UserService.create(userModel);
        const responseDTO = UserMapper.toDTO(newUser);
        res.status(201).json(responseDTO);
    }

    /**
     * Actualiza un usuario existente
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async update(req, res) {
        try {
            const updatedUser = await UserService.update(req.params.id, req.body);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Elimina un usuario
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async delete(req, res) {
        try {
            await UserService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new UserController();