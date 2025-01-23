const listing = require("./models/listing.js")
const { listingSchema, error } = require('./schema');
const ExpressError = require('./utils/expressError');
const review = require("./models/review.js")



module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must be logged in the to create listing")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing1 = await listing.findById(id);

    if (!listing1.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "Access denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(e => e.message).join(', '));
    }
    next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
        const review1 = await review.findById(reviewId);

            if (!review1.author.equals(res.locals.currUser._id)) {
            req.flash("error", "Access denied");
            return res.redirect(`/listings/${id}`);
        }

        next();
 
};
