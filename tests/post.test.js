const PostController = require('../src/controllers/post.controller');
const PostService = require('../src/services/post.service');

// Mock del servicio
jest.mock('../src/services/post.service');

describe('PostController', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {}
        };
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('createPost', () => {
        it('should create a post successfully', async () => {
            const mockPost = {
                description: 'Test post',
                author: '65f3c8d7e85b1234567890ab'
            };
            mockReq.body = mockPost;
            
            PostService.createPost.mockResolvedValue(mockPost);

            await PostController.createPost(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockPost);
        });

        it('should handle errors when creating a post', async () => {
            const error = new Error('Error creating post');
            PostService.createPost.mockRejectedValue(error);

            await PostController.createPost(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getPost', () => {
        it('should get a post by id successfully', async () => {
            const mockPost = {
                id: '65f3c8d7e85b1234567890ab',
                description: 'Test post'
            };
            mockReq.params.id = mockPost.id;
            
            PostService.getPostById.mockResolvedValue(mockPost);

            await PostController.getPost(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(mockPost);
        });
    });

    describe('getPostsByAuthor', () => {
        it('should get posts by author successfully', async () => {
            const mockPosts = [
                { description: 'Post 1' },
                { description: 'Post 2' }
            ];
            mockReq.params.authorId = '65f3c8d7e85b1234567890ab';
            
            PostService.getPostsByAuthor.mockResolvedValue(mockPosts);

            await PostController.getPostsByAuthor(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(mockPosts);
        });
    });

    describe('getAllPosts', () => {
        it('should get all posts with pagination', async () => {
            const mockPosts = {
                docs: [
                    { description: 'Post 1' },
                    { description: 'Post 2' }
                ],
                totalDocs: 2,
                page: 1
            };
            mockReq.query = { page: 1, limit: 10 };
            
            PostService.getPosts.mockResolvedValue(mockPosts);

            await PostController.getAllPosts(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(mockPosts);
        });
    });
}); 