const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

const sectionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    income: {
        type: Number,
        default: 0
    },
    expenses: [expenseSchema],
    savings: { // "Ahorro" field from your image
        type: Number,
        default: 0
    }
});

const budgetSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['monthly', 'bi-weekly'],
        default: 'bi-weekly'
    },
    sections: [sectionSchema],
    currency: {
        type: String,
        default: 'GTQ'
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

// Virtuals for easy frontend calculations
budgetSchema.virtual('totalIncome').get(function() {
    if (!this.sections) return 0;
    return this.sections.reduce((acc, section) => acc + (section.income || 0), 0);
});

budgetSchema.virtual('totalExpenses').get(function() {
    if (!this.sections) return 0;
    return this.sections.reduce((acc, section) => {
        return acc + (section.expenses ? section.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0) : 0);
    }, 0);
});

module.exports = mongoose.model('Budget', budgetSchema);
