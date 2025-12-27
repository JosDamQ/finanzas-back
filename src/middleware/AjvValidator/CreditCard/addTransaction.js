const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, allowUnionTypes: true});
require('ajv-errors')(ajv);

const schemaAddTransaction = {
    type: 'object',
    properties: {
        date: {
            type: 'string',
            // Using regex for YYYY-MM-DD or similar simple ISO-like string
            pattern: '^\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z?)?$',
            errorMessage: {
                pattern: 'Date must be a valid ISO string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)'
            }
        },
        description: {
            type: 'string',
            minLength: 1,
            errorMessage: {
                type: 'Description must be a string',
                minLength: 'Description is required'
            }
        },
        amount: {
            type: 'number',
            minimum: 0,
            errorMessage: {
                type: 'Amount must be a number',
                minimum: 'Amount must be non-negative'
            }
        },
        currency: {
            type: 'string',
            enum: ['GTQ', 'USD'],
            errorMessage: {
                enum: 'Currency must be GTQ or USD'
            }
        },
        category: {
            type: 'string'
        },
        isPaid: {
            type: 'boolean'
        }
    },
    required: ['description', 'amount', 'currency'],
    errorMessage: {
        required: {
            description: 'Description is required',
            amount: 'Amount is required',
            currency: 'Currency is required'
        }
    },
    additionalProperties: false
};

module.exports = schemaAddTransaction;
