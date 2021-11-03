// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Reviews = require('../models/review');

router.get('/', async (req, res) => {
    await Reviews.find({}).limit(10).sort({createdAt: "desc"})
    .then((result) => {
        if (req.session.user) {
            res.render(path.resolve('./views/homepage.ejs'), {user: req.session.user, reviews: result});
        } else {
            res.render(path.resolve('./views/homepage.ejs'), {user: undefined, reviews: result});
        }
    })
});

module.exports = router;