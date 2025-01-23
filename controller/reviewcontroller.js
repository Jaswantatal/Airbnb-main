const review = require("../models/review.js")
const listing = require('../models/listing.js');

module.exports.createReview = async(req, res)=>{

    let listingdocument = await listing.findById(req.params.id)
    let newReview = new review(req.body.review)
   let reviewAuthor = newReview.author = req.user._id;

    listingdocument.review.push(newReview)

    await newReview.save();
     await listingdocument.save();
     req.flash("success", "New Review added!")
       res.redirect(`/listings/${listingdocument.id}`)     
}

module.exports.deleteReview = async (req, res) => {
        
    let {id, reviewId} = req.params;

    await listing.findByIdAndUpdate(id, {$pull:{review: reviewId}})
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")

    res.redirect(`/listings/${id}`);
}