const Transaction = require('../../../models/Transactions');
// const ExtractJwt = require("passport-jwt").ExtractJwt;
const atob = require('atob');
const ObjectId = require('mongodb').ObjectId;
const User = require("../../../models/Users");

// POST new transaction
function newTransaction(req, res){
    let transaction = new Transaction();
    let user = getUser(req.headers.authorization);
    let amount = req.body.amount;
    let recipient = req.body.recipient

    transaction.recipient = recipient;
    transaction.sender = user.email;
    transaction.amount = amount;
    transaction.reason = req.body.reason;
    transaction.message = req.body.message;
    // transaction.date = new Date().toUTCString(); // leesbare string vr jj-mm-dd-uu-minmin-secsec

    User.findOne({email: user.email}, {"coins": 1}, (err, doc) => {
        if(err){
            res.json({
                "status": "Error",
                "message": "The user could not be found"
            })
        }

        if(!err){
            let coins = doc.coins;
            if(amount > 0){
                if(coins >= amount){
                    transaction.save((err, doc) => {
                        if(err){
                            res.json({
                                status: "Error",
                                message: "The transaction could not be sent"
                            })
                        }
                
                        if(!err){
                            let tempAmount = parseInt(amount);
                            let negTempAmount = parseInt(`-${amount}`);
                            User.findOneAndUpdate({email: recipient}, {$inc: {coins: tempAmount}}, {returnNewDocument: true, useFindAndModify: false}, (err, doc) =>{
                                if(err){
                                    res.json({
                                        status: "Error",
                                        message: "The transaction could not be sent - Update failed"
                                    })
                                }

                                if(!err){
                                    User.findOneAndUpdate({email: user.email}, {$inc: {coins: negTempAmount}}, {returnNewDocument: true, useFindAndModify: false}, (err, doc) =>{
                                        if(err){
                                            res.json({
                                                status: "Error",
                                                message: "The transaction could not be sent - Update failed"
                                            })
                                        }
        
                                        if(!err){
                                            res.json({
                                                status: "Success",
                                                message: "Transaction sent succesfully"
                                            })
                                        }
                                    })
                                }
                            })
                            
                        }
                    })
                }
                else{
                    res.json({
                        status: "Error",
                        message: "Not enough coins are available"})
                }
            }
            else{
                res.json({
                    status: "Error",
                    message: "The amount you were trying to send was too small"
                })
            }
        }
    })
}

// GET all transactions from 1 user
function getTransactions(req, res){
    let token = req.headers.authorization;
    let user = getUser(token);
    
    User.findOne({email: user.email}, {"coins": 1}, (err, doc) => {
        if(err){
            res.json({
                "status": "Error",
                "message": "The user could not be found"
            })
        }

        if(!err){
            let coins = doc.coins;
            Transaction.find({$or: [{'recipient': user.email}, {'sender': user.email}]}, (err, doc) => {
                if(err){
                    res.json({
                        status: "Error",
                        message: "Could not fulfill your transaction request"})
                }
        
                if(!err){
                    res.json({
                        status: "Success",
                        user: user,
                        coins: coins,
                        data: doc
                    })
                }
            }).sort({$natural:-1});
        }
    }) 
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
                    message: "The transaction couldn't be found, please try again"})
            }
    
            if(!err){
                res.json({
                    status: "Success",
                    user: user,
                    data: doc
                })
            }
    })
}

// GET all users with #coins per user
function getLeaderboard(req, res){
    User.find({}, { "firstname": 1, "lastname": 1, "coins": 1}, (err, doc) =>{
        if(err){
            res.json({
                status: "Error",
                message: "Could not get users for leaderboard"
            })
        }

        if(!err){
           res.json({
            status: "Success",
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