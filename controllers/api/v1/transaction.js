const Transaction = require('../../../models/Transactions');

// POST new transaction
function newTransaction(req, res){
    let transaction = new Transaction();
    transaction.recipient = req.body.recipient;
    transaction.amount = req.body.amount;
    transaction.reason = req.body.reason;
    transaction.message = req.body.message;

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
    Transaction.find({recipient: "Gollum@student.thomasmore.be"}, (err, doc) => {
        if(err){
            res.json({
                status: "Error",
                message: "Could not fulfill your transaction request"})
        }

        if(!err){
            res.json({
                status: "Succes",
                message: `GETting all transactions from user`,
                data: {
                    transaction: doc
                }
            })
        }
    }); 
}

// GET all details from specific transaction
function getTransferById(req, res){
    let id = req.params.id;
    res.json({
    status: "Succes",
    message: `GETting transactions with id ${id} from user`})
}

// GET aal users with #coins per user
function getLeaderboard(req, res){
    res.json({
    status: "Succes",
    message: `GETting all coins per user`})
}

module.exports.newTransaction = newTransaction;
module.exports.getTransactions = getTransactions;
module.exports.getTransferById = getTransferById;
module.exports.getLeaderboard = getLeaderboard;