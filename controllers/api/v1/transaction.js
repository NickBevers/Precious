const Transaction = require('../../../models/Transactions');
// const ExtractJwt = require("passport-jwt").ExtractJwt;
const atob = require('atob');
const ObjectId = require('mongodb').ObjectId;
const User = require("../../../models/Users");

// POST new transaction
function newTransaction(req, res){
    let transaction = new Transaction();
    let user = getUser(req.headers.authorization);
    console.log(user);

    transaction.recipient = req.body.recipient;
    transaction.sender = user.email;
    transaction.amount = req.body.amount;
    transaction.reason = req.body.reason;
    transaction.message = req.body.message;
    // transaction.date = new Date().toUTCString(); // leesbare string vr jj-mm-dd-uu-minmin-secsec

    console.log(transaction.date);
    transaction.save((err, doc) => {
        if(err){
            res.json({
                status: "Error",
                message: "Could not fulfill your transaction request"})
        }

        if(!err){
            res.json({
                status: "Succes",
                message: "POSTING a new transaction",
                data:{
                    transaction:doc
                }
            })
        }
    })
}

// GET all transactions from 1 user
function getTransactions(req, res){
    let token = req.headers.authorization;
    let user = getUser(token);
    
    Transaction.find({$or: [{'recipient': user.email}, {'sender': user.email}]}, (err, doc) => {
    // Transaction.find({recipient: "Gollum@student.thomasmore.be"}, (err, doc) => {
        if(err){
            res.json({
                status: "Error",
                message: "Could not fulfill your transaction request"})
        }

        if(!err){
            res.json({
                status: "succes",
                message: `GETting all transactions from user! THIS WORKSSSSS`,
                user: user,
                data: doc
            })
        }
    }).sort({$natural:-1}); 
}

// GET all details from specific transaction
function getTransferById(req, res){
    let id = req.params.id.split('=')[1];
    let o_id = new ObjectId(id);
    let token = req.headers.authorization;
    let user = getUser(token);
    Transaction.findOne({"_id": o_id}, (err, doc) => {
            if(err){
                res.json({
                    status: "Error",
                    message: "Could not fulfill your transaction request"})
            }
    
            if(!err){
                res.json({
                    status: "succes",
                    message: `GETting transactions with id ${id} from user`,
                    user: user,
                    data: doc
                })
            }
    })
}

// GET all users with #coins per user
function getLeaderboard(req, res){
    User.find({}, (err, doc) =>{
        if(err){
            ress.json({
                status: "Error",
                message: "Could not get users for leaderboard"
            })
        }

        if(!err){
           res.json({
            status: "Succes",
            message: `GETting all coins per user`,
            data: doc 
           })  
        }
    }).sort({"coins": -1});
}

function getUser(token){
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);// atob zet versleutelde data om te zetten naar leesbare tekst
    const user = JSON.parse(rawPayload); // user uit token halen zonder dat je code nodig hebt.
    return user;
}

module.exports.newTransaction = newTransaction;
module.exports.getTransactions = getTransactions;
module.exports.getTransferById = getTransferById;
module.exports.getLeaderboard = getLeaderboard;