// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Blog = require('../models/blogs');

let checkAdmin = function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else if (req.session.user.isAdmin) {
        next();
    }
}

// Get route for adding a new blog post.
router.get('/addBlogPost', checkAdmin, (req, res) => {
    res.render(path.resolve('./views/addBlogPost'), {user: req.session.user, blog: undefined});
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
});

// Post route for adding a new blog.
router.post('/addBlogPost', checkAdmin, upload.array('inputGroupFile03', 5), (req, res) => {
    const {titleInput, textareaInput, inputGroupFile03} = req.body;

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

// Get route which brings in blog to "edit blog page".
router.get('/blogPost/:id', checkAdmin, async (req, res) => {
    const blogPost = await Blog.findById({_id: req.params.id});
    res.render(path.resolve('./views/addBlogPost'), {user: req.session.user, blog: blogPost});
});

// PUT route for blogs.
router.post('/blogPost/edit/:id', checkAdmin, upload.array('inputGroupFile03', 5),(req, res) => {
    const updateBlog = {
        blogTitle: req.body.titleInput,
        blogText: req.body.textareaInput,
        blogPictures: req.files
    };
    Blog.findByIdAndUpdate({_id: req.params.id}, updateBlog, (err) => {
        if (err) {
            console.log(`Error updating blog: ${err}`);
        } else {
            console.log('Blog successfully updated.');
            res.redirect('/');
        }
    });
});

// Delete route for blogs.
router.post('/blogPost/delete/:id', checkAdmin, (req, res) => {
    Blog.findByIdAndDelete({_id: req.params.id}, err => {
        if (err) {
            console.log(`Error deleting blog: ${err}`);
        } else {
            console.log('Blog successfully deleted.');
            res.redirect('/');
        }
    })
})

module.exports = router;