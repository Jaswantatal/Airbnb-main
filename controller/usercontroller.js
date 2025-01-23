const User = require("../models/user.js");


//signup
module.exports.signup = async(req, res)=>{

    try {
        let {email, username, password} = req.body
        const newUser = new User ({email, username}) 
        let registerUser =  await  User.register(newUser, password)
        console.log(registerUser)
        req.login(registerUser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "User Registered Successfully")
            res.redirect("/listings")
        })
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/signup")
    }
 
}


//login
module.exports.login = async(req, res)=>{
    req.flash("success", "Welcome to AIRBNB")
    let redirect = res.locals.redirectUrl|| "/listings";
    res.redirect(redirect)
}


//logout
module.exports.logout = (req, res, next) =>{
    req.logout((err)=>{
         if(err){
             next(err)
         } 
         req.flash("success" , "you are logged out")
         res.redirect("/listings")
     }) 
 }