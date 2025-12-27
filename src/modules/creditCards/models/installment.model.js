const mongoose = require("mongoose");

const installmentSchema = mongoose.Schema({
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
    description: {
        type: String,
        required: true
    },
    totalAmount: { // Original full amount of the debt
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['GTQ', 'USD'],
        required: true
    },
    totalInstallments: {
        type: Number,
        required: true
    },
    paidInstallments: {
        type: Number,
        default: 0
    },
    amountPerInstallment: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    lastPaymentDate: {
        type: Date
    },
    payments: [{
        number: Number,
        date: { type: Date, default: Date.now },
        amount: Number
    }]
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: Remaining Principal Debt
installmentSchema.virtual('remainingPrincipal').get(function() {
    return this.totalAmount - (this.paidInstallments * this.amountPerInstallment);
});

module.exports = mongoose.model('Installment', installmentSchema);
