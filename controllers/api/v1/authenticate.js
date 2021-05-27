// const { token } = require("morgan");
const User = require("../../../models/Users"); 
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const config = require("config");
const atob = require('atob');

const emailauth = (req, res, next) => {
    let emaildb = req.body.email;
    let number;

    User.find({email: emaildb}, (err, docs) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(docs);
            number = docs.length;
            // return number;
            
            console.log(number);

            if(number !== 0){
                res.json({
                    "status": "Error"
                })
            }
            else{
                res.json({
                    "status": "Success"
                })
            }
        }
    });
    
}

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
    let coins = 100;

    const user = new User({firstname: firstname, lastname: lastname, email: email, coins: coins}); 
    await user.setPassword(password);
    await user.save().then(result =>{
        // console.log(result._id);
        console.log(result.email);

        let token = jwt.sign({
            // uid: result._id,
            email: result.email
        }, process.env.jwtsecret || config.get("jwt.secret"));

        res.json({
            "status": "Success",
            "data": {
                "token": token
            }
        })
    }).catch(error => {
        res.json({
            "status": "Error",
            "message": error
        })
        console.log(error);
    });
}

const postlogin = async (req, res, next) => {
    console.log("Gollum login?");
    console.log(req.body.email, req.body.password);

    const user = await User.authenticate()(req.body.email, req.body.password).then(result => {

        if(!result.user){
            return res.json({
                "status": "failed",
                "message": "Login failed"
            })
        }
        let token = jwt.sign({
            // uid: result.user._id,
            email: result.user.email
        }, process.env.jwtsecret || config.get("jwt.secret"));
        
        return res.json({
            "status": "Success",
            "data": {
                "token": token
            }
        });
    }).catch(error => {
        res.json({
            "status": "Error",
            "message": error
        })
    });
} 

function getAllUsers(req, res){
    User.find({}, {firstname: 1, lastname: 1, email: 1}, (err, doc) =>{
        if(err){
            res.json({
                status: "Error",
                message: "Could not get user"
            })
        }

        if(!err){
           res.json({
            status: "Success",
            message: `GETting user`,
            data: doc
           })  
        }
    })
}


module.exports.postsignup = postsignup;
module.exports.postlogin = postlogin;
module.exports.emailauth = emailauth;
module.exports.getAllUsers = getAllUsers;