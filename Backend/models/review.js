const { string, date } = require('joi');
const mongoose = require('mongoose');
const { type } = require('../schema');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({

    comment: String,
    rating: {
        type: String,
        min: 1,
        max: 5, 
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This should reference the User model
    }
});

const review = mongoose.model("Review", reviewSchema)

module.exports = review;