const User = require("../models/Users"); 

const postsignup = async (req, res, next) => {
    //signup
    //username uit request halen
    //password uit request halen
    //email uit request halen?
    //bcrypt encrypt
    //databank
    console.log(req.body);

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

const postlogin = async (req, res, next) => {
    const user = await User.authenticate()(req.body.username, req.body.password).then(result => {
        res.json({
            "status": "success",
            "data": {
                "user": result
            }
        });
    }).catch(error => {
        res.json({
            "status": "error",
            "message": error
        })
    });
} 


module.exports.postsignup = postsignup;
module.exports.postlogin = postlogin;