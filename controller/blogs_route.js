// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Blog = require('../models/blogs');
const nanoid = require('nanoid');
const fs = require('fs');

let checkAdmin = function(req, res, next) {
    if (req.session.user.isAdmin) {
        next();
    } else {
        res.redirect('/');
    }
}

// Get route for adding a new blog post.
router.get('/blogs', async (req, res) => {
    await Blog.find({}).sort({createdAt: -1})
    .then((result) => {
        res.render(path.resolve('./views/blogs'), {user: req.session.user, blogs: result});
    })
    .catch((err) => {
        console.log(`Error grabbing blogs from the database: ${err}`);
    });
});

// Define storage for multer.
const storage = multer.diskStorage({
    // Destination for files.
    destination: function(req, file, callback) {
        callback(null, './public/uploads/blog_images');
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
router.post('/add_blog_post', checkAdmin, upload.array('formFileMultiple'), (req, res) => {
    console.log(req.body);
    let blog = new Blog({
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
        blogPictures: req.files,
    });

    blog.save()
        .then((result) => {
            console.log(`Blog successfully saved: ${result}`);
        })
        .catch((error) => {
            console.log(`Error saving blog to the database: ${error}`);
        });

    res.redirect('/blogs');
});

// Get route which brings in blog to "edit blog page".
router.get('/blogPost/:id', checkAdmin, async (req, res) => {
    const blogPost = await Blog.findById({_id: req.params.id});
    res.render(path.resolve('./views/addBlogPost'), {user: req.session.user, blog: blogPost});
});

// PUT route for blogs.
router.post('/blogPost/edit/:id', checkAdmin, upload.array('formFileMultiple', 5),(req, res) => {
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
            res.redirect('/blogs');
        }
    });
});

// Delete route for blogs.
router.get('/blogPost/delete/:id', checkAdmin, async (req, res) => {
    deleteBlog = await Blog.findByIdAndDelete({_id: req.params.id})
    .then(result => {
        for (let i = 0; i < result.blogPictures.length; i++) {
            fs.unlink(path.resolve('./public/uploads/blog_images/' + result.blogPictures[i].filename), (err => {
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
    res.redirect('/blogs');
});
    


module.exports = router;