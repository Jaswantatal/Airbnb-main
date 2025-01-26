const listing = require('../models/listing.js');

module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render('listing/index.ejs', { allListing: allListings });
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listingData = await listing.findById(id)
        .populate({path: "review",
            populate:{path: "author"} })
           .populate("owner");
    if (!listingData) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect('/listings');
    }

    res.render('listing/show.ejs', { listingdata: listingData });
}

module.exports.createPost = async (req, res) => {
    const newListing = new listing(req.body.listing);
    let url = req.file.path 
   let  filename = req.file.filename 
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    await newListing.save();
    req.flash("success", "New Listing created!")
    res.redirect('/listings');
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const listingData = await listing.findById(id);
    if(!listingData){
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect('/listings');
       }
      let orginialImage = listingData.image.url;
      orginialImage = orginialImage.replace("/upload", "/upload/w_200,")
    if (!listingData) throw new ExpressError(404, 'Listing not found');
    res.render('listing/edit.ejs', { listingdata: listingData, orginialImage });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
       let listing2 = await listing.findByIdAndUpdate(id, { ...req.body.listing });  
     if(typeof req.file !== "undefined"){
       let url = req.file.path 
    let  filename = req.file.filename 
    listing2.image = {url, filename}
    await listing2.save()
     }
    req.flash("success", "Listing Updated!")
        res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect('/listings');
}