const passport = require("passport");
const User = require("./../models/Users"); 

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

//serialize user data for sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//WEBTOKEN STRATEGY (JWT)
var JwtStrategy = require("passport-jwt").Strategy, ExtractJwt = require("passport-jwt").ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "Precioussecret";

passport.use(new JwtStrategy(opts, function(jwt_payload, done){
    User.findOne({email: jwt_payload.email}, function(err, user){ //{_id: jwt_payload._uid}
        if(err){
            return done(err, false);
        }
        if(user){
            return done(null, user);
        } else{
            return done(null, false);
        }
    });
}));

module.exports = passport;