const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
    // firstname : {type: String, required:true},
    // lastname : {type: String, required:true},
    // email: {type: String, required:true, unique:true}
    firstname: String,
    lastname: String,
    email: String,
    coins: Number
});

User.plugin(passportLocalMongoose, {usernameField: "email"}); //

module.exports = mongoose.model("User", User);