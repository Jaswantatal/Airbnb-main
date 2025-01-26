const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { route } = require("./listing.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/usercontroller.js")

//send signup page
router.get("/signup", (req, res)=>{
    res.render("user/signup.ejs")
})


//signup
router.post("/signup", wrapAsync (usercontroller.signup))


//send login page
router.get("/login", (req, res)=>{
    res.render("user/login.ejs")
})


//login 
router.post(
    "/login" ,
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash: true,
    }),usercontroller.login
    )

//logout with passport
router.get("/logout", usercontroller.logout)


module.exports = router;