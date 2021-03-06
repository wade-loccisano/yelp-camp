const express = require('express');
const router = express.Router({mergeParams: true});

const reviews = require('../controllers/reviews');

const catchAsync = require('../utils/CatchAsync'); //wrapper handles errors
const expressError = require('../utils/ExpressError');

const {reviewSchema} = require('../schemas.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', catchAsync(reviews.deleteReview));

module.exports = router;