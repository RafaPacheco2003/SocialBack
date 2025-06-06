const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ImgController = require('../controllers/img.controller');

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Test route to verify the router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Image router is working' });
});

// Routes
router.post('/', upload.single('image'), ImgController.createImg.bind(ImgController));
router.get('/post/:postId', ImgController.getImgsByPost.bind(ImgController));

module.exports = router;