const multer = require('multer');
const path = require('path');

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'));
};

const MAX_FILES = 4;

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: MAX_FILES
    }
});

// Middleware para validar número de archivos
const validateFileCount = (req, res, next) => {
    if (req.files && req.files.length > MAX_FILES) {
        return res.status(400).json({
            error: {
                message: `No se pueden subir más de ${MAX_FILES} imágenes por post`,
                status: 400
            }
        });
    }
    next();
};

module.exports = {
    uploadImages: [
        upload.array('images', MAX_FILES),
        validateFileCount
    ]
}; 