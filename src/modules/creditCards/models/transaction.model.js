const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreditCard',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['GTQ', 'USD'],
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    isPaid: { // To track if this transaction is already cleared/paid in the monthly bill
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Transaction', transactionSchema);
