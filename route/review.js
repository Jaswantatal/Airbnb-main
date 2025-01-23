const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const { listingSchema } = require('../schema');
const ExpressError = require('../utils/expressError');
const review = require("../models/review.js")
const listing = require('../models/listing.js');
const {isLoggedIn, isOwner, isReviewAuthor} = require("../middleware.js")
const reviewcontroller = require("../controller/reviewcontroller.js")



//review
router.post("/", isLoggedIn, reviewcontroller.createReview)

    //delete review route
    router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewcontroller.deleteReview));

    
    
    module.exports = router;