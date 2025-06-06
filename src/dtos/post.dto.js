class PostDTO {
    constructor(description, author) {
        this.description = description;
        this.author = author;
    }

    static fromRequest(req) {
        return new PostDTO(
            req.body.description,
            req.body.author || req.user._id // Asumiendo que tienes el usuario en el request
        );
    }
}

module.exports = PostDTO;