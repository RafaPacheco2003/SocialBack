// Importamos las dependencias necesarias
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * Esquema de Usuario
 * Define la estructura y validaciones para los documentos de usuario en MongoDB
 */
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
    },
    
    lastName: {
        type: String,
        required: [true, 'El apellido es requerido'],
        trim: true,
        minlength: [3, 'El apellido debe tener al menos 3 caracteres'],
        maxlength: [50, 'El apellido no puede exceder los 50 caracteres']
    },
    
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: 'El email debe ser una dirección válida'
        }
    },
    
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        },
        virtuals: true
    },
    toObject: { virtuals: true }
});

// Añadir referencia virtual a los posts del usuario
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
    justOne: false
});

userSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'author',
    justOne: false
});

// Método para buscar por email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Agregar el plugin de paginación
userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

module.exports = User;
