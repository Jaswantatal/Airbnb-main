const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require("./review.js");
const { listingSchema, type } = require('../schema');

const listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
       url: String,
       filename: String,
      },
    price: {
        type: Number, // Changed to Number for proper calculations
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: "Unknown", // Added default value
    },

    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    }
})

const listing = mongoose.model("Listing", listSchema);

module.exports = listing;
