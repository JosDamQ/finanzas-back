const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, allowUnionTypes: true});
require('ajv-errors')(ajv);

const expenseSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1 },
        amount: { type: 'number', minimum: 0 },
        category: { type: 'string' },
        isPaid: { type: 'boolean' }
    },
    required: ['name', 'amount']
};

const sectionSchema = {
    type: 'object',
    properties: {
        title: { type: 'string', minLength: 1 },
        income: { type: 'number', minimum: 0 },
        expenses: {
            type: 'array',
            items: expenseSchema
        },
        savings: { type: 'number', minimum: 0 }
    },
    required: ['title']
};

const schemaCreateBudget = {
    type: 'object',
    properties: {
        month: {
            type: 'number',
            minimum: 1,
            maximum: 12,
            errorMessage: {
                type: 'Month must be a number',
                minimum: 'Month must be between 1 and 12',
                maximum: 'Month must be between 1 and 12'
            }
        },
        year: {
            type: 'number',
            minimum: 2000,
            errorMessage: {
                type: 'Year must be a number',
                minimum: 'Year must be at least 2000'
            }
        },
        type: {
            type: 'string',
            enum: ['monthly', 'bi-weekly'],
            errorMessage: {
                enum: 'Type must be either monthly or bi-weekly'
            }
        },
        sections: {
            type: 'array',
            items: sectionSchema,
            minItems: 1,
            errorMessage: {
                type: 'Sections must be an array',
                minItems: 'At least one section is required'
            }
        },
        currency: {
            type: 'string',
            minLength: 3,
            maxLength: 3
        }
    },
    required: ['month', 'year', 'sections'],
    errorMessage: {
        required: {
            month: 'Month is required',
            year: 'Year is required',
            sections: 'Sections are required'
        }
    },
    additionalProperties: false
};

module.exports = schemaCreateBudget;
