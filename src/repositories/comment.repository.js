const { CommentDTO } = require('../dtos/comment.dto');
const Comment = require('../models/comment.model');
const { AppError } = require('../errors');

/**
 * Repositorio de Comentarios
 */
class CommentRepository {
    /**
     * Crea un nuevo comentario
     * @param {Object} commentData - Datos del comentario a crear
     * @returns {Promise<CommentDTO>} Comentario creado
     */
    async create(commentData) {
       return await Comment.create(commentData);
    }

    /**
     * Encuentra todos los comentarios que coinciden con los criterios
     * @param {Object} params - Parámetros de búsqueda y paginación
     * @returns {Promise<Object>} Lista paginada de comentarios
     */
    async findAll({ page = 1, limit = 10 }) {
        return await Comment.paginate({}, { page, limit });
    }

    /**
     * Encuentra un comentario por su ID
     * @param {string} id - ID del comentario
     * @returns {Promise<CommentDTO|null>} Comentario encontrado o null
     */
    async findById(id) {
        return await Comment.findById(id);
    }
    
    /**
     * Encuentra comentarios por ID del post
     * @param {string} postId - ID del post
     * @returns {Promise<Array<CommentDTO>>} Lista de comentarios
     */
    async findByPost(postId) {
        return await Comment.find({post: postId});
    }

    async update(id, commentData){
        return await Comment.findByIdAndUpdate(id, commentData, {new: true});
    }

    async delete(id){
        return await Comment.findByIdAndDelete(id);
    }
}

module.exports = new CommentRepository();