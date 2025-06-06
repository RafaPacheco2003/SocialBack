const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');
const { uploadImages } = require('../middlewares/upload.middleware');

// Rutas para posts
router.post('/', uploadImages, PostController.createPost);
router.get('/author/:authorId', PostController.getPostsByAuthor);
router.get('/:id', PostController.getPostById);
router.put('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);
router.get('/', PostController.getPosts);

module.exports = router;