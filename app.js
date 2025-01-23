if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require("path");

const User = require("./models/user");
const listingroute = require("./route/listing");
const reviewroute = require("./route/review");
const userroute = require("./route/user");
const { listingSchema } = require("./schema");
const ExpressError = require("./utils/expressError");
const listing = require('./models/listing.js');


const dbUrl = process.env.MONGOATLASURL;


main().then(()=>{
    console.log("connected to DB")
}).catch((err) =>{
    console.log(err)
})
// Database Connection
async function main() {
    mongoose.connect(dbUrl);
}


// App Configuration
app.engine("ejs", ejsMate);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

//mongo connect config
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
        },
    touchAfter: 24*3600,
})

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION", err)
}
)

// Session Configuration
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    }
};



app.use(session(sessionOption));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listing", listingroute);
app.use("/listings", listingroute);
app.use("/listing/:id/review", reviewroute);
app.use("/", userroute);


  

// Catch-all Route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.render("listing/error.ejs", { message, statusCode });
});

// Start the Server
app.listen(2020, () => {
    console.log("Server is running on http://localhost:2020");
});
