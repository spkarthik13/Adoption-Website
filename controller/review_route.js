const express = require('express');
const router = express.Router();
const Review = require('../models/review');

function checkUser(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        res.redirect('*');
    }
}

router.post('/reviews/post_review', checkUser, async (req, res) => {
    const newReview = new Review({
        overallRating: req.body.overallRating,
        friendRecommend: req.body.friendRating,
        otherComments: req.body.otherComments,
        user: req.session.user._id,
    })
    await newReview.save()
    res.redirect('/');
})

module.exports = router;