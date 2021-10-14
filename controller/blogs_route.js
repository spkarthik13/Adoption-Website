// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Blog = require('../models/blogs');
const nanoid = require('nanoid');
const fs = require('fs');

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
        callback(null, nanoid.nanoid() + path.extname(file.originalname));
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
        blogPictures: req.files,
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
router.post('/blogPost/delete/:id', checkAdmin, async (req, res) => {
    deleteBlog = await Blog.findByIdAndDelete({_id: req.params.id})
    .then(result => {
        for (let i = 0; i < result.blogPictures.length; i++) {
            fs.unlink(path.resolve('./public/uploads/images/' + result.blogPictures[i].filename), (err => {
                if (err) { 
                    console.log(`Error deleting blog file directory: ${err}`);
                } else {
                    console.log(`Successfully deleted file related to blog post: ${result.blogPictures[i].filename}`);
                }})
            )
        }})
    .catch(err => {
        if (err) {
            console.log(`Error fetching blog from database: ${err}`);
        }})
    res.redirect('/');
});
    


module.exports = router;