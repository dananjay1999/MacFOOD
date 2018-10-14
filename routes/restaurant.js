var express = require("express")
var router = express.Router(); 
var Restaurant = require("../models/restaurant")
var middleware = require("../middleware") 

//============================================
// GOOGLE MAPS 
//============================================
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//============================================
// DISPLAY ALL RESTAURANTS
//============================================
router.get("/", function(req, res){
    Restaurant.find({}, function(err, restaurant){
       if(err){
           console.log(err);
       } else {
          res.render("restaurant/index",{restaurant: restaurant, page: 'restaurant'});
       }
    });
});

//============================================
// POST A RESTAURANT
//============================================
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var Restaurant = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new restaurant and save to DB
    Restaurant.create(Restaurant, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to restaurant page
            console.log(newlyCreated);
            res.redirect("/restaurant");
        }
    });
  });
});

//============================================
// NEW RESTAURANT FORM
//============================================
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("restaurant/new"); 
})

//============================================
// DISPLAY(SHOW) A RESTAURANT
//============================================
router.get("/:id", function(req,res){
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log(err);
        } else {
            console.log(foundRestaurant);
            res.render("restaurant/show", {restaurant: foundRestaurant});
        }
    })
})

//============================================
// EDIT A RESTAURANT 
//============================================
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        res.render("restaurant/edit", {restaurant: foundRestaurant});
    });
});

//============================================
// UPDATE A RESTAURANT 
//============================================
router.put("/:id", middleware.checkRestaurantOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.restaurant.lat = data[0].latitude;
    req.body.restaurant.lng = data[0].longitude;
    req.body.restaurant.location = data[0].formattedAddress;

    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, restaurant){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/restaurant/" + restaurant._id);
        }
    });
  });
});

//============================================
// DELETE A RESTAURANT 
//============================================
router.delete("/:id", middleware.checkRestaurantOwnership, function(req,res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/restaurant")
        } else {
            res.redirect("/restaurant")
        }
    })
})

module.exports = router;