const User = require("../../../models/Users");
// const passport = require("passport");

// // CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// passport.user(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

const postsignup = (req, res, next) => {
    
    //signup
    //username uit request halen
    //password uit request halen
    //email uit request halen
    //bcrypt encrypt
    //databank
}

module.exports.postsignup = postsignup;