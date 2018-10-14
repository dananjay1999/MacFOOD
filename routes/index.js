var express = require("express")
var router = express.Router(); 
var passport = require("passport")
var User = require("../models/user")

//============================================
// ROOT - LANDING PAGE
//============================================
router.get("/", function(req,res){
    res.render("landing");
});

//============================================
// REGISTER FORM 
//============================================
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//============================================
// SIGN UP LOGIC
//============================================
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err,user){ // user is newly created user
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to MACFood " + user.username)
            res.redirect("/restaurant");
        })
    })
})

//============================================
// LOGIN FORM 
//============================================
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//============================================
// HANDLES LOGIN LOGIC
//============================================
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/restaurant", 
        failureRedirect: "/login"
    }), function(req,res){
})

//============================================
// LOGOUT LOGIC
//============================================
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/restaurant");
})

module.exports = router;