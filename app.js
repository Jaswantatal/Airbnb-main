if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require("path");

const User = require("./models/user");
const listingroute = require("./route/listing");
const reviewroute = require("./route/review");
const userroute = require("./route/user");
const ExpressError = require("./utils/expressError");

const uri = process.env.URI


// MongoDB Configuration
const dbUrl = process.env.MONGOATLASURL || "mongodb://localhost:27017/yourLocalDB";

mongoose.connect(process.env.MONGOATLASURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: false, // Set to false for production
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

    mongoose.set('debug', true);

// App Configuration
app.engine("ejs", ejsMate);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Session Configuration with MongoStore
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET || "defaultsecret" },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.error("Session store error:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
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
    res.status(statusCode).render("listing/error.ejs", { message, statusCode });
});

// Start the Server
const PORT = process.env.PORT || 2020;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
