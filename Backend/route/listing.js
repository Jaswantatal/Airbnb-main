const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const listingcontroller = require("../controller/listingcontroller.js")
const listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")

const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({storage})


// Index route
router.get('/', wrapAsync(listingcontroller.index)); //index route come form controller file


// New listing form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listing/new.ejs');
});


//show route
router.get('/:id', wrapAsync(listingcontroller.show));



// Create route
router.post('/', 
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'), 
    wrapAsync(listingcontroller.createPost)
);




// Edit route
router.get('/:id/edit',isLoggedIn, isOwner,
    wrapAsync(listingcontroller.edit))

// Update route
router.put('/:id', isLoggedIn, isOwner, 
    upload.single('listing[image]'), 
     validateListing, wrapAsync(listingcontroller.update));

// Delete route
router.delete('/:id',isLoggedIn,isOwner,
     wrapAsync(listingcontroller.delete));


   
    

module.exports = router;
