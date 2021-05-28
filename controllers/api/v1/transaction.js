const Transaction = require('../../../models/Transactions');
// const ExtractJwt = require("passport-jwt").ExtractJwt;
const atob = require('atob');
const ObjectId = require('mongodb').ObjectId;
const User = require("../../../models/Users");
const request = require('request-promise');
var cron = require('node-cron');
const hook = "T023QSENT4H/B023D804DUK/KuGr6mtvpEq4z3gtTCQ2wla8";

// give coins on september 1 at 11 o' clock (programmer's day): 
// Each users gets coins until they have 100
// if they have more, they get 20
cron.schedule('0 0 13 1 Sep * ', () => {
  User.updateMany({coins: {$gte: 100}}, {$inc: {coins: 20}});
  User.updateMany({coins: {$lt: 100}}, {$set: {coins: 100}});
}, {
  scheduled: true,
  timezone: "Europe/Brussels"
});


// give users their coins back on the first of each month
cron.schedule('0 0 8 1 * *', () => {
    User.find({}, {email: 1, coinsTransferred: 1}, (err, doc) => {
        if(!err){
            doc.forEach(u => {
                User.updateOne({email: u.email}, {$and: [{$inc: {coins: u.coinsTransferred}}, {coinsTransferred: 0}]})
            })
        }
    })
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});


