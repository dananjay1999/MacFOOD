var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

UserSchema.plugin(passportLocalMongoose); // Adds the methods from the passport-local-mongoose to UserSchema

module.exports = mongoose.model("User", UserSchema)