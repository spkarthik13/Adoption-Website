// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/user');
const Blogs = require('../models/blogs');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    let homepageBlogs = await Blogs.find({}).sort({'createdAt': 'desc'});
    if (req.session.user) {
        res.render(path.resolve('./views/homepage.ejs'), {user: req.session.user, blogs: homepageBlogs});
    } else {
        res.render(path.resolve('./views/homepage.ejs'), {user: undefined, blogs: homepageBlogs});
    }
});

module.exports = router;