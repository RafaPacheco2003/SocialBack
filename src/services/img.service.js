const ImgRepository = require("../repositories/img.repository");
const cloudinary = require('../config/cloudinary.config');

class ImgService {
    constructor() {
        this.imgRepository = new ImgRepository();
    }


    async createImg(file, postId) {
        const url = await this.uploadToCloudinary(file);
        const imgModel = {
            url,
            post: postId
        };
        return await this.imgRepository.create(imgModel);
    }


    
    async uploadToCloudinary(file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'posts'
            });
            return result.secure_url;
        } catch (error) {
            throw new Error('Error uploading image to cloudinary');
        }
    }

    async getImgsByPost(postId) {
        const imgs = await this.imgRepository.findByPost(postId);
        if (!imgs) {
            throw new Error('Imgs not found');
        }
        return imgs;
    }

    async getImgs(queryParams) {
        return await this.imgRepository.findAll(queryParams);
    }

    async getImgById(id) {
        return await this.imgRepository.findById(id);
    }
}

module.exports = new ImgService();