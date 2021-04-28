const User = require("../../../models/Users"); 

const postsignup = async (req, res, next) => {
    //signup
    //username uit request halen
    //password uit request halen
    //email uit request halen?
    //bcrypt encrypt
    //databank
    console.log(req.body);

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;

    const user = new User({firstname: firstname, lastname: lastname, email: email}); //username: username,  
    await user.setPassword(password);
    await user.save().then(result =>{
        res.json({
            "status": "success"
        })
    }).catch(error => {
        res.json({
            "status": "error",
            "message": error
        })
    });
}

const postlogin = async (req, res, next) => {
    console.log("Gollum login?");
    console.log(req.body.email, req.body.password);

    const user = await User.authenticate()(req.body.email, req.body.password).then(result => {
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