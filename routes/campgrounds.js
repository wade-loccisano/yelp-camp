const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync'); //wrapper handles errors
const expressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage })

const campgrounds = require('../controllers/campgrounds');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

// const verifyAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if (!campground.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that');
//         return res.redirect(`/campgrounds/${id}`);
//     } 
//     next();   
// }


// Another way to do routing...
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// router.get('/', catchAsync(campgrounds.index));

// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
// router.post('/', upload.single('image'), (req, res) => {
//     res.send(req.body, req.file);
// })

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, catchAsync(campgrounds.renderEditForm))

router.put('/:id', upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', catchAsync(campgrounds.deleteCampground))

module.exports = router;