const PostDTO = require('../dtos/post.dto');

class PostMapper {
    static toModel(postDTO) {
        return {
            description: postDTO.description,
            author: postDTO.author,
            date: new Date()
        };
    }

    static toDTO(postModel) {
        return {
            id: postModel._id,
            description: postModel.description,
            author: {
                id: postModel.author._id,
                firstName: postModel.author.firstName,
                lastName: postModel.author.lastName
            },
            date: postModel.date,
            images: postModel.images ? postModel.images.map(img => ({
                id: img._id,
                url: img.url
            })) : [],
            comments: postModel.comments ? postModel.comments.map(comment => ({
                id: comment._id,
                content: comment.content,
                author: {
                    id: comment.author._id,
                    firstName: comment.author.firstName,
                    lastName: comment.author.lastName
                },
                date: comment.date
            })) : []
        };
    }

    static toDTOList(postModels) {
        return postModels.map(model => this.toDTO(model));
    }

    static toPaginatedDTO(paginationResult) {
        return {
            posts: this.toDTOList(paginationResult.docs),
            page: paginationResult.page,
            totalPages: paginationResult.totalPages,
            totalDocs: paginationResult.totalDocs
        };
    }
}

module.exports = PostMapper; 