const commentRepository = require('../repositories/comment.repository');
const { CreateCommentDTO, UpdateCommentDTO } = require('../dtos/comment.dto');
const AppError = require('../errors/AppError');

/**
 * Servicio de Comentarios
 */
class CommentService {
    
   async createComment(commentModel){
   return await commentRepository.create(commentModel);
   }


   async getComments(queryParams){

    return await commentRepository.findAll(queryParams);
    }

    async getCommentById(id){
        return await commentRepository.findById(id);
    }

    async updateComment(id, commentModel){
        return await commentRepository.update(id, commentModel);
    }

    async deleteComment(id){
        return await commentRepository.delete(id);
    }
}

module.exports = new CommentService();
