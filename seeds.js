var mongoose = require("mongoose");
var Restaurant = require("./models/restaurant");
var Comment = require("./models/comment");

var data = [
    {   
        name: "Algonquin Park",
        image: "https://media.blogto.com/uploads/2017/07/26/2017725-sleeping-giant.jpg?cmd=resize&quality=70&w=1400&height=2500",
        description: "This provincial park is at its finest when you head to the interior campsites and get away from the crowds at the main entry points. Once there, you'll be treated to the pristine wilderness of Ontario. You might just encounter a moose or two as well."
        
    },
    {
        name: "Sleeping Giant",
        image: "https://media.blogto.com/uploads/2017/07/26/2017725-Wabakimi.jpg?cmd=resize&quality=70&w=1400&height=2500",
        description: "It's not a coincidence that many of Ontario's most beautiful parks are found way up north. The topography north of Lake Superior is as dramatic as we have, and you'll get an amazing look at it from the challenging Giant Trail and Thunder Bay Lookout at this park."
    },
    {
        name: "Wabakimi",
        image: "https://media.blogto.com/uploads/2017/07/26/2017725-point-peele.jpg?cmd=resize&quality=70&w=1400&height=2500",
        description: "This is paradise for canoe lovers with over 2,000 kilometres of lakes and rivers to explore. There's even some white water sections for those looking to dial up the adrenalin."
    }
]

function seedDB(){
   //Remove all existing restaurant, then add new restaurant, then create new comments for each restaurant
   Restaurant.remove({}, function(err){
        if(err){
            console.log(err)
        }
        console.log("removed restaurant!")
        //add a few restaurant
        data.forEach(function(seed){
            Restaurant.create(seed, function(err, restaurant){
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Added a Restaurant!")
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet.",
                            author: "Homer"

                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                                restaurant.comments.push(comment);
                                restaurant.save();       
                                console.log("Created new comment")
                            }
                        })
                }
            })
        })
    })
    
    //add a few comments
}

module.exports = seedDB;
