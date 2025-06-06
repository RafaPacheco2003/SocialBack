class CommentDTO {
    constructor(content, author, post) {
        this.content = content;
        this.author = author;
        this.post = post;
    }
}

class CreateCommentDTO {
    constructor(comment) {
        this.content = comment.content;
        this.author = comment.author;
        this.post = comment.post;
    }
}
class UpdateCommentDTO {
    constructor(comment) {
        this.content = comment.content;
    }
}

module.exports = { CommentDTO, CreateCommentDTO, UpdateCommentDTO };
