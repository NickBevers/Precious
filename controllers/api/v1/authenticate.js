// const { token } = require("morgan");
const User = require("../../../models/Users"); 
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const config = require("config");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.gmail_user || config.get("gmail.gmail_user"),
      pass: process.env.gmail_password || config.get("gmail.gmail_password"),
    },
});

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
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;
    let coins = 100;

    const user = new User({firstname: firstname, lastname: lastname, email: email, coins: coins}); 
    await user.setPassword(password);
    await user.save().then(result =>{
        let token = jwt.sign({
            // uid: result._id,
            email: result.email
        }, process.env.jwtsecret || config.get("jwt.secret"));

        const url = `https://precious-coins.herokuapp.com/users/confirmation/${token}`;
        transporter.sendMail({
            to: result.email,
            subject: 'Confirm Precious account',
            html: `Please click this email to confirm your email: <a href="${url}" target="_blank">${url}</a>`,
        });

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

async function confirmUser(req, res){
    try{
        const user = jwt.verify(req.params.token, process.env.jwtsecret || config.get("jwt.secret"));
        console.log(user);
        await User.findOneAndUpdate({email:`${user.email}`}, {isVerified: true});
    }
    catch (e){
        console.log("Error: " + e);
    }
    return res.redirect('https://precious-coins.herokuapp.com/login.html');
}


module.exports.postsignup = postsignup;
module.exports.postlogin = postlogin;
module.exports.emailauth = emailauth;
module.exports.getAllUsers = getAllUsers;
module.exports.confirmUser = confirmUser;