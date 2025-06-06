const ImgService = require('../services/img.service');

class ImgController {
    async createImg(req, res, next) {


        if (!req.file) {
            return res.status(400).json({
                error: {
                    message: 'No file uploaded',
                    status: 400
                }
            });
        }

        const postId = req.body.postId;
        if (!postId) {
            return res.status(400).json({
                error: {
                    message: 'Post ID is required',
                    status: 400
                }
            });
        }

        const img = await ImgService.createImg(req.file, postId);
        res.status(201).json(img);

    }

    async getImgsByPost(req, res, next) {
        try {
            const postId = req.params.postId;
            const images = await ImgService.getImgsByPost(postId);
            res.json(images);
        } catch (error) {
            console.error('Error in getImgsByPost:', error);
            next(error);
        }
    }
}

module.exports = new ImgController();