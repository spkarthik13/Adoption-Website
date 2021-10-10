// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Blog = require('../models/blogs');

router.get('/addBlogPost', (req, res) => {
    res.render(path.resolve('./views/addBlogPost'), {user: req.session.user});
});


// Define storage for multer.
const storage = multer.diskStorage({
    // Destination for files.
    destination: function(req, file, callback) {
        callback(null, './public/uploads/images');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    },
});

// Upload parameters for multer.
const upload = multer({
    storage:storage,
    limits: {
        fieldSize: 1024 * 1024 * 3
    }
});

router.post('/addBlogPost', upload.array('inputGroupFile03', 5), (req, res) => {
    const {titleInput, textareaInput, inputGroupFile03} = req.body;
    console.log(req.files);

    let blog = new Blog({
        blogTitle: titleInput,
        blogText: textareaInput,
        blogPictures: req.files
    });

    blog.save()
        .then((result) => {
            console.log(`Blog successfully saved: ${result}`);
        })
        .catch((error) => {
            console.log(`Error saving blog to the database: ${error}`);
        });

    res.redirect('/');
});

module.exports = router;