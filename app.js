//============================
// REQUIRE THE PACKAGES
//============================
require('dotenv').config();
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Restaurant  = require("./models/restaurant"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//============================
// REQUIRE THE ROUTES
//============================
var commentRoutes    = require("./routes/comments"),
    restaurantRoutes = require("./routes/restaurant"),
    indexRoutes      = require("./routes/index")
    
//============================
// EXPRESS AND MONGOOSE SETUP
//============================
mongoose.connect("mongodb://localhost/macfood"); // Creates a MacFood Database
// mongoose.connect("mongodb://dananjay1999:july13@ds155864.mlab.com:55864/macfood");
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs"); // Sets the default view engine as "ejs"
app.use(express.static(__dirname + "/public")); // Tells express to run the "public" directory. (Express only runs app.js and the "views" directory as default)
app.use(methodOverride("_method")); // Allows us to use HTTP Verbs such as PUT or DELETE 
app.use(flash());
// seedDB(); //seed the database

//============================
// SESSION CONFIGURATIONS
//============================
app.use(require("express-session")({
    secret: "I love pizza!",
    resave: false,
    saveUninitialized: false
}));

//============================
// PASSPORT CONFIGURATIONS
//============================
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); // User is coming from the "UserSchema.plugin(passportLocalMongoose)" under the models section 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error")
   res.locals.success = req.flash("success")
   next();
});

app.use("/", indexRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/restaurant/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The MACFood Server Has Started!");
});