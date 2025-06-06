const PostService = require('../services/post.service');
const PostDTO = require('../dtos/post.dto');
const PostMapper = require('../mappers/post.mapper');

class PostController {
    async createPost(req, res, next) {
        try {
            const postData = JSON.parse(req.body.data);
            const post = await PostService.createPostWithImages(postData, req.files);
            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    }

    async getPost(req, res) {
        try {
            const post = await PostService.getPostById(req.params.id);
            const responseDTO = PostMapper.toDTO(post);
            res.json(responseDTO);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getPostsByAuthor(req, res, next) {
        try {
            const posts = await PostService.getPostsByAuthor(req.params.authorId);
            res.json(posts);
        } catch (error) {
            next(error);
        }
    }

    async getAllPosts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const paginatedPosts = await PostService.getPosts({ page, limit });
            const responseDTO = PostMapper.toPaginatedDTO(paginatedPosts);
            res.json(responseDTO);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getPostById(req, res, next) {
        try {
            const post = await PostService.getPostById(req.params.id);
            res.json(post);
        } catch (error) {
            next(error);
        }
    }

    async updatePost(req, res, next) {
        try {
            const post = await PostService.updatePost(req.params.id, req.body);
            res.json(post);
        } catch (error) {
            next(error);
        }
    }

    async deletePost(req, res, next) {
        try {
            await PostService.deletePost(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getPosts(req, res, next) {
        try {
            const posts = await PostService.getPosts(req.query);
            res.json(posts);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PostController();