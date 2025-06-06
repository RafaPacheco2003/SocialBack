const { CommentDTO } = require('../dtos/comment.dto');
const Comment = require('../models/comment.model');

class CommentMapper {
    static toModel(createDTO) {
        return new Comment(
            createDTO.content,
            createDTO.author,
            createDTO.post,
            createDTO.date
        );
    }

    static toModelForUpdate(updateDTO) {
        return {
            content: updateDTO.content
        };
    }

    static toDTO(commentModel) {
        return new CommentDTO(commentModel);
    }

    static toDTOList(commentModels) {
        return commentModels.map(model => this.toDTO(model));
    }

    static toPaginatedDTO(paginationResult) {
        return {
            items: this.toDTOList(paginationResult.docs),
            page: paginationResult.page,
            limit: paginationResult.limit,
            total: paginationResult.totalDocs,
            pages: paginationResult.totalPages
        };
    }
}

module.exports = CommentMapper;
