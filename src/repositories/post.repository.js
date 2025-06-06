const Post = require('../models/post.model');

class PostRepository {

    async create(postData){
        return await Post.create(postData);
    }

    async findById(id){
        return await Post.findById(id)
            .populate('author')
            .populate({
                path: 'comments',
                populate: { path: 'author' }
            })
            .populate('images');
    }

    async findByAuthor(authorId){
        return await Post.find({author: authorId})
            .populate('author')
            .populate({
                path: 'comments',
                populate: { path: 'author' }
            })
            .populate('images');
    }

    async findAll(options = {}) {
        const populateOptions = [
            { path: 'author' },
            {
                path: 'comments',
                populate: { path: 'author' }
            },
            { path: 'images' }
        ];

        return await Post.paginate({}, {
            ...options,
            populate: populateOptions
        });
    }

    async update(id, postData){
        return await Post.findByIdAndUpdate(id, postData, {new: true})
            .populate('author')
            .populate({
                path: 'comments',
                populate: { path: 'author' }
            })
            .populate('images');
    }

    async delete(id){
        return await Post.findByIdAndDelete(id);
    }
}

module.exports = new PostRepository();
