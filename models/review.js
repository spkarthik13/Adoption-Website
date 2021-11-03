const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    overallRating: {
        type: Number,
    },
    friendRecommend: {
        type: Number,
    },
    otherComments: {
        type: String,
    },
    user: {
        type: String,
    }
}, {timestamps: true});

const Review = mongoose.model('reviews', reviewSchema)
module.exports = Review;