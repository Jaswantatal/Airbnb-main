const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const { type } = require('../schema');
const { string, required } = require('joi');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);