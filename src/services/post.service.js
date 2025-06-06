const postRepository = require('../repositories/post.repository');
const PostMapper = require('../mappers/post.mapper');
const imgService = require('./img.service');

class PostService {
    constructor() {
        this.postRepository = postRepository;
        this.imgService = imgService;
    }

    async createPostWithImages(postData, files) {
        // Crear el post
        const post = await this.postRepository.create(postData);
        
        // Subir imágenes si existen
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => 
                this.imgService.createImg(file, post._id)
            );
            await Promise.all(uploadPromises);
        }

        // Obtener el post actualizado con las imágenes
        const postWithImages = await this.postRepository.findById(post._id);
        return PostMapper.toDTO(postWithImages);
    }

    async getPostsByAuthor(authorId) {
        const posts = await this.postRepository.findByAuthor(authorId);
        return posts.map(post => PostMapper.toDTO(post));
    }

    async getPostById(id) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new Error('Post not found');
        }
        return PostMapper.toDTO(post);
    }

    async updatePost(id, postModel) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new Error('Post not found');
        }
        post.description = postModel.description;
        const updatedPost = await this.postRepository.update(id, post);
        return PostMapper.toDTO(updatedPost);
    }

    async deletePost(id) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new Error('Post not found');
        }
        await this.postRepository.delete(id);
    }

    async getPosts(queryParams) {
        const posts = await this.postRepository.findAll(queryParams);
        return PostMapper.toPaginatedDTO(posts);
    }
}

module.exports = new PostService();