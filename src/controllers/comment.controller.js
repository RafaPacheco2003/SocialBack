const { StatusCodes } = require('http-status-codes');
const CommentService = require('../services/comment.service');
const CommentMapper = require('../mappers/comment.mapper');
const { CreateCommentDTO, UpdateCommentDTO } = require('../dtos/comment.dto');
const { AppError } = require('../errors');

/**
 * Controlador de Comentarios
 */
class CommentController {
    /**
     * Obtiene una lista paginada de comentarios
     */
    async getAll(req, res, next) {

        const commentModel= CommentMapper.toModel(req);
        const comments= await CommentService.getComments(commentModel);
        const responseDTO= CommentMapper.toDTOList(comments);
        res.status(StatusCodes.OK).json(responseDTO);
    }

    /**
     * Obtiene un comentario por su ID
     */
    async getById(req, res, next) {
        
            const comment = await CommentService.getCommentById(req.params.id);
            const responseDTO = CommentMapper.toDTO(comment);
            res.status(StatusCodes.OK).json(responseDTO);
       
    }

    /**
     * Obtiene comentarios por ID del post
     */
    async getByPost(req, res, next) {
        
            const comments = await CommentService.getCommentsByPost(req.params.postId);
            const responseDTO = CommentMapper.toDTOList(comments);
            res.status(StatusCodes.OK).json(responseDTO);
        
    }

    /**
     * Crea un nuevo comentario
     */
    async create(req, res, next) {
       
            const newComment = await CommentService.createComment(req.body);
            const responseDTO = CommentMapper.toDTO(newComment);
            res.status(StatusCodes.CREATED).json(responseDTO);
       
    }

    /**
     * Actualiza un comentario existente
     */
    async update(req, res, next) {
        
            const updatedComment = await CommentService.updateComment(req.params.id, req.body);
            const responseDTO = CommentMapper.toDTO(updatedComment);
            res.status(StatusCodes.OK).json(responseDTO);
        
    }

    /**
     * Elimina un comentario
     */
    async delete(req, res, next) {
        
            await CommentService.deleteComment(req.params.id);
            res.status(StatusCodes.OK).json({ message: 'Comentario eliminado correctamente' });
        
    }
}

module.exports = new CommentController();
