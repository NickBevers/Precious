const User = require("../models/Users"); 
const passport = require("../passport/passport");

const postsignup = async (req, res, next) => {
    //signup
    //username uit request halen
    //password uit request halen
    //email uit request halen
    //bcrypt encrypt
    //databank
    let username = req.body.username;
    let password = req.body.password;

    const user = new User({username: username});
    await user.setPassword(password);
    await user.save().then(result =>{
        res.json({
            "status": "success"
        })
    }).catch(error => {
        res.json({
            "status": "error"
        })
    });
}

module.exports.postsignup = postsignup;