// give coins on specific dates
// test
cron.schedule('0 2 9 26 May *', () => {
    specialTransfer(3, "BONUS FEATURE WORKS AGAIN");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on march 31 -> birthday of Tolkien
cron.schedule('0 0 8 3 Jan *', () => {
    specialTransfer(40, "The birthday of J.R.R. Tolkien");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on march 31 -> international backup day
cron.schedule('0 0 8 31 March *', () => {
    specialTransfer(20, "International backup day. Don't forget to backup your files");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on may 17 -> release nodejs 2009
cron.schedule('0 0 8 17 May *', () => {
    specialTransfer(10, "Nodejs was released on this day in 2009. Praise the developers");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on may 25 -> Geek pride
cron.schedule('0 0 8 25 May *', () => {
    specialTransfer(15, "Geek pride day. Be proud of who you are");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on june 8 -> international CAPS LOCK day
cron.schedule('0 0 8 8 June *', () => {
    specialTransfer(10, "CAPS LOCK DAY");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on july 28 -> sys admin appreciation day
cron.schedule('0 0 8 28 July *', () => {
    specialTransfer(15, "System admin appreciation day. Say 'Thank you'");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on september 15 -> launch of stackoverflow 2008
cron.schedule('0 0 8 15 Sep *', () => {
    specialTransfer(20, "StackOverflow launch today in 2008");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on september 22 -> hobbit day
cron.schedule('0 0 8 22 Sep *', () => {
    specialTransfer(30, "Praise the hobbits! It's hobbit day");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins in december 4 -> official release of javascript 1995
cron.schedule('0 0 8 4 Dec *', () => {
    specialTransfer(15, "Javasctipt was launched on this day in 1995");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on december 17 -> initial release of css 1996
cron.schedule('0 0 8 17 Dec *', () => {
    specialTransfer(15, "CSS was launched on this day in 1996");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on March 25 -> tolkien reading day
cron.schedule('0 0 8 25 March *', () => {
    specialTransfer(25, "International Tolkien Reading Day");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on August 1 -> World wide web day
cron.schedule('0 0 8 1 8 *', () => {
    specialTransfer(35, "We are celebrating world wide web day!!");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on October 3 -> Techies Day
cron.schedule('0 0 8 3 10 *', () => {
    specialTransfer(10, "Congratulations Techie! Today we celebrate you!");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on April 15 - 21 -> Coin Week
cron.schedule('0 0 8 15-21 4 *', () => {
    specialTransfer(5, "It is coin week! Expect a special gift each day!");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on August 26 -> WebMistress Day
cron.schedule('0 0 8 26 8 *', () => {
    specialTransfer(15, "Celebrating female developpers, give a shoutout to your colleague!");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on October 21 -> Get smart about credit day
cron.schedule('0 0 8 21 10 *', () => {
    specialTransfer(10, "Today is Get Smart About Credit Day, be sure to invest your precious coins!");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on May 20 -> Be a Millionaire Day
cron.schedule('0 0 8 20 5 *', () => {
    specialTransfer(20, "Today is is be a Millionaire Day! Be sure to give yourself some self care and invest in something you like!");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on April 1 -> One cent Day
cron.schedule('0 0 8 1 4 *', () => {
    specialTransfer(1, "No, it isn't an April fools joke, today is One cent Day!");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});

// give coins on May 23 -> Lucky Penny Day
cron.schedule('0 0 20 23 5 *', () => {
    specialTransfer(1, "Haven't found a penny today, Here is a coin from us, Happy Lucky Penny Day!");
}, {
    scheduled: true,
    timezone: "Europe/Brussels"
});


// POST new transaction
function newTransaction(req, res){
    let transaction = new Transaction();
    let user = getUser(req.headers.authorization);
    let amount = req.body.amount;
    let recipient = req.body.recipient;
    let reason = req.body.reason;
    let message = req.body.message;
    let slack = req.body.slack;

    let send = user.email.split('@')[0];
    let recieve = recipient.split('@')[0];

    let sfn = send.split('.')[0];
    let sln = send.split('.')[1];
    let rfn = recieve.split('.')[0];
    let rln = recieve.split('.')[1];

    transaction.recipient = recipient;
    transaction.sender = user.email;
    transaction.amount = amount;
    transaction.reason = reason;
    transaction.message = message;
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
                            User.findOneAndUpdate({email: user.email}, {$inc: {coins: negTempAmount, coinsTransferred: tempAmount}}, {returnNewDocument: true, useFindAndModify: false}, (err) =>{
                                if(err){
                                    res.json({
                                        status: "Error",
                                        message: "The transaction could not be sent - Update failed"
                                    })
                                }

                                if(!err){
                                    if(reason == "Buying IMD Swag"){
                                        User.findOneAndUpdate({email: recipient}, {$inc: {coins: tempAmount}}, {returnNewDocument: true, useFindAndModify: false}, async (err) =>{
                                            if(err){
                                                res.json({
                                                    status: "Error",
                                                    message: "The transaction could not be sent - Update failed"
                                                })
                                            }
            
                                            if(!err){
                                                if(reason == 'other'){reason = message}
                                                if(slack){await sendSlackMessage(sfn, sln, amount, rfn, rln, reason);}
                                                
                                                res.json({
                                                    status: "Success",
                                                    message: "Transaction sent succesfully",
                                                    user: user,
                                                    data: doc
                                                })
                                            }
                                        })
                                    }

                                    else{
                                        User.findOneAndUpdate({email: recipient}, {$inc: {coins: tempAmount}}, {returnNewDocument: true, useFindAndModify: false}, async (err) =>{ //, upsert: true
                                            if(err){
                                                res.json({
                                                    status: "Error",
                                                    message: "The transaction could not be sent - Update failed"
                                                })
                                            }
            
                                            if(!err){
                                                if(reason == 'other'){reason = message}
                                                if(slack){await sendSlackMessage(sfn, sln, amount, rfn, rln, reason);}
                                                res.json({
                                                    status: "Success",
                                                    message: "Transaction sent succesfully",
                                                    user: user,
                                                    data: doc
                                                })
                                            }
                                        })
                                    }
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
            Transaction.find({$or: [{'recipient': user.email}, {'recipient': "all@student.thomasmore.be"}, {'sender': user.email}]}, (err, doc) => {
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
    User.find({email: {$not: /gandalf.thegray@middle-earth.be/}}, { "firstname": 1, "lastname": 1, "coins": 1}, (err, doc) =>{
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

function specialTransfer(amount, message){
    let transaction = new Transaction();
    transaction.recipient = "all@student.thomasmore.be";
    transaction.sender = randomUser();
    transaction.amount = amount;
    transaction.reason = "other";
    transaction.message = message;

    transaction.save((err, doc) => {
        if(err){
            res.json({
                status: "Error",
                message: "The transaction could not be sent"
            })
        }

        if(!err){
            User.updateMany({}, {$inc: {coins: amount}}, {returnNewDocument: true, useFindAndModify: false}, (err, doc) =>{
                if(err){
                    res.json({
                        status: "Error",
                        message: "The transaction could not be sent - Update failed"
                    })
                }

                if(!err){
                    console.log("Success");
                }
            })
        }
    })
}

async function sendSlackMessage(sfn, sln, amount, rfn, rln, reason){
    try{
        let slackMessage = {
            text: `${sfn} ${sln} sent ${amount} coins to ${rfn} ${rln}.\nReason: ${reason}`,
        }

        await request({
            url: `https://hooks.slack.com/services/${hook}`,
            method: 'POST',
            body: slackMessage,
            json: true
        }).then(res => {
            console.log("HALLLLLOOOOOOO" + res);
        });
    }catch(e){
        console.log("ERROR: " + e)
    }

    

    
}

function getUser(token){
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);// atob zet versleutelde data om te zetten naar leesbare tekst
    const user = JSON.parse(rawPayload); // user uit token halen zonder dat je code nodig hebt.
    return user;
}

function randomUser(){
    let users = ["gandalf.thegray@middle-earth.be"]
    return "gandalf.thegray@middle-earth.be"
    //return users[Math.floor(Math.random() * users.length)]
}

module.exports.newTransaction = newTransaction;
module.exports.getTransactions = getTransactions;
module.exports.getTransferById = getTransferById;
module.exports.getLeaderboard = getLeaderboard;