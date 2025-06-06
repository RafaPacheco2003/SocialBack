const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'El contenido es requerido'],
        trim: true,
        minlength: [1, 'El contenido debe tener al menos 1 caracter'],
        maxlength: [500, 'El contenido no puede exceder los 500 caracteres']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El autor es requerido']
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'El post es requerido']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Agregar el plugin de paginación
commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

