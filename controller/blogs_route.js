const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Blog = require('../models/blogs');
const nanoid = require('nanoid');
const fs = require('fs');
const page = require('../pagination');

let checkAdmin = function(req, res, next) {
    if (req.session.user.isAdmin) {
        next();
    } else {
        res.redirect('*');
    }
}

// Get route for adding a new blog post.
router.get('/blogs', page.paginatedResults(Blog), async (req, res) => {
    res.render(path.resolve('./views/blogs.ejs'), {user: req.session.user, blogs:res.paginatedResults})
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

    res.redirect('/blogs?page=1&limit=3');
});

router.get('/blogPost/edit/:id', checkAdmin, (req, res) => {
    Blog.findById({_id: req.params.id})
    .then((result) => {
        res.render(path.resolve('./views/edit_blog.ejs'), {user: req.session.user, blog: result});
    })
    .catch(err => {
        console.log(`Error finding blog to edit`);
    })
});

// PUT route for blogs.
router.post('/blogPost/edit/:id', checkAdmin, upload.array('formFileMultiple', 5), async (req, res) => {
    console.log(req.body);
    const updateBlog = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
        blogPictures: req.files
    };
    await Blog.findByIdAndUpdate({_id: req.params.id}, updateBlog)
    .then(result => console.log(`Blog successfully updated: ${result}`))
    .catch(err => console.log(`Error updating blog: ${err}`)
    )

    res.redirect('/blogs?page=1&limit=3');
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
    res.redirect('/blogs?page=1&limit=3');
});
    
module.exports = router;