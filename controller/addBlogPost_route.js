// Imports.

const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/addBlogPost', (req, res) => {
    res.render(path.resolve('./views/addBlogPost'), {user: req.session.user});
});

module.exports = router;