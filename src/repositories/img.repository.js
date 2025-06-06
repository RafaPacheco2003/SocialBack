const Img = require("../models/img.model");

class ImgRepository {
    async create(imgData) {
        return await Img.create(imgData);
    }

    async findAll(queryParams) {
        return await Img.paginate({}, queryParams);
    }

    async findById(id) {
        return await Img.findById(id);
    }

    async findByPost(postId) {
        return await Img.find({ post: postId });
    }

    async update(id, imgData) {
        return await Img.findByIdAndUpdate(id, imgData, { new: true });
    }

}

module.exports = ImgRepository;