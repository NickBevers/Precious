const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transactionSchema = new Schema({
    amount: Number,
    user: String,
    recipient: String,
    reason: String
})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;