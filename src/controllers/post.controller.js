const PostService = require('../services/post.service');
const PostDTO = require('../dtos/post.dto');
const PostMapper = require('../mappers/post.mapper');

class PostController {
    async createPost(req, res, next) {

        const postData = JSON.parse(req.body.data);
        const postModel = PostMapper.toModel(postData);
        const postWithImages = await PostService.createPostWithImages(postModel, req.files);
        const responseDTO = PostMapper.toDTO(postWithImages);
        res.status(201).json(responseDTO);

    }

    async getPost(req, res) {
        const post = await PostService.getPostById(req.params.id);
        const responseDTO = PostMapper.toDTO(post);
        res.json(responseDTO);
    }

    async getPostsByAuthor(req, res, next) {
        const posts = await PostService.getPostsByAuthor(req.params.authorId);
        const responseDTO = PostMapper.toDTOList(posts);
        res.json(responseDTO);
    }

    async getAllPosts(req, res) {
        const { page = 1, limit = 10 } = req.query;
        const paginatedPosts = await PostService.getPosts({ page, limit });
        const responseDTO = PostMapper.toPaginatedDTO(paginatedPosts);
        res.json(responseDTO);
    }

    async getPostById(req, res, next) {
        const post = await PostService.getPostById(req.params.id);
        const responseDTO = PostMapper.toDTO(post);
        res.json(responseDTO);
    }

    async updatePost(req, res, next) {
        const postModel = PostMapper.toModel(req.body);
        const updatedPost = await PostService.updatePost(req.params.id, postModel);
        const responseDTO = PostMapper.toDTO(updatedPost);
        res.json(responseDTO);
    }

    async deletePost(req, res, next) {
        await PostService.deletePost(req.params.id);
        res.status(204).send();
    }

    async getPosts(req, res, next) {
        const posts = await PostService.getPosts(req.query);
        const responseDTO = PostMapper.toDTOList(posts);
        res.json(responseDTO);
    }
}

module.exports = new PostController();