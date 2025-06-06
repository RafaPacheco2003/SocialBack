const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true,
        minlength: [3, 'La descripción debe tener al menos 3 caracteres'],
        maxlength: [100, 'La descripción no puede exceder los 100 caracteres']
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El autor es requerido']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field para las imágenes del post
postSchema.virtual('images', {
    ref: 'Img',
    localField: '_id',
    foreignField: 'post',
    justOne: false
});

// Virtual field para los comentarios del post
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false
});

// Agregar el plugin de paginación
postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;



