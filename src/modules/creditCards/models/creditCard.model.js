const mongoose = require("mongoose");

const creditCardSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String
    },
    limitGTQ: {
        type: Number,
        required: true
    },
    installmentsLimit: {
        type: Number,
        default: 0 // Will be set in service if 0
    },
    exchangeRate: {
        type: Number,
        default: 8 // Default conversion rate, user can update it
    },
    cutoffDay: {
        type: Number, // Day of the month (1-31)
        required: true
    },
    paymentDay: {
        type: Number, // Day of the month (1-31)
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: Limit in USD based on current rate
creditCardSchema.virtual('limitUSD').get(function() {
    return this.limitGTQ / this.exchangeRate;
});

module.exports = mongoose.model('CreditCard', creditCardSchema);
